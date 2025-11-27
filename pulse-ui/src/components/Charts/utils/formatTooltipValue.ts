export const formatTooltipValue = (
  value: any,
  decimalPlaces: number = 2,
): string => {
  return Number(value).toFixed(decimalPlaces);
};
