"use client";

import React, { useState } from "react";
import { useAuthMutation } from "naystack/graphql/client";
import { ONBOARD_USER } from "@/constants/graphql/mutations";
import { useRouter } from "next/navigation";

export default function OnboardForm() {
  const router = useRouter();
  const [onboardUser, { loading }] = useAuthMutation(ONBOARD_USER);
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [placeOfBirthLat, setPlaceOfBirthLat] = useState("");
  const [placeOfBirthLong, setPlaceOfBirthLong] = useState("");
  const [timezone, setTimezone] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const result = await onboardUser({
        input: {
          name,
          dateOfBirth: new Date(dateOfBirth),
          placeOfBirthLat: parseFloat(placeOfBirthLat),
          placeOfBirthLong: parseFloat(placeOfBirthLong),
          timezone: parseFloat(timezone),
        },
      });

      if (result.data) {
        setMessage("Onboarding completed successfully!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Complete Your Profile
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Please provide your birth details for accurate astrological charts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-gray-700"
          >
            Date & Time of Birth
          </label>
          <input
            id="dateOfBirth"
            type="datetime-local"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label
              htmlFor="placeOfBirthLat"
              className="block text-sm font-medium text-gray-700"
            >
              Latitude
            </label>
            <input
              id="placeOfBirthLat"
              type="number"
              step="any"
              value={placeOfBirthLat}
              onChange={(e) => setPlaceOfBirthLat(e.target.value)}
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="28.4070"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="placeOfBirthLong"
              className="block text-sm font-medium text-gray-700"
            >
              Longitude
            </label>
            <input
              id="placeOfBirthLong"
              type="number"
              step="any"
              value={placeOfBirthLong}
              onChange={(e) => setPlaceOfBirthLong(e.target.value)}
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="77.8498"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="timezone"
            className="block text-sm font-medium text-gray-700"
          >
            Timezone Offset (hours)
          </label>
          <input
            id="timezone"
            type="number"
            step="0.5"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            required
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="5.5 (e.g., IST)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter timezone offset from UTC (e.g., 5.5 for IST, -5 for EST)
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading ? "Submitting..." : "Complete Onboarding"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-xs text-gray-600">{message}</p>
      )}
    </div>
  );
}
