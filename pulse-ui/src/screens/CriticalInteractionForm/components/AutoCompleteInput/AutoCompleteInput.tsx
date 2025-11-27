import {
  GetScreeNameToEvenQueryMappingResponse,
  useGetScreenNameToEventQueryMapping,
} from "../../../../hooks/useGetScreenNameToEventQueryMapping";
import { AutoCompleteInputProps } from "./AutocompleteInput.interface";
import { Autocomplete, AutocompleteProps, Group, Text } from "@mantine/core";
import { CRITICAL_INTERACTION_FORM_CONSTANTS } from "../../../../constants";
import classes from "./AutoCompleteInput.module.css";
import { ApiResponse } from "../../../../helpers/makeRequest";
import { useRef } from "react";
import { EventsMetadata } from "../../CriticalInteractionForm.interface";

export function AutoCompleteInput(props: AutoCompleteInputProps) {
  const {
    eventName,
    onEventNameChange,
    onEventNameSelect,
    placeHolderText = CRITICAL_INTERACTION_FORM_CONSTANTS.AUTOCOMPLETE_PLACEHOLDER,
    badgeText = "",
  } = props;

  const eventMetadata = useRef<EventsMetadata>({});

  const { data, isFetching, error, isLoading } =
    useGetScreenNameToEventQueryMapping({
      queryParams: {
        search_string: eventName,
        limit: "10",
      },
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const fetchOptions = useCallback(debounce(refetch, 300), []);

  const getOptions = () => {
    if (isFetching || isLoading) {
      return [
        {
          label:
            CRITICAL_INTERACTION_FORM_CONSTANTS.AUTOCOMPLETE_FETCHING_PLACEHOLDER,
          value:
            CRITICAL_INTERACTION_FORM_CONSTANTS.AUTOCOMPLETE_FETCHING_PLACEHOLDER,
          key: CRITICAL_INTERACTION_FORM_CONSTANTS.AUTOCOMPLETE_FETCHING_PLACEHOLDER,
          disabled: true,
        },
      ];
    }

    if (error) {
      return [
        {
          label:
            CRITICAL_INTERACTION_FORM_CONSTANTS.AUTOCOMPLETE_ERROR_PLACEHOLDER,
          value:
            CRITICAL_INTERACTION_FORM_CONSTANTS.AUTOCOMPLETE_ERROR_PLACEHOLDER,
          key: CRITICAL_INTERACTION_FORM_CONSTANTS.AUTOCOMPLETE_ERROR_PLACEHOLDER,
          disabled: true,
        },
      ];
    }

    if (!data || !data.data) {
      return [];
    }

    const { data: eventsData } =
      data as ApiResponse<GetScreeNameToEvenQueryMappingResponse>;

    if (
      !eventsData?.eventList ||
      !Array.isArray(eventsData.eventList) ||
      !eventsData.eventList.length
    ) {
      return [];
    }

    let eventsGroupingBasedOnScreenName: Record<string, Array<string>> = {};
    let tempEventsMetadata: EventsMetadata = {};

    eventsData.eventList.forEach((event) => {
      const eventName = event?.metadata?.eventName || "";
      if (eventName && !tempEventsMetadata[eventName]) {
        tempEventsMetadata[eventName] = {
          description:
            event?.metadata?.description ||
            CRITICAL_INTERACTION_FORM_CONSTANTS.NO_DESCRIPTION_MESSAGE,
          properties: event.properties,
        };
      }
      event?.metadata?.screenNames?.forEach((screenName) => {
        if (!eventsGroupingBasedOnScreenName[screenName]) {
          eventsGroupingBasedOnScreenName[screenName] = [eventName];
        } else {
          eventsGroupingBasedOnScreenName[screenName].push(eventName);
        }
      });
    });

    let suggestions = [];

    for (const item in eventsGroupingBasedOnScreenName) {
      suggestions.push({
        group: item,
        items: eventsGroupingBasedOnScreenName[item],
      });
    }

    eventMetadata.current = tempEventsMetadata;

    return suggestions;
  };

  const onChange = (eventName: string) => {
    onEventNameChange(eventName);
  };

  const renderAutocompleteOption: AutocompleteProps["renderOption"] = ({
    option,
  }) => {
    return (
      <Group gap="sm">
        <div>
          <Text size="sm">{option.value}</Text>
          <Text size="xs" opacity={0.5}>
            {eventMetadata.current[option.value]?.description || ""}
          </Text>
        </div>
      </Group>
    );
  };

  const onOptionSubmit = (selectedEventName: string) => {
    onEventNameSelect?.(eventMetadata.current[selectedEventName].properties);
  };

  return (
    <Autocomplete
      rightSectionWidth={100}
      size={CRITICAL_INTERACTION_FORM_CONSTANTS.TEXT_INPUT_SIZE}
      radius={CRITICAL_INTERACTION_FORM_CONSTANTS.TEXT_INPUT_SIZE}
      className={classes.eventSequenceItemAutocomplete}
      placeholder={placeHolderText}
      data={getOptions()}
      onChange={onChange}
      value={eventName}
      withAsterisk
      limit={100}
      onOptionSubmit={onOptionSubmit}
      renderOption={renderAutocompleteOption}
      required
      maxDropdownHeight={300}
      label={badgeText}
    />
  );
}
