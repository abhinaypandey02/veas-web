"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp, useToken } from "naystack/auth/email/client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import Form from "@/components/form";
import Logo from "@/app/_components/logo";
import Link from "next/link";

interface FormType {
  email: string;
  password: string;
}

export default function SignUpForm({ data }: { data?: true }) {
  const signUp = useSignUp();
  const router = useRouter();

  const form = useForm<FormType>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (data: FormType) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      await signUp(data);
      // Redirect to onboard page after successful signup
      router.replace("/onboard");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" ">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-semibold font-serif text-gray-900">
          Join <Logo />
        </h1>
        <p className="mt-1 text-sm text-faded">
          Sign up for free with your email.
        </p>
      </div>

      <Form form={form} onSubmit={handleSubmit} className="space-y-4 px-4">
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
        <Button loading={isSubmitting || !data} className="w-full mt-6">
          {isSubmitting ? "Signing up..." : "Sign up"}
        </Button>
        <div className="text-faded text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link replace href="/login" className="underline">
            Login
          </Link>
        </div>
      </Form>

      {message && (
        <p className="mt-4 text-center text-xs text-gray-600">{message}</p>
      )}
    </div>
  );
}
