import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  size = 36,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.1)}
      viewBox="0 0 80 88"
      aria-hidden
      className={cn("shrink-0 text-[color:var(--amber)]", className)}
    >
      <path
        fill="currentColor"
        d="M36.2 4.4c2.4-1.2 5.8-.6 7.4 1.8 1.8-1.4 4.6-1.2 6.4.6 3.6 1.2 7.4 3.4 9.6 6.8 3.2 4.8 4.4 10.6 4.2 16.2.2 4.6 2.2 8.8 1.4 13.4-.8 5.2-2.6 10-6.2 13.8-3.2 3.4-7.2 6.2-11.8 7.6-4.6 1.4-9.6 1.8-14.2.6-5-1.4-9.2-4.8-11.8-9.4-2.8-5-3.8-10.8-4.2-16.4-.4-6 .2-12.2 2.4-17.8 1.6-4 4.6-7.4 8.4-9.4 2.8-1.4 5.8-2.8 8.4-4.2z"
      />
      <ellipse cx="68.5" cy="16.5" rx="3.2" ry="2.4" fill="currentColor" />
      <circle cx="73.8" cy="11.2" r="1.15" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex flex-col leading-none text-[color:var(--fog)]",
        className,
      )}
    >
      <span className="text-[13px] font-light lowercase tracking-[0.22em]">
        wild
      </span>
      <span className="my-[3px] h-px w-full bg-current/70" />
      <span className="text-[13px] font-light lowercase tracking-[0.14em]">
        signal
      </span>
    </span>
  );
}

export function LogoLockup({
  className,
  markSize = 34,
}: {
  className?: string;
  markSize?: number;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <BrandMark size={markSize} />
      <Wordmark />
    </span>
  );
}

export function LogoPlate({
  className,
  size = 280,
  alt = "wild signal — san francisco",
}: {
  className?: string;
  size?: number;
  alt?: string;
}) {
  return (
    <Image
      src="/brand/logo.png"
      alt={alt}
      width={size}
      height={size}
      className={cn("mix-blend-multiply", className)}
      priority
    />
  );
}
