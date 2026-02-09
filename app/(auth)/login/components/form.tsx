"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin, useToken } from "naystack/auth/email/client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import Form from "@/components/form";
import Link from "next/link";

interface FormType {
  email: string;
  password: string;
}

export default function LoginForm() {
  const login = useLogin();
  const router = useRouter();
  const form = useForm<FormType>();
  const token = useToken();
  useEffect(() => {
    if (token) {
      router.replace("/dashboard");
    }
  }, [token, router]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: FormType) => {
    setIsSubmitting(true);

    try {
      const message = await login(data);
      if (!message) {
        router.replace("/dashboard");
      } else {
        setIsSubmitting(false);
        form.setError("password", { message });
      }
    } catch (error) {
      form.setError("password", { message: "Invalid email or password" });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-semibold font-serif text-gray-900">
          Get back in
        </h1>
        <p className="mt-1 text-sm text-faded">Sign in to your account.</p>
      </div>

      <Form form={form} onSubmit={handleSubmit} className="space-y-4 px-4 ">
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
        <Button loading={isSubmitting} className="w-full mt-6">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
        <div className="text-faded text-sm mt-4 text-center">
          Don{"'"}t have an account?{" "}
          <Link replace href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </Form>
    </div>
  );
}
