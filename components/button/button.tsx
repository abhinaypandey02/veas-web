import { CircleNotch } from "@phosphor-icons/react/dist/ssr";
import type { PropsWithChildren } from "react";
import React from "react";

import { Variants } from "@/components/constants";
import { cn } from "@/components/utils";

import type { ButtonProps } from "./types";

function Button({
  variant = Variants.PRIMARY,
  invert = false,
  borderless = false,
  square = false,
  children,
  className,
  type,
  loading,
  disabled,
  compact,
  ...rest
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn(
        "relative disabled:brightness-80 duration-200 flex justify-center items-center transition-all font-medium leading-6 focus-visible:outline-2 focus-visible:outline-offset-2",
        borderless && "border-none",
        square ? "p-2" : compact ? "px-4 py-1 " : "px-4 py-3 ",
        variant === Variants.PRIMARY && {
          "focus-visible:outline-primary bg-primary ": !invert,
          "text-primary border-primary hover:bg-primary/10": invert,
        },
        variant === Variants.DANGER && {
          "focus-visible:outline-danger bg-gradient-danger": !invert,
          "text-danger border-danger hover:bg-danger/10": invert,
        },
        !disabled && !loading && "active:brightness-95",
        !invert && "hover:brightness-90 transition-[filter] text-white",
        invert && !borderless && "shadow-light-button border",
        loading ? "cursor-progress" : "disabled:cursor-not-allowed",
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <>
          <span className="absolute left-1/2 -translate-x-1/2 ">
            <CircleNotch className=" animate-spin" size={24} weight="bold" />
          </span>
          <span className="opacity-0 flex">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
