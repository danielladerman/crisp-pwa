import { type CategoryId } from "@/lib/drills";

const borderColorMap: Record<CategoryId, string> = {
  presence: "border-l-cat-presence",
  thinking: "border-l-cat-thinking",
  "pattern-breaking": "border-l-cat-pattern-breaking",
  "emotional-precision": "border-l-cat-emotional-precision",
  articulation: "border-l-cat-articulation",
  communication: "border-l-cat-communication",
  voice: "border-l-cat-voice",
};

export function CategoryCard({
  id,
  name,
  subtitle,
  drillCount,
  active,
  onClick,
}: {
  id: CategoryId;
  name: string;
  subtitle: string;
  drillCount: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border-l-4 bg-paper-dim p-4 text-left transition-all ${borderColorMap[id]} ${active ? "ring-1 ring-ink/10 shadow-sm" : ""}`}
    >
      <p className="text-sm font-semibold text-ink">{name}</p>
      <p className="mt-0.5 text-xs text-ink-muted leading-snug">{subtitle}</p>
      <p className="mt-2 text-xs text-ink-ghost">
        {drillCount} drill{drillCount !== 1 ? "s" : ""}
      </p>
    </button>
  );
}
