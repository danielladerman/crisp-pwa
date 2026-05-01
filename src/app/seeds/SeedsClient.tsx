"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { type CategoryId, getCategoryById } from "@/lib/drills";

export type SeedStatus = "seed" | "drafting" | "shipped" | "killed";

export interface SeedListItem {
  id: string;
  body: string;
  category: CategoryId | null;
  status: SeedStatus;
  updated_at: string;
  source_drill_id: string | null;
}

const statusStyle: Record<SeedStatus, string> = {
  seed: "bg-paper-deep text-ink-muted",
  drafting: "bg-sky/15 text-sky",
  shipped: "bg-cat-articulation/15 text-cat-articulation",
  killed: "bg-ink-ghost/15 text-ink-ghost line-through",
};

export function SeedsClient({ initialSeeds }: { initialSeeds: SeedListItem[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  async function handleNew() {
    setCreating(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data, error } = await supabase
        .from("seeds")
        .insert({ user_id: user.id, body: "", status: "seed" })
        .select("id")
        .single();
      if (error) throw error;
      router.push(`/seeds/${data.id}`);
    } catch {
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-5 pt-8 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Seeds</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Half-formed thoughts becoming essays.
          </p>
        </div>
        <button
          type="button"
          onClick={handleNew}
          disabled={creating}
          className="flex items-center gap-1 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New
        </button>
      </div>

      {initialSeeds.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-ink-muted">No seeds yet.</p>
          <p className="mt-1 text-sm text-ink-ghost">
            Tap <span className="font-medium">New</span> to free-write, or run a Writing drill.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {initialSeeds.map((seed) => {
            const firstLine = seed.body.split("\n")[0]?.trim() || "(untitled)";
            const cat = seed.category ? getCategoryById(seed.category as CategoryId) : null;
            return (
              <Link
                key={seed.id}
                href={`/seeds/${seed.id}`}
                className="block rounded-xl bg-paper-dim p-4 transition-colors hover:bg-paper-deep"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="line-clamp-2 flex-1 text-sm font-medium text-ink">
                    {firstLine || "(empty)"}
                  </p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${statusStyle[seed.status]}`}
                  >
                    {seed.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-ink-ghost">
                  {cat && (
                    <span className="rounded-full bg-paper-deep px-2 py-0.5">
                      {cat.name}
                    </span>
                  )}
                  <span>{formatRelative(seed.updated_at)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}
