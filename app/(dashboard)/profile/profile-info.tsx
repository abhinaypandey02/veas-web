"use client";

import { QueryResponseType } from "naystack/graphql";
import type getPlanets from "@/app/api/(graphql)/User/resolvers/get-planets";

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

interface HouseGroup {
  house: number;
  planets: { name: string; sign: string }[];
}

function groupByHouse(
  planets: { name: string; sign: string; house: number }[],
): HouseGroup[] {
  const map = new Map<number, { name: string; sign: string }[]>();
  for (const p of planets) {
    if (!map.has(p.house)) map.set(p.house, []);
    map.get(p.house)!.push({ name: p.name, sign: p.sign });
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([house, planets]) => ({ house, planets }));
}

export default function ProfileInfo({
  data,
}: {
  data?: QueryResponseType<typeof getPlanets>;
}) {
  const planets = data?.planets || [];
  const houses = groupByHouse(planets);

  if (houses.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl bg-primary text-white">
      <div className="flex">
        {/* SIGNS vertical label */}
        <div className="flex w-8 shrink-0 items-center justify-center border-r border-white/10">
          <span className="text-xs font-medium tracking-[0.3em] [writing-mode:vertical-lr]">
            SIGNS
          </span>
        </div>

        {/* Main table area */}
        <div className="grow">
          {houses.map((group, gi) => (
            <div
              key={group.house}
              className={gi > 0 ? "border-t border-white/10" : ""}
            >
              {group.planets.map((planet, pi) => (
                <div
                  key={planet.name}
                  className={`flex items-center ${pi > 0 ? "border-t border-white/5" : ""}`}
                >
                  {/* Sign column */}
                  <div className="w-40 shrink-0 border-r border-white/10 px-4 py-3">
                    {pi === 0 && (
                      <span className="text-base font-light">
                        {planet.sign}
                      </span>
                    )}
                  </div>

                  {/* Planet column */}
                  <div className="grow border-r border-white/10 px-4 py-3">
                    <span className="text-base font-light">
                      {PLANET_SYMBOLS[planet.name] || ""}{" "}
                      {planet.name.toUpperCase()}
                    </span>
                  </div>

                  {/* House number column */}
                  <div className="w-16 shrink-0 px-4 py-3 text-center">
                    {pi === group.planets.length - 1 && (
                      <span className="text-2xl font-light">{group.house}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* HOUSES vertical label */}
        <div className="flex w-8 shrink-0 items-center justify-center border-l border-white/10">
          <span className="text-xs font-medium tracking-[0.3em] [writing-mode:vertical-lr]">
            HOUSES
          </span>
        </div>
      </div>
    </div>
  );
}
