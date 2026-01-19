import { cn } from "@/components/utils";
import Link from "next/link";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link className={cn("font-bold font-serif italic", className)} href="/">
      veas
    </Link>
  );
}
