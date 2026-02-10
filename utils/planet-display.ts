const PLANET_DISPLAY_NAME_MAP: Record<string, string> = {
  Rahu: "North Node",
  Ketu: "South Node",
};

export const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "\u2609",
  Moon: "\u263D",
  Mars: "\u2642",
  Mercury: "\u263F",
  Jupiter: "\u2643",
  Venus: "\u2640",
  Saturn: "\u2644",
  Rahu: "\u260A",
  Ketu: "\u260B",
};

export function getPlanetDisplayName(name: string) {
  return PLANET_DISPLAY_NAME_MAP[name] ?? name;
}
