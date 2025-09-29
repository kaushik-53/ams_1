import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function exportToCsv(filename: string, rows: (string | number)[][]) {
  const processRow = function (row: (string | number)[]) {
    let finalVal = '';
    for (let j = 0; j < row.length; j++) {
      let innerValue = row[j] === null || row[j] === undefined ? '' : String(row[j]);
      if (typeof row[j] === 'string' && (row[j] as string).includes(',')) {
        innerValue = '"' + innerValue.replace(/"/g, '""') + '"';
      }
      if (j > 0) finalVal += ',';
      finalVal += innerValue;
    }
    return finalVal + '\n';
  };

  let csvFile = rows.map(processRow).join('');

  const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
