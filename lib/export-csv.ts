/**
 * CSV Export Utility
 * Generates and downloads CSV files from registration data
 */

export interface CSVExportData {
  playerName: string;
  playerAge: number;
  playerGrade: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalInfo: string | null;
  tryoutAgeGroup: string;
  tryoutDate: string;
  tryoutLocation: string;
  registeredAt: string;
}

function escapeCSVField(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '""';
  const str = String(value);
  // If the field contains comma, newline, or quote, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export function generateRegistrationsCSV(registrations: CSVExportData[]): string {
  const headers = [
    'Player Name',
    'Age',
    'Grade',
    'Parent Name',
    'Parent Email',
    'Parent Phone',
    'Emergency Contact',
    'Emergency Phone',
    'Medical Info',
    'Tryout Age Group',
    'Tryout Date',
    'Tryout Location',
    'Registered At',
  ];

  const headerRow = headers.map(escapeCSVField).join(',');

  const dataRows = registrations.map((reg) =>
    [
      reg.playerName,
      reg.playerAge,
      reg.playerGrade,
      reg.parentName,
      reg.parentEmail,
      reg.parentPhone,
      reg.emergencyContact,
      reg.emergencyPhone,
      reg.medicalInfo || '',
      reg.tryoutAgeGroup,
      reg.tryoutDate,
      reg.tryoutLocation,
      reg.registeredAt,
    ]
      .map(escapeCSVField)
      .join(',')
  );

  return [headerRow, ...dataRows].join('\n');
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatDateString(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}