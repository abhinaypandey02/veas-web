import type { ComponentProps, ReactNode } from "react";
import type { RegisterOptions } from "react-hook-form";

import { Variants } from "@/components/constants";

export interface SelectOption {
  label: string;
  value: string | number;
}

export type InputProps = {
  textarea?: boolean;
  options?: SelectOption[];
  variant?: Variants;
  name?: string;
  rules?: RegisterOptions;
  label?: string;
  error?: string;
  suffix?: ReactNode;
  onSuffix?: () => void;
  multiple?: boolean;
} & ComponentProps<"textarea"> &
  ComponentProps<"input">;

export type SelectProps = {
  options: SelectOption[];
  name?: string;
  rules?: RegisterOptions;
  multiple?: boolean;
} & ComponentProps<"input">;
