import { CircleNotch } from "@phosphor-icons/react";
import React from "react";
import { cn } from "./utils";

export default function Loader({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return <CircleNotch className={cn("animate-spin", className)} size={size} />;
}
