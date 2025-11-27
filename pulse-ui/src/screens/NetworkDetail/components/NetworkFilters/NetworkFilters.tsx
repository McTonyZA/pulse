import { Group, Select, TextInput, Button, Box } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { NetworkFiltersProps, FilterType } from "./NetworkFilters.interface";

export const FILTER_OPTIONS = [
  { value: "AppVersion", label: "App Version" },
  { value: "DeviceModel", label: "Device Model" },
  { value: "Platform", label: "Platform" },
  { value: "GeoState", label: "Geo State" },
  { value: "OsVersion", label: "OS Version" },
  { value: "ScreenName", label: "Screen Name" },
  { value: "InteractionName", label: "Interaction Name" },
] as const;

export function NetworkFilters({
  appliedFilters,
  onAddFilter,
  onRemoveFilter,
}: NetworkFiltersProps) {
  const [selectedFilterType, setSelectedFilterType] =
    useState<FilterType | null>(null);
  const [filterValue, setFilterValue] = useState<string>("");

  const handleAddFilter = () => {
    if (selectedFilterType && filterValue.trim()) {
      onAddFilter(selectedFilterType, filterValue.trim());
      setFilterValue("");
      setSelectedFilterType(null);
    }
  };

  const availableFilterTypes = FILTER_OPTIONS.filter(
    (option) => !appliedFilters.some((f) => f.type === option.value),
  );

  return (
    <Box style={{ flex: 1 }}>
      {/* Filter Input - Combined Select + TextInput + Button */}
      <Group gap={0} style={{ width: "100%" }} wrap="nowrap">
        <Select
          placeholder="Select filter type"
          value={selectedFilterType || null}
          onChange={(value) =>
            setSelectedFilterType((value as FilterType) || null)
          }
          data={availableFilterTypes}
          style={{ width: 180, flexShrink: 0 }}
          searchable
          styles={{
            input: {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderRight: "none",
            },
          }}
        />
        <TextInput
          placeholder="Enter filter value"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddFilter();
            }
          }}
          style={{ flex: 1 }}
          styles={{
            input: {
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderRight: "none",
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              // marginRight: -1,
            },
          }}
        />
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={handleAddFilter}
          disabled={!selectedFilterType || !filterValue.trim()}
          size="sm"
          styles={{
            root: {
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            },
          }}
        >
          Add
        </Button>
      </Group>
    </Box>
  );
}
