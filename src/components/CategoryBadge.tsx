import { type CategoryId, getCategoryById } from "@/lib/drills";

const colorMap: Record<CategoryId, string> = {
  presence: "bg-cat-presence/15 text-cat-presence",
  thinking: "bg-cat-thinking/15 text-cat-thinking",
  "pattern-breaking": "bg-cat-pattern-breaking/15 text-cat-pattern-breaking",
  "emotional-precision": "bg-cat-emotional-precision/15 text-cat-emotional-precision",
  articulation: "bg-cat-articulation/15 text-cat-articulation",
  communication: "bg-cat-communication/15 text-cat-communication",
  voice: "bg-cat-voice/15 text-cat-voice",
  writing: "bg-cat-writing/15 text-cat-writing",
};

export function CategoryBadge({ category }: { category: CategoryId }) {
  const cat = getCategoryById(category);
  if (!cat) return null;

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colorMap[category]}`}
    >
      {cat.name}
    </span>
  );
}
