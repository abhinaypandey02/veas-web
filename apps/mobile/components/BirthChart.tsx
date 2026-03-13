import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, {
    Circle,
    Line,
    Path,
    Text as SvgText,
    G,
} from "react-native-svg";

// ─── Constants ─────────────────────────────────────────────

const ZODIAC_SYMBOLS: Record<string, string> = {
    Aries: "♈",
    Taurus: "♉",
    Gemini: "♊",
    Cancer: "♋",
    Leo: "♌",
    Virgo: "♍",
    Libra: "♎",
    Scorpio: "♏",
    Sagittarius: "♐",
    Capricorn: "♑",
    Aquarius: "♒",
    Pisces: "♓",
};

const PLANET_SYMBOLS: Record<string, string> = {
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

const SIGNS = [
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

const PLANET_DISPLAY_NAME_MAP: Record<string, string> = {
    Rahu: "North Node",
    Ketu: "South Node",
};

function getPlanetDisplayName(name: string) {
    return PLANET_DISPLAY_NAME_MAP[name] ?? name;
}

// ─── Geometry Helpers ──────────────────────────────────────

function polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number,
) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
    };
}

function describeArc(
    x: number,
    y: number,
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number,
) {
    const startObjOuter = polarToCartesian(x, y, outerRadius, endAngle);
    const endObjOuter = polarToCartesian(x, y, outerRadius, startAngle);
    const startObjInner = polarToCartesian(x, y, innerRadius, endAngle);
    const endObjInner = polarToCartesian(x, y, innerRadius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
        "M",
        startObjOuter.x,
        startObjOuter.y,
        "A",
        outerRadius,
        outerRadius,
        0,
        largeArcFlag,
        0,
        endObjOuter.x,
        endObjOuter.y,
        "L",
        endObjInner.x,
        endObjInner.y,
        "A",
        innerRadius,
        innerRadius,
        0,
        largeArcFlag,
        1,
        startObjInner.x,
        startObjInner.y,
        "Z",
    ].join(" ");
}

// ─── Component ─────────────────────────────────────────────

interface BirthChartProps {
    planets: { name: string; sign: string; house: number }[];
}

export default function BirthChart({ planets }: BirthChartProps) {
    const size = 700;
    const center = size / 2;
    const outerRadius = 330;
    const midRadius = 210;
    const innerRadius = 155;
    const coreRadius = 100;

    // Calculate ascendant sign from planet data
    let ascendantSign = "Aries";
    if (planets.length > 0) {
        const planet = planets[0];
        const signIndex = SIGNS.indexOf(planet.sign);
        if (signIndex !== -1) {
            const ascIndex = (((signIndex - (planet.house - 1)) % 12) + 12) % 12;
            ascendantSign = SIGNS[ascIndex];
        }
    }

    const ascendantIndex = SIGNS.indexOf(ascendantSign);

    // Group planets by house
    const houseMap = new Map<number, { name: string; sign: string }[]>();
    for (let i = 1; i <= 12; i++) houseMap.set(i, []);
    for (const p of planets) {
        houseMap.get(p.house)?.push({ name: p.name, sign: p.sign });
    }

    const houses = Array.from({ length: 12 }, (_, i) => {
        const houseNum = i + 1;
        const endAngle = 270 - i * 30;
        const startAngle = endAngle - 30;
        const signIndex = (ascendantIndex + i) % 12;
        const signName = SIGNS[signIndex];

        return {
            houseNum,
            startAngle,
            endAngle,
            signName,
            planets: houseMap.get(houseNum) || [],
        };
    });

    const color = "#1a1a1a";

    return (
        <View style={styles.container}>
            <Svg
                viewBox={`0 0 ${size} ${size}`}
                width="100%"
                height="100%"
                style={{ aspectRatio: 1 }}
            >
                {/* Outer Ring (Signs) */}
                {houses.map((h) => {
                    const midAngle = (h.startAngle + h.endAngle) / 2;
                    const textPos = polarToCartesian(
                        center,
                        center,
                        (outerRadius + midRadius) / 2,
                        midAngle,
                    );

                    let rotation = midAngle + 90;
                    rotation = ((rotation % 360) + 360) % 360;
                    const isFlipped = rotation > 90 && rotation < 270;
                    if (isFlipped) {
                        rotation += 180;
                    }

                    return (
                        <G key={`sign-${h.houseNum}`}>
                            {/* Arc border */}
                            <Path
                                d={describeArc(
                                    center,
                                    center,
                                    midRadius,
                                    outerRadius,
                                    h.startAngle,
                                    h.endAngle,
                                )}
                                fill="none"
                                stroke={color}
                                strokeWidth="1"
                                opacity={0.2}
                            />

                            {/* Zodiac symbol */}
                            <SvgText
                                x={textPos.x}
                                y={textPos.y - (isFlipped ? 8 : -8)}
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                fontSize="16"
                                fill={color}
                                opacity={0.7}
                                rotation={rotation}
                                origin={`${textPos.x}, ${textPos.y - (isFlipped ? 8 : -8)}`}
                            >
                                {ZODIAC_SYMBOLS[h.signName] || "?"}
                            </SvgText>

                            {/* Sign name */}
                            <SvgText
                                x={textPos.x}
                                y={textPos.y + (isFlipped ? -10 : 10)}
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                fontSize="8"
                                fill={color}
                                opacity={0.6}
                                fontWeight="500"
                                letterSpacing={1}
                                rotation={rotation}
                                origin={`${textPos.x}, ${textPos.y + (isFlipped ? -10 : 10)}`}
                            >
                                {h.signName.toUpperCase()}
                            </SvgText>
                        </G>
                    );
                })}

                {/* Inner Ring (Houses & Planets) */}
                {houses.map((h) => {
                    const midAngle = (h.startAngle + h.endAngle) / 2;
                    const houseTextPos = polarToCartesian(
                        center,
                        center,
                        (innerRadius + coreRadius) / 2,
                        midAngle,
                    );

                    return (
                        <G key={`house-${h.houseNum}`}>
                            {/* Inner sector border */}
                            <Path
                                d={describeArc(
                                    center,
                                    center,
                                    coreRadius,
                                    midRadius,
                                    h.startAngle,
                                    h.endAngle,
                                )}
                                fill="none"
                                stroke={color}
                                strokeWidth="1"
                                opacity={0.2}
                            />

                            {/* Planets in this house */}
                            {h.planets.map((p, pIdx) => {
                                const pRadius =
                                    (midRadius + innerRadius) / 2 +
                                    (pIdx - (h.planets.length - 1) / 2) * 20;
                                const pPos = polarToCartesian(center, center, pRadius, midAngle);
                                return (
                                    <G key={p.name}>
                                        <SvgText
                                            x={pPos.x - 14}
                                            y={pPos.y}
                                            textAnchor="end"
                                            alignmentBaseline="middle"
                                            fontSize="9"
                                            fill={color}
                                            opacity={0.85}
                                            fontWeight="500"
                                            letterSpacing={0.5}
                                        >
                                            {getPlanetDisplayName(p.name).toUpperCase()}
                                        </SvgText>
                                        <SvgText
                                            x={pPos.x + 4}
                                            y={pPos.y}
                                            textAnchor="start"
                                            alignmentBaseline="middle"
                                            fontSize="16"
                                            fill={color}
                                            opacity={0.85}
                                        >
                                            {PLANET_SYMBOLS[p.name] || p.name.substring(0, 2)}
                                        </SvgText>
                                    </G>
                                );
                            })}

                            {/* House Number */}
                            <SvgText
                                x={houseTextPos.x}
                                y={houseTextPos.y}
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                fontSize="13"
                                fill={color}
                                opacity={0.4}
                            >
                                {h.houseNum}
                            </SvgText>

                            {/* House separator line */}
                            <Line
                                x1={polarToCartesian(center, center, coreRadius, h.startAngle).x}
                                y1={polarToCartesian(center, center, coreRadius, h.startAngle).y}
                                x2={
                                    polarToCartesian(center, center, outerRadius, h.startAngle).x
                                }
                                y2={
                                    polarToCartesian(center, center, outerRadius, h.startAngle).y
                                }
                                stroke={color}
                                strokeWidth="1"
                                opacity={0.2}
                            />
                        </G>
                    );
                })}

                {/* Core circle */}
                <Circle
                    cx={center}
                    cy={center}
                    r={coreRadius}
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    opacity={0.2}
                />

                {/* Ascendant / Descendant axis */}
                <Line
                    x1={polarToCartesian(center, center, outerRadius + 10, 270).x}
                    y1={polarToCartesian(center, center, outerRadius + 10, 270).y}
                    x2={polarToCartesian(center, center, outerRadius + 10, 90).x}
                    y2={polarToCartesian(center, center, outerRadius + 10, 90).y}
                    stroke={color}
                    strokeWidth="2"
                    opacity={0.5}
                />

                {/* MC / IC axis */}
                <Line
                    x1={polarToCartesian(center, center, outerRadius + 10, 0).x}
                    y1={polarToCartesian(center, center, outerRadius + 10, 0).y}
                    x2={polarToCartesian(center, center, outerRadius + 10, 180).x}
                    y2={polarToCartesian(center, center, outerRadius + 10, 180).y}
                    stroke={color}
                    strokeWidth="2"
                    opacity={0.5}
                />
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        aspectRatio: 1,
        maxWidth: 500,
        alignSelf: "center",
        backgroundColor: "rgba(26, 26, 26, 0.03)",
        borderRadius: 16,
        overflow: "hidden",
        padding: 8,
    },
});
