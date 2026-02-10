"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthMutation } from "naystack/graphql/client";
import { useLogout } from "naystack/auth/email/client";
import Link from "next/link";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import Form from "@/components/form";
import { UPDATE_USER, UPDATE_USER_CHART } from "@/constants/graphql/mutations";
import {
  searchLocation,
  SearchPlaceResponse,
  searchTimezone,
  getUTCDate,
  getLocalTime,
} from "@/utils/location";
import type { QueryResponseType } from "naystack/graphql";
import type getCurrentUser from "@/app/api/(graphql)/User/resolvers/get-current-user";

interface UserInfoForm {
  name: string;
  email: string;
  placeOfBirth: string;
}

interface ChartInfoForm {
  dob: string;
  place: string;
}

function toDatetimeLocal(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}`;
}

function UserInfoSection({
  user,
}: {
  user?: QueryResponseType<typeof getCurrentUser>;
}) {
  const [updateUser, { loading }] = useAuthMutation(UPDATE_USER);
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<UserInfoForm>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      placeOfBirth: user?.placeOfBirth || "",
    },
  });

  const handleSubmit = async (data: UserInfoForm) => {
    setMessage(null);
    try {
      await updateUser({
        name: data.name,
        email: data.email,
        placeOfBirth: data.placeOfBirth,
      });
      setMessage("Saved!");
    } catch (error) {
      setMessage((error as Error).message || "Something went wrong.");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-editorial mb-4">Your Info</h2>
      <Form form={form} onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          label="Name"
          rules={{ required: true }}
          placeholder="Your name"
        />
        <Input
          name="email"
          label="Email"
          rules={{ required: true }}
          type="email"
          placeholder="Your email"
        />
        <Input
          name="placeOfBirth"
          label="Place of Birth"
          placeholder="City, Country"
        />
        <div className="flex items-center gap-3">
          <Button loading={loading} compact>
            Save
          </Button>
          {message && (
            <span className="text-sm text-faded">{message}</span>
          )}
        </div>
      </Form>
    </div>
  );
}

function ChartInfoSection({
  user,
}: {
  user?: QueryResponseType<typeof getCurrentUser>;
}) {
  const [updateUserChart, { loading: chartLoading }] =
    useAuthMutation(UPDATE_USER_CHART);
  const [updateUser] = useAuthMutation(UPDATE_USER);
  const [places, setPlaces] = useState<SearchPlaceResponse[]>([]);
  const [loadingTimezone, setLoadingTimezone] = useState(false);
  const [timezone, setTimezone] = useState<number | undefined>(
    user?.timezoneOffset ?? undefined,
  );
  const [selectedPlace, setSelectedPlace] = useState<SearchPlaceResponse>();
  const [message, setMessage] = useState<string | null>(null);

  const defaultDob =
    user?.dateOfBirth && user?.timezoneOffset != null
      ? toDatetimeLocal(getLocalTime(new Date(user.dateOfBirth), user.timezoneOffset))
      : "";

  const form = useForm<ChartInfoForm>({
    defaultValues: {
      dob: defaultDob,
      place: "",
    },
  });

  const place = form.watch("place");

  useEffect(() => {
    const found = places.find((p) => p.place_id === Number(place));
    if (found) {
      setSelectedPlace(found);
      setLoadingTimezone(true);
      searchTimezone(parseFloat(found.lat), parseFloat(found.lon)).then(
        (tz) => {
          setTimezone(tz);
          setLoadingTimezone(false);
        },
      );
    }
  }, [place, places]);

  useEffect(() => {
    if (!place || place.length <= 3) return;
    if (!isNaN(Number(place))) return;

    const timeout = setTimeout(() => {
      searchLocation(place).then((results) => {
        setPlaces(results);
        setTimezone(undefined);
        setSelectedPlace(undefined);
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [place]);

  const handleSubmit = async (data: ChartInfoForm) => {
    setMessage(null);

    const lat = selectedPlace
      ? parseFloat(selectedPlace.lat)
      : user?.placeOfBirthLat;
    const long = selectedPlace
      ? parseFloat(selectedPlace.lon)
      : user?.placeOfBirthLong;

    if (!lat || !long || timezone == null) {
      form.setError("place", {
        message: "Please select a valid place",
      });
      return;
    }

    try {
      if (selectedPlace) {
        await updateUser({
          placeOfBirth: selectedPlace.display_name,
          timezoneOffset: timezone,
        });
      }

      await updateUserChart({
        dateOfBirth: getUTCDate(new Date(data.dob), timezone),
        lat,
        long,
      });

      setMessage("Chart updated!");
    } catch (error) {
      setMessage((error as Error).message || "Something went wrong.");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-editorial mb-4">Chart Info</h2>
      <Form form={form} onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="place"
          label="City of Birth"
          placeholder={user?.placeOfBirth || "Where were you born?"}
          options={places.map((p) => ({
            label: p.display_name,
            value: p.place_id,
          }))}
        />
        <Input
          name="dob"
          label="Date of Birth"
          rules={{ required: true }}
          type="datetime-local"
        />
        <div className="flex items-center gap-3">
          <Button loading={chartLoading || loadingTimezone} compact>
            Update Chart
          </Button>
          {message && (
            <span className="text-sm text-faded">{message}</span>
          )}
        </div>
      </Form>
    </div>
  );
}

export default function SettingsTab({
  user,
}: {
  user?: QueryResponseType<typeof getCurrentUser>;
}) {
  const logout = useLogout();

  return (
    <div className="space-y-10">
      <UserInfoSection user={user} />

      <hr className="border-border" />

      <ChartInfoSection user={user} />

      <hr className="border-border" />

      <div>
        <Link
          onClick={() => logout()}
          replace
          href="/login"
          className="inline-block rounded-md border border-danger/30 bg-danger/5 px-6 py-2.5 text-sm font-medium text-danger transition hover:bg-danger/10"
        >
          Log out
        </Link>
      </div>
    </div>
  );
}
