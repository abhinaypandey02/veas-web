import { Variants } from "@/components/constants";
import { cn } from "@/components/utils";

export const getBaseClassName = (
  variant: Variants | undefined,
  isSuffixed: boolean,
  isPrefixed: boolean,
  isCheckbox: boolean,
) =>
  cn(
    `focus:ring-primary m-px accent-primary block py-2.5 px-4  shadow-xs ring-gray-300 placeholder:text-gray-400 outline-0 text-base sm:leading-6`,
    {
      "w-full focus:ring-2 ring-1": !isCheckbox,
    },
    {
      "focus:ring-primary": variant === Variants.PRIMARY,
      "focus:ring-danger": variant === Variants.DANGER,
    },
  );

export const getInputErrorMessages = (type?: string) => {
  if (!type) return undefined;
  switch (type) {
    case "required":
      return "This field is required";
    case "passwordMatch":
      return "Password don't match";
    default:
      return "Invalid field";
  }
};
