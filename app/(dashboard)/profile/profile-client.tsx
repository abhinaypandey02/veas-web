"use client";

import { useState } from "react";
import type { QueryResponseType } from "naystack/graphql";
import type getPlanets from "@/app/api/(graphql)/User/resolvers/get-planets";
import type getCurrentUser from "@/app/api/(graphql)/User/resolvers/get-current-user";
import ProfileInfo from "./profile-info";
import SettingsTab from "./settings-tab";

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

function getAscendant(planets: { name: string; sign: string; house: number }[]) {
  if (planets.length === 0) return null;
  const planet = planets[0];
  const signIndex = SIGNS.indexOf(planet.sign);
  if (signIndex === -1) return null;
  const ascendantIndex = ((signIndex - (planet.house - 1)) % 12 + 12) % 12;
  return SIGNS[ascendantIndex];
}

type Tab = "chart" | "settings";

export default function ProfileClient({
  data,
}: {
  data?: {
    planetsData: QueryResponseType<typeof getPlanets>;
    userData: QueryResponseType<typeof getCurrentUser>;
  };
}) {
  const [activeTab, setActiveTab] = useState<Tab>("chart");

  const planetsData = data?.planetsData;
  const userData = data?.userData;
  const planets = planetsData?.planets || [];
  const sunPlanet = planets.find((p) => p.name === "Sun");
  const moonPlanet = planets.find((p) => p.name === "Moon");
  const ascendant = getAscendant(planets);

  const tabs: { key: Tab; label: string }[] = [
    { key: "chart", label: "Chart" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <div className="grow min-h-0">
      {/* Header */}
      <div className="bg-primary px-4 pt-8 pb-0 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-editorial">{userData?.name || "You"}</h1>
          {userData?.email && (
            <p className="mt-0.5 text-sm text-white/50">@{userData.email.split("@")[0]}</p>
          )}
          {(sunPlanet || moonPlanet || ascendant) && (
            <p className="mt-2 text-sm text-white/70 flex items-center gap-3 flex-wrap">
              {sunPlanet && (
                <span>&#9737; {sunPlanet.sign}</span>
              )}
              {moonPlanet && (
                <span>&#9789; {moonPlanet.sign}</span>
              )}
              {ascendant && (
                <span>&uarr; {ascendant}</span>
              )}
            </p>
          )}

          {/* Tab bar */}
          <div className="mt-6 flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "text-white border-b-2 border-white"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="px-4 py-6">
        <div className="mx-auto max-w-7xl">
          {activeTab === "chart" && <ProfileInfo data={planetsData} />}
          {activeTab === "settings" && <SettingsTab user={userData} />}
        </div>
      </div>
    </div>
  );
}
