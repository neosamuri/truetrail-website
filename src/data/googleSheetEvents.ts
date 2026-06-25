import Papa from "papaparse";

export type SheetEvent = {
  published: string;
  trailNumber: string;
  title: string;
  date: string;
  time: string;
  locationName: string;
  address: string;
  hares: string;
  theme: string;
  hashCash: string;
  description: string;
  mapUrl?: string;
  paypalUrl?: string;
};

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSeOtc-wh6amahFVCZqn7oXXAwNgM_B9rwRzH8kzVxH2lATSnokc6d4I6tW_wpW4WDjRqaR_r4iksX5/pub?gid=0&single=true&output=csv";

export async function getEvents(): Promise<SheetEvent[]> {
  const response = await fetch(SHEET_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch Google Sheet: ${response.status}`);
  }

  const csv = await response.text();

  const parsed = Papa.parse<SheetEvent>(csv, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    console.warn("CSV parse warnings:", parsed.errors);
  }

  return parsed.data
    .filter((event) => event.published?.trim().toUpperCase() === "TRUE")
    .sort((a, b) => a.date.localeCompare(b.date));
}