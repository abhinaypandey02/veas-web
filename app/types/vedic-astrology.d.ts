declare module 'vedic-astrology' {
    interface BirthChartConfig {
        year: number;
        month: number;
        date: number;
        hours: number;
        minutes: number;
        seconds: number;
        latitude: number;
        longitude: number;
        timezone: number;
    }

    interface PlanetPosition {
        longitude: number;
        latitude?: number;
        sign?: string;
        nakshatra?: string;
    }

    interface ChartData {
        sun?: PlanetPosition;
        moon?: PlanetPosition;
        mercury?: PlanetPosition;
        venus?: PlanetPosition;
        mars?: PlanetPosition;
        jupiter?: PlanetPosition;
        saturn?: PlanetPosition;
        ascendant?: PlanetPosition;
        [key: string]: any;
    }

    export class VedicAstrology {
        constructor(config: BirthChartConfig);
        getBirthChart(): ChartData;
        getNavamsaChart(): ChartData;
    }
}
