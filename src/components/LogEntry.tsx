import { CategoryBadge } from "./CategoryBadge";
import { type CategoryId } from "@/lib/drills";

export interface PracticeLog {
  id: string;
  drill_id: string;
  drill_name: string;
  category: string;
  noticed: string | null;
  completed_at: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const logDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffDays = Math.floor((today.getTime() - logDate.getTime()) / 86400000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function LogEntry({ log }: { log: PracticeLog }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl bg-paper-dim p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">{log.drill_name}</span>
        <span className="text-xs text-ink-ghost">{formatDate(log.completed_at)}</span>
      </div>
      <CategoryBadge category={log.category as CategoryId} />
      {log.noticed && (
        <p className="mt-1 text-sm text-ink-muted leading-relaxed">
          &ldquo;{log.noticed}&rdquo;
        </p>
      )}
    </div>
  );
}
