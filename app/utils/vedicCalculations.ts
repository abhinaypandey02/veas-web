export interface BirthData {
    name: string;
    email: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    location: string;
    timezoneOffset?: number; // In minutes, from new Date().getTimezoneOffset()
}

export interface VedicChart {
    sunSign: {
        sidereal: string;
        tropical: string;
        symbol: string;
        degree: number;
    };
    moonSign: {
        sidereal: string;
        nakshatra: string;
        symbol: string;
        degree: number;
    };
    ascendant: {
        sign: string;
        symbol: string;
        degree: number;
    };
    ayanamsa: number;
    planets: {
        [key: string]: {
            sign: string;
            degree: number;
            retrograde: boolean;
        };
    };
}

export async function calculateChart(birthData: BirthData): Promise<VedicChart> {
    try {
        const response = await fetch('/api/calculate-chart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(birthData),
        });

        if (!response.ok) {
            throw new Error('Failed to calculate chart');
        }

        const chart = await response.json();
        return chart;
    } catch (error) {
        console.error('Error calculating chart:', error);
        throw error;
    }
}
