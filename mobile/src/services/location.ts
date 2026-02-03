export type SearchPlaceResponse = {
  lat: string;
  lon: string;
  place_id: number;
  display_name: string;
};

export async function searchLocation(query: string) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
  );
  if (!response.ok) {
    throw new Error("Failed to search location");
  }
  return (await response.json()) as SearchPlaceResponse[];
}
