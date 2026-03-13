"use client";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import React from "react";

export default function LinkWrapper({
  href,
  external,
  className,
  children,
  prefetch,
}: PropsWithChildren<{
  href?: string | null;
  external?: boolean;
  className?: string;
  prefetch?: boolean;
}>) {
  if (!href) return <span className={className}>{children}</span>;
  if (
    (external ||
      (!href.startsWith(process.env.NEXT_PUBLIC_BASE_URL || "/") &&
        !href.startsWith("/"))) &&
    external !== false
  )
    return (
      <a className={className} href={href} rel="noopener" target="_blank">
        {children}
      </a>
    );
  return (
    <Link prefetch={prefetch} className={className} href={href}>
      {children}
    </Link>
  );
}
