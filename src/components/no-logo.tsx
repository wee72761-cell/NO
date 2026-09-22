import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

/**
 * The official NO brand mark:
 * An ultra-clean, architectural geometric emblem combining the "N" and "O"
 * in a precision technical layout. Rendered in monochromatic slate, titanium grey,
 * and high-contrast precision lines with calibration micro-ticks.
 */
export function NoMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("h-6 w-6 text-foreground", className)}
      {...props}
    >
      {/* Outer subtle calibration frame */}
      <rect
        x="6"
        y="6"
        width="52"
        height="52"
        rx="10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.2"
      />

      {/* Structural N glyph (Left pillar, diagonal bridge, right pillar) */}
      <path
        d="M17 44V20H23.5L34 37V20H40V44H33.5L23 27V44H17Z"
        fill="currentColor"
        className="text-zinc-900 dark:text-zinc-100"
      />

      {/* Precision Circular Orbital 'O' in center-right */}
      <circle
        cx="46"
        cy="40"
        r="8"
        stroke="currentColor"
        strokeWidth="2.5"
        className="text-zinc-600 dark:text-zinc-400"
      />
      <circle
        cx="46"
        cy="40"
        r="3"
        fill="currentColor"
        className="text-zinc-400 dark:text-zinc-300"
      />

      {/* Technical corner alignment marks */}
      <path d="M10 14H14M10 14V10" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
      <path d="M54 14H50M54 14V10" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
      <path d="M10 50H14M10 50V54" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
      <path d="M54 50H50M54 50V54" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
    </svg>
  );
}

export function NoLogoText({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-display text-lg font-bold tracking-tight", className)}>
      <NoMark className="h-7 w-7" />
      <span className="text-zinc-900 dark:text-white font-mono tracking-tighter text-xl">no</span>
    </div>
  );
}
