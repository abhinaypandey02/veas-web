import type { ComponentProps } from "react";

import type { Variants } from "@/components/constants";

export type ButtonProps = {
  /** variant */
  variant?: Variants;
  invert?: boolean;
  borderless?: boolean;
  loading?: boolean;
  square?: boolean;
  compact?: boolean;
} & ComponentProps<"button">;
