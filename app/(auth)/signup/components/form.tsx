"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp, useToken } from "naystack/auth/email/client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import Form from "@/components/form";
import Logo from "@/app/_components/logo";
import OnboardForm from "./onboard-form";
import Link from "next/link";

interface FormType {
  email: string;
  password: string;
  name: string;
}

export interface OnboardData {
  chartId: number;
  timezoneOffset: number;
  placeOfBirth: string;
  gender: string;
}

function SignUpDetailsForm({
  onboardingData,
}: {
  onboardingData: OnboardData;
}) {
  const signUp = useSignUp();
  const router = useRouter();

  const form = useForm<FormType>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (data: FormType) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      await signUp({
        name: data.name,
        email: data.email,
        password: data.password,
        ...onboardingData,
      });
      router.replace("/dashboard");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" ">
      <Form form={form} onSubmit={handleSubmit} className="space-y-4 px-4">
        <Input
          name="name"
          label="Full name"
          rules={{ required: true }}
          placeholder="What should we call you?"
        />
        <Input
          name="email"
          label="Email"
          rules={{ required: true }}
          type="email"
          placeholder="Enter your email address"
        />
        <Input
          name="password"
          label="Password"
          rules={{ required: true }}
          type="password"
          placeholder="Enter your password"
        />
        <Input
          name="c_password"
          label="Confirm Password"
          rules={{
            required: true,
            validate: (value, values) => {
              console.log(values);
              return value === values.password;
            },
          }}
          type="password"
          placeholder="Confirm your password"
        />
        <Button loading={isSubmitting} className="w-full mt-6">
          Complete Onboarding
        </Button>
      </Form>

      {message && (
        <p className="mt-4 text-center text-xs text-gray-600">{message}</p>
      )}
    </div>
  );
}

export default function SignUpForm() {
  const token = useToken();
  const [onboardingData, setOnboardingData] = useState<OnboardData | null>(
    null,
  );
  const router = useRouter();
  useEffect(() => {
    if (token) {
      router.replace("/dashboard");
    }
  }, [token, router]);

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-semibold font-serif text-gray-900">
          Join <Logo />
        </h1>
        <p className="mt-1 text-sm text-faded">
          {onboardingData === null
            ? "Enter your basic details so we can know you better."
            : "Sign up for free with your email."}
        </p>
      </div>
      {onboardingData === null ? (
        <OnboardForm onSuccess={setOnboardingData} />
      ) : (
        <SignUpDetailsForm onboardingData={onboardingData} />
      )}

      <div className="text-faded text-sm mt-4 text-center">
        Already have an account?{" "}
        <Link replace href="/login" className="underline">
          Login
        </Link>
      </div>
    </div>
  );
}
