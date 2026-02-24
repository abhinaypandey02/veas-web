"use client";

import { getPlanetDisplayName, PLANET_SYMBOLS } from "@/utils/planet-display";
import { ZodiacIcon } from "@/components/ui/zodiac-icons";

export const ZODIAC_SYMBOLS: Record<string, string> = {
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

interface WesternChartProps {
  planets: { name: string; sign: string; house: number }[];
}

export default function WesternChart({ planets }: WesternChartProps) {
  // SVG dimensions and center
  const size = 600;
  const center = size / 2;
  const outerRadius = 240;
  const midRadius = 190;
  const innerRadius = 140;
  const coreRadius = 90;

  const startHouse = 1;
  // House 1 starts at "9 o'clock" which is 270 degrees in SVG coordinates (where 0 is top)
  // But wait, standard math where 0 is east/right, 90 is south/bottom, 180 is west/left, 270 is north/top
  // If 0 is top (12 o'clock), 90 is right (3 o'clock).
  // "9 o'clock" in our polar function (where -90 is applied) means 0 deg is 'top'.
  // We want house 1 to start at 9 o'clock and go counter-clockwise to 8 o'clock.
  // In a clock, 9 is 270 deg. 8 is 240 deg.
  // Let's standardise on: Ascendant (House 1) is at the left.

  // Calculate ascendant
  let ascendantSign = "Aries"; // fallback
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
    // Standard western houses: H1 = 180 to 210 in standard math angle (counter clockwise)
    // In our SVG, `angleInDegrees` 0 is Top, 90 is Right, 180 is Bottom, 270 is Left.
    // If we want H1 to span from Left (270) to Bottom-Left (240), wait, counter-clockwise means angles DECREASE if 90 is right, 180 is bottom?
    // Let's just create 12 slices, starting from left.
    // Left in our polar coords is -90 from polarToCartesian which subtracts 90. So if angle=270, (270-90)=180 deg in Math.sin/cos which is Left.
    // House 1: startAngle = 240, endAngle = 270
    // Wait, let's reverse direction so houses go counterclockwise.
    // H1: 240 to 270. H2: 210 to 240. H3: 180 to 210.
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

  return (
    <div className="flex justify-center w-full max-w-[500px] mx-auto items-center p-4 md:p-8 bg-primary/5 rounded-2xl">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
        className="text-primary font-light"
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

          return (
            <g key={`sign-${h.houseNum}`}>
              {/* Sector background */}
              <path
                d={describeArc(
                  center,
                  center,
                  midRadius,
                  outerRadius,
                  h.startAngle,
                  h.endAngle,
                )}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="opacity-20"
              />
              {/* Sign Symbol and Text */}
              <g
                transform={`translate(${textPos.x}, ${textPos.y}) rotate(${midAngle + 90})`}
                className="opacity-80 flex flex-col items-center"
              >
                <g transform="translate(-12, -20)">
                  <ZodiacIcon sign={h.signName} width={24} height={24} />
                </g>
                <text
                  x={0}
                  y={12}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[10px] fill-current opacity-80 uppercase tracking-widest font-medium"
                >
                  {h.signName}
                </text>
              </g>
            </g>
          );
        })}

        {/* Inner Ring (Houses & Planets) */}
        {houses.map((h) => {
          const midAngle = (h.startAngle + h.endAngle) / 2;
          const textPos = polarToCartesian(
            center,
            center,
            (midRadius + innerRadius) / 2,
            midAngle,
          );
          const houseTextPos = polarToCartesian(
            center,
            center,
            (innerRadius + coreRadius) / 2,
            midAngle,
          );

          return (
            <g key={`house-${h.houseNum}`}>
              {/* Sector background inner */}
              <path
                d={describeArc(
                  center,
                  center,
                  coreRadius,
                  midRadius,
                  h.startAngle,
                  h.endAngle,
                )}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="opacity-20"
              />

              {/* Planets */}
              {h.planets.map((p, pIdx) => {
                // Stack planets slightly if multiple
                const pRadius =
                  (midRadius + innerRadius) / 2 +
                  (pIdx - (h.planets.length - 1) / 2) * 20;
                const pPos = polarToCartesian(
                  center,
                  center,
                  pRadius,
                  midAngle,
                );
                return (
                  <g
                    key={p.name}
                    transform={`translate(${pPos.x}, ${pPos.y})`}
                    className="opacity-90"
                  >
                    <text
                      x={-12}
                      y={0}
                      textAnchor="end"
                      dominantBaseline="middle"
                      className="text-[10px] fill-current uppercase tracking-wider font-medium"
                    >
                      {getPlanetDisplayName(p.name)}
                    </text>
                    <text
                      x={4}
                      y={0}
                      textAnchor="start"
                      dominantBaseline="middle"
                      className="text-lg fill-current"
                    >
                      {PLANET_SYMBOLS[p.name] || p.name.substring(0, 2)}
                    </text>
                  </g>
                );
              })}

              {/* House Number */}
              <text
                x={houseTextPos.x}
                y={houseTextPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm fill-current opacity-50"
              >
                {h.houseNum}
              </text>

              {/* Line separating houses extending to center */}
              <line
                x1={
                  polarToCartesian(center, center, coreRadius, h.startAngle).x
                }
                y1={
                  polarToCartesian(center, center, coreRadius, h.startAngle).y
                }
                x2={
                  polarToCartesian(center, center, outerRadius, h.startAngle).x
                }
                y2={
                  polarToCartesian(center, center, outerRadius, h.startAngle).y
                }
                stroke="currentColor"
                strokeWidth="1"
                className="opacity-20"
              />
            </g>
          );
        })}

        {/* Core empty circle */}
        <circle
          cx={center}
          cy={center}
          r={coreRadius}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-20"
        />

        {/* Ascendant / Descendant Line */}
        <line
          x1={polarToCartesian(center, center, outerRadius + 10, 270).x}
          y1={polarToCartesian(center, center, outerRadius + 10, 270).y}
          x2={polarToCartesian(center, center, outerRadius + 10, 90).x}
          y2={polarToCartesian(center, center, outerRadius + 10, 90).y}
          stroke="currentColor"
          strokeWidth="2"
          className="opacity-50"
        />
        {/* MC / IC Line */}
        <line
          x1={polarToCartesian(center, center, outerRadius + 10, 0).x}
          y1={polarToCartesian(center, center, outerRadius + 10, 0).y}
          x2={polarToCartesian(center, center, outerRadius + 10, 180).x}
          y2={polarToCartesian(center, center, outerRadius + 10, 180).y}
          stroke="currentColor"
          strokeWidth="2"
          className="opacity-50"
        />
      </svg>
    </div>
  );
}
