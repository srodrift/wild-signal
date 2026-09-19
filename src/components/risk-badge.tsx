import { riskLabel } from "@/lib/guidance";
import type { RiskLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const tone: Record<RiskLevel, string> = {
  green: "bg-emerald-800/10 text-emerald-900 ring-emerald-800/20",
  yellow: "bg-amber-800/10 text-amber-950 ring-amber-800/20",
  orange: "bg-orange-800/10 text-orange-950 ring-orange-800/25",
  red: "bg-red-800/10 text-red-900 ring-red-800/25",
};

export function RiskBadge({
  level,
  className,
}: {
  level: RiskLevel;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        tone[level],
        className,
      )}
    >
      {riskLabel(level)}
    </span>
  );
}
