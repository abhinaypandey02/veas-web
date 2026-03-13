"use client";

import { Check, LinkSimple } from "@phosphor-icons/react";
import { ReactNode, useState } from "react";
import toast from "react-hot-toast";

import { cn } from "@/components/utils";

export default function CopyText({
  text,
  toastMessage,
  className,
  children,
}: {
  text: string;
  toastMessage?: string;
  className?: string;
  children?: ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div
      onClick={() => {
        navigator.clipboard.writeText(text);
        if (toastMessage) toast.success(toastMessage);
        setCopied(true);
        setTimeout(() => setCopied(false), 4000);
      }}
      className={cn("cursor-pointer", className)}
    >
      {children}
      {copied ? <Check size={18} /> : <LinkSimple size={18} weight="light" />}
    </div>
  );
}
