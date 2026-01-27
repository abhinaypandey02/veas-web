import { cn } from "@/components/utils";
import Link from "next/link";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link className={cn("font-medium font-serif italic tracking-tight", className)} href="/">
      veas
    </Link>
  );
}
