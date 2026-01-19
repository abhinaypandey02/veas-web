"use client";

import React, { useEffect, useState } from "react";
import { useAuthMutation } from "naystack/graphql/client";
import { ONBOARD_USER } from "@/constants/graphql/mutations";
import { useRouter } from "next/navigation";
import { Input } from "@/components/input";
import { searchLocation, SearchPlaceResponse } from "@/utils/location";
import { useForm } from "react-hook-form";
import Form from "@/components/form";
import { Button } from "@/components/button";

interface FormType {
  name: string;
  dob: string;
  place: string;
}

export default function OnboardForm() {
  const router = useRouter();
  const [onboardUser, { loading }] = useAuthMutation(ONBOARD_USER);
  const [places, setPlaces] = useState<SearchPlaceResponse[]>([]);
  const form = useForm<FormType>();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const sub = form.watch(({ place }) => {
      if (timeout) clearTimeout(timeout);
      if (!place || place.length <= 3) return;
      if (places.some((p) => p.place_id === Number(place))) return;
      timeout = setTimeout(() => {
        searchLocation(place)
          .then((res) => res.filter((p) => p.type === "city"))
          .then(setPlaces);
      }, 500);
    });
    return () => {
      if (timeout) clearTimeout(timeout);
      sub.unsubscribe();
    };
  }, [form, places]);

  const handleSubmit = async (data: FormType) => {
    const selectedPlace = places.find((p) => p.place_id === Number(data.place));
    if (!selectedPlace) {
      form.setError("place", {
        message: "Please select a valid place",
      });
      return;
    }
    try {
      const result = await onboardUser({
        name: data.name,
        dateOfBirth: new Date(data.dob),
        placeOfBirthLat: parseFloat(selectedPlace.lat),
        placeOfBirthLong: parseFloat(selectedPlace.lon),
      });

      if (result.data) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      form.setError("place", {
        message:
          (error as Error).message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-semibold font-serif text-gray-900">
          About you
        </h1>
        <p className="mt-1 text-sm text-faded">
          Enter your basic details so we can know you better.
        </p>
      </div>

      <Form form={form} onSubmit={handleSubmit} className="space-y-4 px-4">
        <Input
          name="name"
          label="Full name"
          rules={{ required: true }}
          placeholder="John Doe"
        />
        <Input
          name="dob"
          label="Date of Birth"
          rules={{ required: true }}
          placeholder="2000-01-01"
          type="datetime-local"
        />
        <Input
          name="place"
          label="City of Birth"
          rules={{ required: true }}
          placeholder="New York"
          options={places.map((place) => ({
            label: place.name,
            value: place.place_id,
          }))}
        />

        <Button className="w-full" loading={loading}>
          Complete Onboarding
        </Button>
      </Form>
    </div>
  );
}
