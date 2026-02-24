import React from "react";

export type ZodiacSign =
    | "Aries"
    | "Taurus"
    | "Gemini"
    | "Cancer"
    | "Leo"
    | "Virgo"
    | "Libra"
    | "Scorpio"
    | "Sagittarius"
    | "Capricorn"
    | "Aquarius"
    | "Pisces";

const ZODIAC_PATHS: Record<ZodiacSign, string> = {
    // Common simple vector shapes for zodiac signs
    Aries: "M12,18 C15,18 19,15 19,9 C19,5 15,3 12,3 C9,3 5,5 5,9 C5,15 9,18 12,18 Z M12,18 L12,21 M5,9 C5,6.5 6.5,5 9,5 M19,9 C19,6.5 17.5,5 15,5",
    Taurus: "M12,15 A5,5 0 1,0 12,5 A5,5 0 1,0 12,15 Z M7,10 Q12,3 17,10",
    Gemini: "M7,5 L17,5 M7,19 L17,19 M9,5 L9,19 M15,5 L15,19",
    Cancer: "M9,8 A3,3 0 1,0 9,14 A3,3 0 1,0 9,8 Z M15,10 A3,3 0 1,0 15,16 A3,3 0 1,0 15,10 Z M6,11 Q12,0 18,11 M6,13 Q12,24 18,13",
    Leo: "M6,12 A3,3 0 1,0 6,6 A3,3 0 1,0 6,12 Z M8,10 Q12,2 16,10 Q19,16 16,20 M16,20 A2,2 0 1,0 16,16",
    Virgo: "M5,6 L5,18 M9,6 L9,18 M13,6 L13,18 M5,6 Q9,2 13,6 M9,6 Q13,2 17,6 Q20,10 17,16 M17,16 Q15,20 18,20 Q21,20 19,15",
    Libra: "M5,19 L19,19 M5,15 L9,15 Q12,5 15,15 L19,15",
    Scorpio: "M5,6 L5,18 M9,6 L9,18 M13,6 L13,18 M5,6 Q9,2 13,6 M9,6 Q13,2 17,6 Q19,10 17,18 L18,20 L21,17",
    Sagittarius: "M17,7 L7,17 M17,7 L12,7 M17,7 L17,12 M10,14 L14,10",
    Capricorn: "M6,6 Q12,16 14,8 Q16,0 18,8 M18,8 Q20,18 14,18 A3,3 0 1,0 14,12",
    Aquarius: "M4,10 L8,6 L12,10 L16,6 L20,10 M4,16 L8,12 L12,16 L16,12 L20,16",
    Pisces: "M7,4 Q3,12 7,20 M17,4 Q21,12 17,20 M5,12 L19,12",
};

interface ZodiacIconProps extends React.SVGProps<SVGSVGElement> {
    sign: ZodiacSign | string;
}

export function ZodiacIcon({ sign, className, ...props }: ZodiacIconProps) {
    const path = ZODIAC_PATHS[sign as ZodiacSign];

    if (!path) {
        // Fallback if not matching standard signs
        return <span className={className}>{sign.substring(0, 3)}</span>;
    }

    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            <path d={path} />
        </svg>
    );
}
