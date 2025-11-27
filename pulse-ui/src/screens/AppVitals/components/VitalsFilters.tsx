import { Box, Group, SegmentedControl, Badge } from "@mantine/core";
import {
  IconBug,
  IconAlertTriangle,
  IconExclamationCircle,
} from "@tabler/icons-react";
import { ISSUE_TYPES } from "../AppVitals.constants";
import type { VitalsStats } from "../AppVitals.interface";
import classes from "./VitalsFilters.module.css";

interface VitalsFiltersProps {
  issueType: string;
  onIssueTypeChange: (value: string) => void;
  stats: VitalsStats;
}

export const VitalsFilters: React.FC<VitalsFiltersProps> = ({
  issueType,
  onIssueTypeChange,
  stats,
}) => {
  return (
    <Box>
      <SegmentedControl
        value={issueType}
        onChange={onIssueTypeChange}
        size="md"
        className={classes.segmentedControl}
        fullWidth={false}
        data={[
          {
            label: (
              <Group gap={6} wrap="nowrap">
                <IconBug size={16} />
                <span>Crashes</span>
                <Badge
                  size="sm"
                  variant="filled"
                  color="red"
                  style={{ minWidth: 24 }}
                >
                  {stats.crashes}
                </Badge>
              </Group>
            ),
            value: ISSUE_TYPES.CRASHES,
          },
          {
            label: (
              <Group gap={6} wrap="nowrap">
                <IconAlertTriangle size={16} />
                <span>ANRs</span>
                <Badge
                  size="sm"
                  variant="filled"
                  color="orange"
                  style={{ minWidth: 24 }}
                >
                  {stats.anrs}
                </Badge>
              </Group>
            ),
            value: ISSUE_TYPES.ANRS,
          },
          {
            label: (
              <Group gap={6} wrap="nowrap">
                <IconExclamationCircle size={16} />
                <span>Non-Fatal</span>
                <Badge
                  size="sm"
                  variant="filled"
                  color="blue"
                  style={{ minWidth: 24 }}
                >
                  {stats.nonFatals}
                </Badge>
              </Group>
            ),
            value: ISSUE_TYPES.NON_FATALS,
          },
        ]}
      />
    </Box>
  );
};
