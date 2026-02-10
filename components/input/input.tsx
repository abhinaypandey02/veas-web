import type { PropsWithChildren, ReactNode } from "react";
import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import { Select } from "@/components/ui/select";
import { cn } from "@/components/utils";

import { getBaseClassName, getInputErrorMessages } from "./constants";
import type { InputProps } from "./types";
import { Variants } from "../constants";
import { CircleNotch } from "@phosphor-icons/react";
function InputWrapper({
  label,
  error,
  children,
  suffix,
  prefix,
  required,
  onSuffix,
  loading = false,
}: PropsWithChildren<{
  label?: string;
  error?: string;
  suffix?: ReactNode;
  onSuffix?: () => void;
  prefix?: string;
  required?: boolean;
  loading?: boolean;
}>) {
  return (
    <div className="w-full">
      {label ? (
        <label className="mb-1.5 block pl-0.5 font-serif font-medium">
          {label}
          {required && <span className="text-red-600">{" *"}</span>}
        </label>
      ) : null}
      <div className="flex items-stretch relative">
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <CircleNotch className="animate-spin text-gray-500" size={20} />
          </div>
        )}
        {prefix ? (
          <div className="flex items-center rounded-l-xl bg-accent px-5 font-medium text-white">
            {prefix}
          </div>
        ) : null}
        {children}
        {suffix ? (
          <button
            onClick={onSuffix}
            className="flex items-center rounded-r-xl bg-primary px-5 font-medium text-white"
          >
            {suffix}
          </button>
        ) : null}
      </div>
      <small className="text-red-600">{error}</small>
    </div>
  );
}

function Input({
  loading = false,
  textarea = false,
  options,
  rules,
  label,
  error,
  suffix,
  prefix,
  multiple,
  onSuffix,
  ...rest
}: InputProps) {
  const formContext = useFormContext() as UseFormReturn | undefined;
  const formError = formContext?.formState.errors[rest.name || ""];
  const errorMessage =
    error ||
    formError?.message?.toString() ||
    getInputErrorMessages(formError?.type?.toString());
  const className = cn(
    getBaseClassName(
      rest.variant || Variants.PRIMARY,
      rest.type === "checkbox" || rest.type === "radio",
      !!rest.type?.startsWith("date"),
    ),
    rest.className,
  );
  if (options)
    return (
      <InputWrapper
        loading={loading}
        error={errorMessage}
        label={label}
        prefix={prefix}
        suffix={suffix}
        onSuffix={onSuffix}
        required={!!rules?.required}
      >
        <Select
          loading={loading}
          multiple={multiple}
          options={options}
          rules={rules}
          {...rest}
          className={className}
        />
      </InputWrapper>
    );
  if (textarea)
    return (
      <InputWrapper
        loading={loading}
        error={errorMessage}
        label={label}
        prefix={prefix}
        suffix={suffix}
        onSuffix={onSuffix}
        required={!!rules?.required}
      >
        <textarea
          {...(formContext?.register && rest.name
            ? formContext.register(rest.name, rules)
            : {})}
          {...rest}
          className={className}
        />
      </InputWrapper>
    );
  return (
    <InputWrapper
      loading={loading}
      error={errorMessage}
      label={label}
      prefix={prefix}
      suffix={suffix}
      onSuffix={onSuffix}
      required={!!rules?.required}
    >
      <input
        {...(formContext?.register && rest.name
          ? formContext.register(rest.name, rules)
          : {})}
        {...rest}
        className={className}
      />
    </InputWrapper>
  );
}

export default Input;
