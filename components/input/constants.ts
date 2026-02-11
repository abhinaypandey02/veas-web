import { Variants } from "@/components/constants";
import { cn } from "@/components/utils";

export const getBaseClassName = (
  variant: Variants | undefined,
  isCheckbox: boolean,
  isDate: boolean,
  loading: boolean,
) =>
  cn(
    `m-px disabled:text-gray-500 accent-primary block py-2.5 px-4 placeholder:text-sm shadow-xs placeholder:text-gray-400 outline-0 text-base sm:leading-6`,
    {
      "w-full ": !isCheckbox,
    },
    {
      "border-gray-300 border focus:border-2": isDate,
      "ring-gray-300 focus:ring-2 ring-1": !isCheckbox && !isDate,
    },
    {
      "focus:ring-primary focus:border-primary": variant === Variants.PRIMARY,
      "focus:ring-danger focus:border-danger": variant === Variants.DANGER,
    },
    loading && "pr-10",
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
