"use client";

import { QueryResponseType } from "naystack/graphql";
import type getPlanets from "@/app/api/(graphql)/User/resolvers/get-planets";
import WesternChart, { SIGNS } from "./western-chart";
import { ZodiacIcon } from "@/components/ui/zodiac-icons";

const DYNAMIC_SIGN_MEANINGS: Record<string, string> = {
  Aries:
    "Ignites your path with courage, bold initiative, and a pioneering spirit.",
  Taurus:
    "Provides you with grounded presence, steadfast trust, and an appreciation for lasting beauty.",
  Gemini:
    "Fills your approach with curiosity, quick-witted adaptability, and a desire for connection.",
  Cancer:
    "Centers you in deep nurturing, profound intuition, and receptive feminine energy.",
  Leo: "Inspires you toward joyful leadership, authentic self-expression, and a warm, magnetic presence.",
  Virgo:
    "Focuses your energy on practical healing, devoted service, and refined discernment.",
  Libra:
    "Draws you toward cultivating balance, relational harmony, and aesthetic perfection.",
  Scorpio:
    "Grants you the resilience for deep transformation and an unflinching emotional depth.",
  Sagittarius:
    "Expands your horizons through a quest for philosophical truth and optimistic exploration.",
  Capricorn:
    "Steadies you with disciplined ambition, structural mastery, and a respect for time.",
  Aquarius:
    "Awakens your visionary intellect, urging you toward progressive change and collective innovation.",
  Pisces:
    "Dissolves boundaries, blessing you with mystical insight, compassion, and spiritual depth.",
};

const DEFAULT_SIGN_MEANINGS = Object.entries(DYNAMIC_SIGN_MEANINGS).map(
  ([sign, meaning]) => ({
    sign,
    meaning,
  }),
);

function getAscendant(
  planets: { name: string; sign: string; house: number }[],
) {
  if (planets.length === 0) return null;
  const planet = planets[0];
  const signIndex = SIGNS.indexOf(planet.sign);
  if (signIndex === -1) return null;
  const ascendantIndex = (((signIndex - (planet.house - 1)) % 12) + 12) % 12;
  return SIGNS[ascendantIndex];
}

export default function ProfileInfo({
  data,
}: {
  data?: QueryResponseType<typeof getPlanets>;
}) {
  const planets = data?.planets || [];

  // Extract Big Three
  const sunSign = planets.find((p) => p.name === "Sun")?.sign;
  const moonSign = planets.find((p) => p.name === "Moon")?.sign;
  const risingSign = getAscendant(planets);

  const hasBigThree = sunSign || moonSign || risingSign;

  return (
    <div className="w-full flex flex-col items-center gap-4 pb-12">
      <WesternChart planets={planets} />

      {hasBigThree ? (
        <div className="max-w-3xl w-full bg-primary/5 p-6 rounded-2xl border border-primary/10">
          <h3 className="text-xl font-editorial mb-6 text-primary border-b border-primary/10 pb-4">
            Your Cosmic Blueprint
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sun Sign */}
            {sunSign && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-primary">
                  <span className="text-xl">☉</span>
                  <h4 className="font-editorial text-lg">Sun in {sunSign}</h4>
                </div>
                <div className="flex items-start gap-3">
                  <ZodiacIcon
                    sign={sunSign}
                    width={24}
                    height={24}
                    className="opacity-80 shrink-0 text-primary mt-1"
                  />
                  <p className="text-sm text-primary/70 font-light leading-relaxed">
                    <strong className="block font-medium text-primary mb-1">
                      Your Core Identity
                    </strong>
                    {DYNAMIC_SIGN_MEANINGS[sunSign]}
                  </p>
                </div>
              </div>
            )}

            {/* Moon Sign */}
            {moonSign && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-primary">
                  <span className="text-xl">☽</span>
                  <h4 className="font-editorial text-lg">Moon in {moonSign}</h4>
                </div>
                <div className="flex items-start gap-3">
                  <ZodiacIcon
                    sign={moonSign}
                    width={24}
                    height={24}
                    className="opacity-80 shrink-0 text-primary mt-1"
                  />
                  <p className="text-sm text-primary/70 font-light leading-relaxed">
                    <strong className="block font-medium text-primary mb-1">
                      Your Inner World
                    </strong>
                    {DYNAMIC_SIGN_MEANINGS[moonSign]}
                  </p>
                </div>
              </div>
            )}

            {/* Rising Sign */}
            {risingSign && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-primary">
                  <span className="text-xl">↑</span>
                  <h4 className="font-editorial text-lg">
                    {risingSign} Rising
                  </h4>
                </div>
                <div className="flex items-start gap-3">
                  <ZodiacIcon
                    sign={risingSign}
                    width={24}
                    height={24}
                    className="opacity-80 shrink-0 text-primary mt-1"
                  />
                  <p className="text-sm text-primary/70 font-light leading-relaxed">
                    <strong className="block font-medium text-primary mb-1">
                      Your Outward Approach
                    </strong>
                    {DYNAMIC_SIGN_MEANINGS[risingSign]}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {DEFAULT_SIGN_MEANINGS.map((item) => (
            <div
              key={item.sign}
              className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex flex-col gap-2 text-primary"
            >
              <div className="flex items-center gap-2">
                <ZodiacIcon
                  sign={item.sign}
                  width={18}
                  height={18}
                  className="opacity-80"
                />
                <span className="font-editorial text-lg">{item.sign}</span>
              </div>
              <p className="text-xs text-primary/70 font-light leading-relaxed">
                {item.meaning}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
