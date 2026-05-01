"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { type CategoryId, getCategoryById, getDrillById } from "@/lib/drills";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Collapsible } from "@/components/Collapsible";

type SeedStatus = "seed" | "drafting" | "shipped" | "killed";

export interface Seed {
  id: string;
  body: string;
  category: CategoryId | null;
  status: SeedStatus;
  source_drill_id: string | null;
  created_at: string;
  updated_at: string;
}

const STATUSES: { value: SeedStatus; label: string }[] = [
  { value: "seed", label: "Seed" },
  { value: "drafting", label: "Drafting" },
  { value: "shipped", label: "Shipped" },
  { value: "killed", label: "Killed" },
];

type SaveState = "saved" | "saving" | "dirty";

export function SeedEditor({ seed }: { seed: Seed }) {
  const router = useRouter();
  const [body, setBody] = useState(seed.body);
  const [status, setStatus] = useState<SeedStatus>(seed.status);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const lastSaved = useRef({ body: seed.body, status: seed.status });

  // Autosave body with 1.5s debounce
  useEffect(() => {
    if (body === lastSaved.current.body) return;
    setSaveState("dirty");
    const t = setTimeout(async () => {
      setSaveState("saving");
      const supabase = createClient();
      const { error } = await supabase
        .from("seeds")
        .update({ body })
        .eq("id", seed.id);
      if (!error) {
        lastSaved.current.body = body;
        setSaveState("saved");
      } else {
        setSaveState("dirty");
      }
    }, 1500);
    return () => clearTimeout(t);
  }, [body, seed.id]);

  async function changeStatus(next: SeedStatus) {
    setStatus(next);
    const supabase = createClient();
    const { error } = await supabase
      .from("seeds")
      .update({ status: next })
      .eq("id", seed.id);
    if (error) {
      setStatus(lastSaved.current.status);
    } else {
      lastSaved.current.status = next;
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this seed? This cannot be undone.")) return;
    const supabase = createClient();
    const { error } = await supabase.from("seeds").delete().eq("id", seed.id);
    if (!error) router.push("/seeds");
  }

  const sourceDrill = seed.source_drill_id ? getDrillById(seed.source_drill_id) : null;
  const cat = seed.category ? getCategoryById(seed.category) : null;

  return (
    <div className="mx-auto max-w-lg px-5 pb-24 pt-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/seeds")}
          className="flex items-center gap-1 text-sm text-ink-muted"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Seeds
        </button>
        <span className="text-xs text-ink-ghost">
          {saveState === "saving" && "Saving…"}
          {saveState === "saved" && "Saved"}
          {saveState === "dirty" && "Unsaved"}
        </span>
      </div>

      {(cat || sourceDrill) && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {cat && <CategoryBadge category={cat.id} />}
          {sourceDrill && (
            <span className="text-xs text-ink-ghost">from {sourceDrill.name}</span>
          )}
        </div>
      )}

      {sourceDrill && (
        <div className="mt-3 rounded-xl bg-paper-dim px-4">
          <Collapsible title="Drill prompt" defaultOpen={body.trim().length === 0}>
            <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-line">
              {sourceDrill.theDrill}
            </p>
          </Collapsible>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => changeStatus(s.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              status === s.value
                ? "bg-ink text-paper"
                : "bg-paper-deep text-ink-muted hover:bg-paper-deep/70"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Start writing. No rules. No editing yet."
        autoFocus
        rows={20}
        className="mt-5 w-full rounded-xl border border-paper-deep bg-paper-dim px-4 py-3 text-sm text-ink placeholder:text-ink-ghost outline-none focus:border-sky focus:ring-1 focus:ring-sky resize-none leading-relaxed transition-colors"
      />

      <div className="mt-4 flex items-center justify-between text-xs text-ink-ghost">
        <span>{wordCount(body)} words</span>
        <button
          type="button"
          onClick={handleDelete}
          className="text-recording hover:opacity-80"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function wordCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}
