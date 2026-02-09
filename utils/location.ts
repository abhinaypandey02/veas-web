export async function searchLocation(query: string) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`,
  ).then((res) => res.json() as Promise<SearchPlaceResponse[]>);

  return response;
}
export async function searchTimezone(lat: number, lon: number) {
  const response = await fetch(`/api/timezone?lat=${lat}&lon=${lon}`).then(
    (res) => res.json() as Promise<number>,
  );

  return response;
}

export interface SearchPlaceResponse {
  lat: string;
  type: string;
  lon: string;
  place_id: number;
  name: string;
  display_name: string;
  addresstype: string;
}

export interface SearchTimezoneResponse {
  gmtOffset: number;
}

export function getUTCDate(date: Date, timezoneOffset: number) {
  const localDate = new Date(date);
  localDate.setMinutes(
    localDate.getMinutes() -
      timezoneOffset * 60 -
      new Date().getTimezoneOffset(),
  );
  return localDate;
}

export function getLocalTime(date: Date, timezoneOffset: number) {
  const localDate = new Date(date);
  localDate.setMinutes(localDate.getMinutes() + timezoneOffset * 60);
  return localDate;
}
