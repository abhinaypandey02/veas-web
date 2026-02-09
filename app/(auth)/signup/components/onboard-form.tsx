import React, { useEffect, useState } from "react";
import { useAuthMutation } from "naystack/graphql/client";
import { ONBOARD_USER } from "@/constants/graphql/mutations";
import { useRouter } from "next/navigation";
import { Input } from "@/components/input";
import {
  searchLocation,
  SearchPlaceResponse,
  searchTimezone,
  getUTCDate,
} from "@/utils/location";
import { useForm } from "react-hook-form";
import Form from "@/components/form";
import { Button } from "@/components/button";
import { OnboardData } from "./form";
import { ArrowRight } from "@phosphor-icons/react";

interface FormType {
  dob: string;
  place: string;
}

export default function OnboardForm({
  onSuccess,
}: {
  onSuccess?: (data: OnboardData) => void;
}) {
  const router = useRouter();
  const [onboardUser, { loading }] = useAuthMutation(ONBOARD_USER);
  const [places, setPlaces] = useState<SearchPlaceResponse[]>([]);
  const [loadingTimezone, setLoadingTimezone] = useState(false);
  const [timezone, setTimezone] = useState<number>();
  const form = useForm<FormType>();

  const place = form.watch("place");

  useEffect(() => {
    const selectedPlace = places.find((p) => p.place_id === Number(place));
    if (selectedPlace) {
      setLoadingTimezone(true);
      searchTimezone(
        parseFloat(selectedPlace.lat),
        parseFloat(selectedPlace.lon),
      ).then((timezone) => {
        setTimezone(timezone);
        setLoadingTimezone(false);
      });
    }
  }, [place, places]);

  useEffect(() => {
    if (!place || place.length <= 3) return;
    if (!isNaN(Number(place))) return;

    const timeout = setTimeout(() => {
      searchLocation(place).then((places) => {
        setPlaces(places);
        setTimezone(undefined);
      });
    }, 500);
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [place]);

  const handleSubmit = async (data: FormType) => {
    const selectedPlace = places.find((p) => p.place_id === Number(data.place));
    if (!selectedPlace || !timezone) {
      form.setError("place", {
        message: "Please select a valid place",
      });
      return;
    }
    try {
      const result = await onboardUser({
        dateOfBirth: getUTCDate(new Date(data.dob), timezone),
        placeOfBirthLat: parseFloat(selectedPlace.lat),
        placeOfBirthLong: parseFloat(selectedPlace.lon),
        timezone,
      });

      if (result.data?.onboardUser) {
        if (onSuccess) {
          onSuccess({
            chartId: result.data.onboardUser,
            placeOfBirth: selectedPlace.display_name,
            timezoneOffset: timezone,
          });
          return;
        }
        router.replace("/dashboard");
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
      <Form form={form} onSubmit={handleSubmit} className="space-y-4 px-4">
        <Input
          name="place"
          label="City of Birth"
          rules={{ required: true }}
          placeholder="Where were you born?"
          options={places.map((place) => ({
            label: place.display_name,
            value: place.place_id,
          }))}
        />

        <Input
          name="dob"
          label="Date of Birth"
          rules={{ required: true }}
          placeholder="2000-01-01"
          type="datetime-local"
        />
        <Button className="w-full" loading={loading || loadingTimezone}>
          Next <ArrowRight className="ml-2" />
        </Button>
      </Form>
    </div>
  );
}
