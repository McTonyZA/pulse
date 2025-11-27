import { Box, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { IconMoodSad } from "@tabler/icons-react";
import { ErrorAndEmptyStateProps } from "./ErrorAndEmptyState.interface";

export function ErrorAndEmptyState({
  message,
  description,
  classes,
}: ErrorAndEmptyStateProps) {
  const theme = useMantineTheme();

  return (
    <Box className={classes ? classes.join(" ") : ""}>
      <Stack align="center" gap="xs">
        <IconMoodSad />
        <Title size={theme.fontSizes.md}>{message ?? ""}</Title>
        {description && (
          <Text size="sm" c="dimmed" ta="center">
            {description}
          </Text>
        )}
      </Stack>
    </Box>
  );
}
