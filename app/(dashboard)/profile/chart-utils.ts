import React from 'react';

export const ZODIAC_SYMBOLS: Record<string, string> = {
    Aries: '♈',
    Taurus: '♉',
    Gemini: '♊',
    Cancer: '♋',
    Leo: '♌',
    Virgo: '♍',
    Libra: '♎',
    Scorpio: '♏',
    Sagittarius: '♐',
    Capricorn: '♑',
    Aquarius: '♒',
    Pisces: '♓',
};

export const SIGNS = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
];

// Helper to calculate cartesian from polar
export function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

// Generate the SVG path for a sector
export function describeArc(x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) {
    const startObjOuter = polarToCartesian(x, y, outerRadius, endAngle);
    const endObjOuter = polarToCartesian(x, y, outerRadius, startAngle);

    const startObjInner = polarToCartesian(x, y, innerRadius, endAngle);
    const endObjInner = polarToCartesian(x, y, innerRadius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
        "M", startObjOuter.x, startObjOuter.y,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endObjOuter.x, endObjOuter.y,
        "L", endObjInner.x, endObjInner.y,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startObjInner.x, startObjInner.y,
        "Z"
    ].join(" ");
}
