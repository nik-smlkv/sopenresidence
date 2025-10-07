import * as XLSX from "xlsx";

export type ApartmentRaw = {
  "Oznaka stana ": string;
  "Lamela ": string;
  "Kvadratura PGD": number;
  Sprat: number;
  "Lemela ": string;
  "Broj spavaćih": number;
  "Orijent. ": string;
  "Opis orijentacije ": string;
  "Broj kupatila": number;
  "Broj toaleta": number;
  "Broj terasa": number;
  STATUS: string;
};

export type Apartment = {
  id: string;
  lamela: string;
  area: number;
  floor: number;
  orientation: string;
  orientationDesc: string;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  terraces: number;
  status: string;
};

export async function fetchExcelFromPublic(): Promise<Apartment[]> {
  const url = new URL("/apartments.xlsx", import.meta.url).href;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Не удалось загрузить Excel-файл");
  }

  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json<ApartmentRaw>(sheet);

  const mappedData: Apartment[] = rawData.map((row) => ({
    id: row["Oznaka stana "].trim(),
    lamela: row["Lamela "]?.trim() || row["Lemela "]?.trim(),
    area: row["Kvadratura PGD"],
    floor: row["Sprat"],
    orientation: row["Orijent. "]?.trim(),
    orientationDesc: row["Opis orijentacije "]?.trim(),
    bedrooms: row["Broj spavaćih"],
    bathrooms: row["Broj kupatila"],
    toilets: row["Broj toaleta"],
    terraces: row["Broj terasa"],
    status: row["STATUS"]?.trim(),
  }));
  return mappedData;
}

export async function getAvailableApartmentCount(): Promise<number> {
  const url = new URL("/apartments.xlsx", import.meta.url).href;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Не удалось загрузить Excel-файл");
  }

  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json<ApartmentRaw>(sheet);

  const availableApartments = rawData.filter(
    (row) => row.STATUS?.trim() === "Slobodan"
  );

  return availableApartments.length;
}

export async function getUnavailableApartments(): Promise<Apartment[]> {
  const url = new URL("/apartments.xlsx", import.meta.url).href;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Не удалось загрузить Excel-файл");
  }

  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json<ApartmentRaw>(sheet);

  const mappedData: Apartment[] = rawData.map((row) => ({
    id: row["Oznaka stana "]?.trim(),
    lamela: row["Lamela "]?.trim() || row["Lemela "]?.trim(),
    area: row["Kvadratura PGD"],
    floor: row["Sprat"],
    orientation: row["Orijent. "]?.trim(),
    orientationDesc: row["Opis orijentacije "]?.trim(),
    bedrooms: row["Broj spavaćih"],
    bathrooms: row["Broj kupatila"],
    toilets: row["Broj toaleta"],
    terraces: row["Broj terasa"],
    status: row["STATUS"]?.trim(),
  }));

  const unavailableApartments = mappedData.filter(
    (apt) => apt.status !== "Slobodan"
  );

  return unavailableApartments;
}
