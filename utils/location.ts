export async function searchLocation(query: string) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`,
  ).then((res) => res.json() as Promise<SearchPlaceResponse[]>);

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
