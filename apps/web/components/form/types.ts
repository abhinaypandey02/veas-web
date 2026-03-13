import type { ComponentProps } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export type FormProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
} & ComponentProps<"form">;
