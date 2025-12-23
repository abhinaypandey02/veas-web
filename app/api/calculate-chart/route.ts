import { NextRequest, NextResponse } from 'next/server';
import * as Astronomy from 'astronomy-engine';

const ZODIAC_SIGNS = [
    { name: 'Aries', symbol: '♈' },
    { name: 'Taurus', symbol: '♉' },
    { name: 'Gemini', symbol: '♊' },
    { name: 'Cancer', symbol: '♋' },
    { name: 'Leo', symbol: '♌' },
    { name: 'Virgo', symbol: '♍' },
    { name: 'Libra', symbol: '♎' },
    { name: 'Scorpio', symbol: '♏' },
    { name: 'Sagittarius', symbol: '♐' },
    { name: 'Capricorn', symbol: '♑' },
    { name: 'Aquarius', symbol: '♒' },
    { name: 'Pisces', symbol: '♓' }
];

const LUNAR_MANSIONS = [
    'Hamal', 'Musca', 'Pleiades', 'Aldebaran', 'Meissa', 'Betelgeuse',
    'Pollux', 'Asellus Australis', 'Alphard', 'Regulus', 'Zosma', 'Denebola',
    'Algorab', 'Spica', 'Arcturus', 'Zubenelgenubi', 'Akrab', 'Antares',
    'Shaula', 'Kaus Australis', 'Nunki', 'Altair', 'Rotanev', 'Sadachbia',
    'Markab', 'Algenib', 'Zeta Piscium'
];

// Calculate Lahiri Ayanamsa (standard for Vedic astrology)
function calculateLahiriAyanamsa(date: Date): number {
    // Lahiri Ayanamsa formula
    // Reference date: 1900-01-01, Ayanamsa = 22° 27' 38.4"
    const referenceDate = new Date('1900-01-01T00:00:00Z');
    const referenceAyanamsa = 22.459556; // 22° 27' 38.4" in degrees

    const millisecondsPerYear = 365.25 * 24 * 60 * 60 * 1000;
    const yearsSinceReference = (date.getTime() - referenceDate.getTime()) / millisecondsPerYear;

    // Lahiri rate of precession: approximately 50.2388475" per year
    const precessionRate = 50.2388475 / 3600; // Convert arcseconds to degrees

    const ayanamsa = referenceAyanamsa + (yearsSinceReference * precessionRate);
    return ayanamsa;
}

function getSignFromDegree(degree: number) {
    // Normalize to 0-360
    let normalizedDegree = degree % 360;
    if (normalizedDegree < 0) normalizedDegree += 360;

    const signIndex = Math.floor(normalizedDegree / 30);
    const adjustedDegree = normalizedDegree % 30;
    const sign = ZODIAC_SIGNS[signIndex];

    return {
        name: sign.name,
        symbol: sign.symbol,
        adjustedDegree
    };
}

function getLunarMansionFromDegree(degree: number): string {
    // Normalize to 0-360
    let normalizedDegree = degree % 360;
    if (normalizedDegree < 0) normalizedDegree += 360;

    // Each Mansion is 13°20' (13.333... degrees)
    const mansionIndex = Math.floor(normalizedDegree / 13.333333333333334);
    return LUNAR_MANSIONS[mansionIndex] || LUNAR_MANSIONS[0];
}

function getTropicalSign(siderealDegree: number, ayanamsa: number): string {
    const tropicalDegree = (siderealDegree + ayanamsa) % 360;
    const signIndex = Math.floor(tropicalDegree / 30) % 12;
    return ZODIAC_SIGNS[signIndex].name;
}

// Convert ecliptic longitude to zodiacal position
function eclipticToZodiac(eclipticLongitude: number): number {
    // Astronomy-engine gives ecliptic longitude 0-360
    // We need to ensure it's properly normalized
    let longitude = eclipticLongitude % 360;
    if (longitude < 0) longitude += 360;
    return longitude;
}

// Geocoding helper
async function geocodeLocation(locationName: string): Promise<{ lat: number; lng: number } | null> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`,
            {
                headers: {
                    'User-Agent': 'VeasApp/1.0'
                }
            }
        );

        const data = await response.json();
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

// Calculate planetary positions using astronomy-engine
function calculatePlanetaryPositions(
    date: Date,
    latitude: number,
    longitude: number
) {
    // Calculate Lahiri Ayanamsa for the given date
    const ayanamsa = calculateLahiriAyanamsa(date);

    // Calculate tropical positions using astronomy-engine
    // Get geocentric vectors and convert to ecliptic coordinates
    const sunGeo = Astronomy.GeoVector(Astronomy.Body.Sun, date, false);
    const sunEcliptic = Astronomy.Ecliptic(sunGeo);

    const moonGeo = Astronomy.GeoMoon(date);
    const moonEcliptic = Astronomy.Ecliptic(moonGeo);

    //For planets, we need geocentric positions
    const mercuryGeo = Astronomy.GeoVector(Astronomy.Body.Mercury, date, false);
    const mercuryEcliptic = Astronomy.Ecliptic(mercuryGeo);

    const venusGeo = Astronomy.GeoVector(Astronomy.Body.Venus, date, false);
    const venusEcliptic = Astronomy.Ecliptic(venusGeo);

    const marsGeo = Astronomy.GeoVector(Astronomy.Body.Mars, date, false);
    const marsEcliptic = Astronomy.Ecliptic(marsGeo);

    const jupiterGeo = Astronomy.GeoVector(Astronomy.Body.Jupiter, date, false);
    const jupiterEcliptic = Astronomy.Ecliptic(jupiterGeo);

    const saturnGeo = Astronomy.GeoVector(Astronomy.Body.Saturn, date, false);
    const saturnEcliptic = Astronomy.Ecliptic(saturnGeo);

    // Calculate ascendant (rising sign)
    const observer = new Astronomy.Observer(latitude, longitude, 0);

    // Calculate local sidereal time
    const greenwichSiderealTime = Astronomy.SiderealTime(date);
    const localSiderealTime = (greenwichSiderealTime + longitude / 15) * 15; // Convert to degrees

    // Calculate ascendant using the formula
    const obliquity = 23.439291 - 0.0130042 * ((date.getTime() - new Date('2000-01-01').getTime()) / (365.25 * 24 * 60 * 60 * 1000) / 100);
    const latRad = latitude * Math.PI / 180;
    const oblRad = obliquity * Math.PI / 180;
    const lstRad = localSiderealTime * Math.PI / 180;

    const ascendantRad = Math.atan2(
        Math.cos(lstRad),
        -Math.sin(lstRad) * Math.cos(oblRad) - Math.tan(latRad) * Math.sin(oblRad)
    );
    let ascendantTropical = ascendantRad * 180 / Math.PI;
    if (ascendantTropical < 0) ascendantTropical += 360;

    // Convert tropical to sidereal by subtracting ayanamsa
    const convertToSidereal = (tropicalLongitude: number) => {
        let sidereal = tropicalLongitude - ayanamsa;
        if (sidereal < 0) sidereal += 360;
        return sidereal;
    };

    return {
        ayanamsa,
        sun: convertToSidereal(sunEcliptic.elon),
        moon: convertToSidereal(moonEcliptic.elon),
        mercury: convertToSidereal(mercuryEcliptic.elon),
        venus: convertToSidereal(venusEcliptic.elon),
        mars: convertToSidereal(marsEcliptic.elon),
        jupiter: convertToSidereal(jupiterEcliptic.elon),
        saturn: convertToSidereal(saturnEcliptic.elon),
        ascendant: convertToSidereal(ascendantTropical)
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { date, time, location, timezoneOffset } = body;

        // Geocode the location
        const coords = await geocodeLocation(location);
        if (!coords) {
            return NextResponse.json(
                { error: 'Could not find location. Please try a format like "New York, USA" or "Mumbai, India"' },
                { status: 400 }
            );
        }

        // Parse date and time
        const [year, month, day] = date.split('-').map(Number);
        const [hours, minutes] = time.split(':').map(Number);

        // Create Date object - births are usually relative to local time
        // We adjust by timezoneOffset to get actual UTC time
        const utcMillis = Date.UTC(year, month - 1, day, hours, minutes);
        const birthDate = new Date(utcMillis + ((timezoneOffset || 0) * 60000));

        // Calculate planetary positions
        const positions = calculatePlanetaryPositions(
            birthDate,
            coords.lat,
            coords.lng
        );

        // Get sun sign details
        const sunSign = getSignFromDegree(positions.sun);
        const tropicalSunSign = getTropicalSign(positions.sun, positions.ayanamsa);

        // Get moon sign and lunar mansion
        const moonSign = getSignFromDegree(positions.moon);
        const nakshatra = getLunarMansionFromDegree(positions.moon);

        // Get ascendant
        const ascendantSign = getSignFromDegree(positions.ascendant);

        // Prepare planets data
        const planets: any = {};
        const planetNames = ['mercury', 'venus', 'mars', 'jupiter', 'saturn'];

        planetNames.forEach(planetName => {
            const degree = positions[planetName as keyof typeof positions] as number;
            const sign = getSignFromDegree(degree);
            planets[planetName] = {
                sign: sign.name,
                degree: sign.adjustedDegree,
                retrograde: false
            };
        });

        const chart = {
            sunSign: {
                sidereal: sunSign.name,
                tropical: tropicalSunSign,
                symbol: sunSign.symbol,
                degree: sunSign.adjustedDegree
            },
            moonSign: {
                sidereal: moonSign.name,
                nakshatra,
                symbol: moonSign.symbol,
                degree: moonSign.adjustedDegree
            },
            ascendant: {
                sign: ascendantSign.name,
                symbol: ascendantSign.symbol,
                degree: ascendantSign.adjustedDegree
            },
            ayanamsa: positions.ayanamsa,
            planets
        };

        return NextResponse.json(chart);
    } catch (error) {
        console.error('Error calculating chart:', error);
        return NextResponse.json(
            { error: 'Failed to calculate chart. Please check your input and try again.' },
            { status: 500 }
        );
    }
}
