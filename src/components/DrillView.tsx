"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Drill } from "@/lib/drills";
import { formatDuration } from "@/lib/drills";
import { CategoryBadge } from "./CategoryBadge";
import { Collapsible } from "./Collapsible";
import { Timer } from "./Timer";
import { createClient } from "@/lib/supabase/client";

type Phase = "drill" | "logging" | "saved";

export function DrillView({ drill }: { drill: Drill }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("drill");
  const [noticed, setNoticed] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      let newSeedId: string | null = null;

      if (user) {
        const text = noticed.trim();

        const { error: logError } = await supabase.from("practice_logs").insert({
          user_id: user.id,
          drill_id: drill.id,
          drill_name: drill.name,
          category: drill.category,
          noticed: drill.producesSeed ? null : text || null,
        });
        if (logError) throw logError;

        if (drill.producesSeed && text) {
          const { data: seed, error: seedError } = await supabase
            .from("seeds")
            .insert({
              user_id: user.id,
              body: text,
              source_drill_id: drill.id,
              category: drill.category,
              status: "seed",
            })
            .select("id")
            .single();
          if (seedError) throw seedError;
          newSeedId = seed.id;
        }
      }

      setPhase("saved");
      const dest = newSeedId ? `/seeds/${newSeedId}` : "/";
      setTimeout(() => router.push(dest), 600);
    } catch {
      setSaving(false);
      setPhase("drill");
    }
  }

  return (
    <div className="mx-auto max-w-lg px-5 pb-24 pt-4">
      {/* Back button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1 text-sm text-ink-muted"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Header */}
      <h1 className="text-2xl font-semibold text-ink">{drill.name}</h1>
      <div className="mt-2 flex items-center gap-2">
        <CategoryBadge category={drill.category} />
        <span className="text-xs text-ink-ghost">{formatDuration(drill.duration)}</span>
        <span className="text-xs text-ink-ghost capitalize">{drill.difficulty}</span>
      </div>

      {/* The Why */}
      <div className="mt-6">
        <Collapsible title="The Why" defaultOpen={true}>
          <p className="text-sm text-ink-muted leading-relaxed">{drill.theWhy}</p>
        </Collapsible>
      </div>

      {/* The Drill */}
      <div className="mt-4">
        <h2 className="py-3 text-sm font-semibold text-ink">The Drill</h2>
        <div className="text-sm text-ink-muted leading-relaxed whitespace-pre-line">
          {drill.theDrill}
        </div>
      </div>

      {/* Timer */}
      <div className="mt-8">
        <Timer durationSeconds={drill.duration} />
      </div>

      {/* Variations */}
      {drill.variations.length > 0 && (
        <div className="mt-6">
          <Collapsible title="Variations" defaultOpen={false}>
            <ul className="space-y-2">
              {drill.variations.map((v, i) => (
                <li key={i} className="text-sm text-ink-muted leading-relaxed">
                  <span className="text-ink-ghost mr-1">{i + 1}.</span> {v}
                </li>
              ))}
            </ul>
          </Collapsible>
        </div>
      )}

      {/* Log section */}
      <div className="mt-8">
        {phase === "drill" && (
          <button
            type="button"
            onClick={() => setPhase("logging")}
            className="w-full rounded-xl bg-sky py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            I Did It &rarr; {drill.producesSeed ? "Write" : "Log"}
          </button>
        )}

        {phase === "logging" && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-ink">
              {drill.producesSeed ? "Write your seed" : "What did you notice?"}
            </label>
            <textarea
              value={noticed}
              onChange={(e) => setNoticed(e.target.value)}
              placeholder={
                drill.producesSeed
                  ? "Generate freely — no editing, no plan. You can come back to it."
                  : "One sentence about what you observed..."
              }
              autoFocus
              rows={drill.producesSeed ? 14 : 2}
              className="w-full rounded-xl border border-paper-deep bg-paper-dim px-4 py-3 text-sm text-ink placeholder:text-ink-ghost outline-none focus:border-sky focus:ring-1 focus:ring-sky resize-none transition-colors leading-relaxed"
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || (drill.producesSeed && !noticed.trim())}
              className="w-full rounded-xl bg-sky py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : drill.producesSeed ? "Save Seed" : "Save"}
            </button>
          </div>
        )}

        {phase === "saved" && (
          <div className="rounded-xl bg-cat-articulation/10 p-4 text-center">
            <p className="text-sm font-medium text-cat-articulation">Logged!</p>
          </div>
        )}
      </div>
    </div>
  );
}
