/**
 * Dynamically generates graduation year options.
 * Future-proof implementation that includes past years and sufficient future years
 * programmatically based on the current year.
 */
export function getGraduationYearOptions(startOffset = -5, endOffset = 10): { label: string; value: number }[] {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear + startOffset;
  const endYear = currentYear + endOffset;

  const options: { label: string; value: number }[] = [];
  for (let year = startYear; year <= endYear; year++) {
    options.push({
      label: String(year),
      value: year,
    });
  }
  return options;
}
