import React, { PropsWithChildren } from "react";

import { cn } from "@/components/utils";

export default function SelectorButton({
  selected,
  onSelect,
  children,
  onDeselect,
  className,
}: PropsWithChildren<{
  selected: boolean;
  onSelect: () => void;
  onDeselect?: () => void;
  className?: string;
}>) {
  return (
    <button
      type="button"
      className={cn(
        `flex flex-col rounded-lg border-2 p-4 text-left transition-all`,
        selected ? "border-accent" : "border-gray-200 hover:border-accent/50",
        className,
      )}
      onClick={selected ? onDeselect : onSelect}
    >
      {children}
    </button>
  );
}
