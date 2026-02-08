export interface ResponseType {
  person: Person;
  ayanamsa: Ayanamsa;
  panchanga: Panchanga;
  d1_chart: D1Chart;
  divisional_charts: DivisionalCharts;
  ashtakavarga: Ashtakavarga;
  dashas: Dashas;
}

export enum Planet {
  Sun = "Sun",
  Moon = "Moon",
  Mars = "Mars",
  Mercury = "Mercury",
  Jupiter = "Jupiter",
  Venus = "Venus",
  Saturn = "Saturn",
  Rahu = "Rahu",
  Ketu = "Ketu",
}

export enum Sign {
  Aries = "Aries",
  Taurus = "Taurus",
  Gemini = "Gemini",
  Cancer = "Cancer",
  Leo = "Leo",
  Virgo = "Virgo",
  Libra = "Libra",
  Scorpio = "Scorpio",
  Sagittarius = "Sagittarius",
  Capricorn = "Capricorn",
  Aquarius = "Aquarius",
  Pisces = "Pisces",
}

export interface Dashas {
  balance: Partial<Record<Planet, number>>;
  all: DashasObject;
  current: DashasObject;
  upcoming: DashasObject;
}
export interface DashasObject {
  mahadashas: Partial<Record<Planet, MahadashaValue>>;
}
export interface MahadashaValue extends DashaValue {
  antardashas: Partial<Record<Planet, AntardashaValue>>;
}
export interface AntardashaValue extends DashaValue {
  pratyantardashas: Partial<Record<Planet, DashaValue>>;
}
export interface DashaValue {
  start: string;
  end: string;
}

export interface Ascendant {
  sign: string;
  d1_house_placement: number;
}

export interface Ashtakavarga {
  bhav: Partial<Record<Planet, Record<Sign, number>>>;
  sav: Record<Sign, number>;
}

export interface Aspects {
  gives: Gives[];
  receives: Receives[];
}

export interface AspectsReceived {
  aspecting_planet: string;
  aspect_type: string;
}

export interface Ayanamsa {
  name: string;
  value: number;
}

export interface DivisionalChartObject {
  chart_type: string;
  ascendant: Ascendant;
  houses: object[];
}

export interface D1Chart {
  planets: Occupants[];
  houses: Houses[];
}

export interface Dignities {
  dignity: string;
  planet_tattva: string;
  rashi_tattva: string;
  friendly_tattvas: string[];
}

export interface DivisionalCharts {
  d2: DivisionalChartObject;
  d3: DivisionalChartObject;
  d4: DivisionalChartObject;
  d7: DivisionalChartObject;
  d9: DivisionalChartObject;
  d10: DivisionalChartObject;
  d12: DivisionalChartObject;
  d16: DivisionalChartObject;
  d20: DivisionalChartObject;
  d24: DivisionalChartObject;
  d27: DivisionalChartObject;
  d30: DivisionalChartObject;
  d40: DivisionalChartObject;
  d45: DivisionalChartObject;
  d60: DivisionalChartObject;
}

export interface Gives {
  to_house?: number;
  aspect_type?: string;
  to_planet?: string;
}

export interface Houses {
  number: number;
  sign: string;
  lord: string;
  bhava_bala: number;
  occupants: Occupants[];
  aspects_received: AspectsReceived[];
  purposes: string[];
  lord_placed_sign: string;
  lord_placed_house: number;
  sign_degrees?: number | null;
  nakshatra?: string | null;
  pada?: number | null;
  nakshatra_deity?: string | null;
}

export interface Kaalabala {
  Natonnatabala: number;
  Pakshabala: number;
  Tribhagabala: number;
  VarshaMaasaDinaHoraBala: number;
  Ayanabala: number;
  Total: number;
  Yuddhabala: number;
}

export interface Occupants {
  celestial_body: string;
  sign: string;
  sign_degrees: number;
  nakshatra: string;
  pada: number;
  nakshatra_deity: string;
  house: number;
  motion_type: string;
  shadbala: Partial<Shadbala>;
  dignities: Dignities;
  conjuncts: string[];
  aspects: Aspects;
  has_lordship_houses: number[];
}
export interface DivisionalHouses {
  number: number;
  sign: string;
  lord: string;
  d1_house_placement: number;
  occupants: DivisionalOccupants[];
  aspects_received: AspectsReceived[];
  purposes: string[];
}
export interface DivisionalOccupants {
  celestial_body: string;
  sign: string;
  d1_house_placement: number;
}

export interface Panchanga {
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  vaara: string;
}

export interface Person {
  birth_datetime: string;
  latitude: number;
  longitude: number;
  timezone_offset: number;
  timezone?: number | null;
  name?: string | null;
}

export interface Receives {
  from_planet: string;
  aspect_type: string;
}

export interface Shadbala {
  Sthanabala: Sthanabala;
  Digbala: number;
  Kaalabala: Partial<Kaalabala>;
  Cheshtabala: number;
  Naisargikabala: number;
  Drikbala: number;
  Shadbala: Partial<ShadbalaObject>;
  Vimshopaka: Partial<Vimshopaka>;
  Ishtabala: number;
  Kashtabala: number;
}

export interface ShadbalaObject {
  Total: number;
  Rupas: number;
}

export interface Sthanabala {
  Uchhabala: number;
  Saptavargajabala: number;
  Ojhayugmarashiamshabala: number;
  Kendradhibala: number;
  Drekshanabala: number;
  Total: number;
}

export interface Vimshopaka {
  shadvarga: number;
  saptavarga: number;
  dashavarga: number;
  shodashavarga: number;
}
