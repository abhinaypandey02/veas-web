import type { ComponentProps, PropsWithChildren } from "react";
import React from "react";

import { cn } from "@/components/utils";

/**
 * Represents a navbar.
 */
function IconButton(props: PropsWithChildren<ComponentProps<"button">>) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "aspect-square p-2.5 sm:p-2 rounded-full transition-colors hover:bg-gray-100",
        props.className,
      )}
    >
      {props.children}
    </button>
  );
}

export default IconButton;
