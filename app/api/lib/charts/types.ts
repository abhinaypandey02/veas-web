// Auto-generated TypeScript interfaces (first 2 levels only)
// Deeper levels are typed as 'object'

export interface Ashtakavarga {
  bhav: object;
  sav: object;
  [key: string]: unknown;
}

export interface Ayanamsa {
  name: string;
  value: number;
  [key: string]: unknown;
}

export interface D1Chart {
  houses: unknown[];
  planets: unknown[];
  [key: string]: unknown;
}

interface DashasObject {
  mahadashas: {
    [key: string]: {
      start: string;
      end: string;
      antardashas: {
        [key: string]: {
          start: string;
          end: string;
          pratyantardashas: {
            [key: string]: {
              start: string;
              end: string;
            };
          };
        };
      };
    };
  };
}
export interface Dashas {
  all: DashasObject;
  balance: {
    [key: string]: number;
  };
  current: DashasObject;
  upcoming: DashasObject;
  [key: string]: unknown;
}

export interface DivisionalCharts {
  d10: object;
  d12: object;
  d16: object;
  d2: object;
  d20: object;
  d24: object;
  d27: object;
  d3: object;
  d30: object;
  d4: object;
  d40: object;
  d45: object;
  d60: object;
  d7: object;
  d9: object;
  [key: string]: unknown;
}

export interface Panchanga {
  karana: string;
  nakshatra: string;
  tithi: string;
  vaara: string;
  yoga: string;
  [key: string]: unknown;
}

export interface Person {
  birth_datetime: string;
  latitude: number;
  longitude: number;
  name: string | null;
  timezone: string | null;
  timezone_offset: number;
  [key: string]: unknown;
}

export interface GetChartsResponse {
  ashtakavarga: Ashtakavarga;
  ayanamsa: Ayanamsa;
  d1_chart: D1Chart;
  dashas: Dashas;
  divisional_charts: DivisionalCharts;
  panchanga: Panchanga;
  person: Person;
}
