export const toCSV = (rows: Record<string, unknown>[]): string => {
  if (rows.length === 0) return '';

  const headers = Object.keys(rows[0]);
  const escapeCell = (value: unknown): string => {
    const str = value === null || value === undefined ? '' : String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerRow = headers.join(',');
  const dataRows = rows.map((row) => headers.map((h) => escapeCell(row[h])).join(','));

  return [headerRow, ...dataRows].join('\n');
};