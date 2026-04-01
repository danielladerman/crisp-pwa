"use client";

import { useState } from "react";
import Link from "next/link";
import { CategoryCard } from "@/components/CategoryCard";
import { type CategoryId, getDrillsByCategory, type Category } from "@/lib/drills";

interface CategoryWithCount extends Category {
  drillCount: number;
}

export function HomeContent({
  streak,
  randomDrillId,
  categories,
}: {
  streak: number;
  randomDrillId: string;
  categories: CategoryWithCount[];
}) {
  const [expandedCat, setExpandedCat] = useState<CategoryId | null>(null);

  return (
    <div className="mx-auto max-w-lg px-5 pt-8 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">
            What do you want to practice?
          </h1>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-gold/15 px-3 py-1">
            <span className="text-sm">&#128293;</span>
            <span className="text-xs font-semibold text-gold">{streak}</span>
          </div>
        )}
      </div>

      {/* Random drill */}
      <Link
        href={`/drill/${randomDrillId}`}
        className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-paper-deep bg-paper-dim py-3 text-sm font-medium text-ink-muted transition-colors hover:bg-paper-deep"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
        </svg>
        Random Drill
      </Link>

      {/* Category grid */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            id={cat.id}
            name={cat.name}
            subtitle={cat.subtitle}
            drillCount={cat.drillCount}
            active={expandedCat === cat.id}
            onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
          />
        ))}
      </div>

      {/* Expanded drill list */}
      {expandedCat && (
        <div className="mt-4 space-y-2">
          <h2 className="text-sm font-semibold text-ink">
            {categories.find((c) => c.id === expandedCat)?.name} Drills
          </h2>
          {getDrillsByCategory(expandedCat).map((drill) => (
            <Link
              key={drill.id}
              href={`/drill/${drill.id}`}
              className="flex items-center justify-between rounded-xl bg-paper-dim px-4 py-3 transition-colors hover:bg-paper-deep"
            >
              <div>
                <p className="text-sm font-medium text-ink">{drill.name}</p>
                <p className="text-xs text-ink-ghost capitalize">
                  {drill.difficulty} &middot; {Math.floor(drill.duration / 60)}m
                </p>
              </div>
              <svg className="h-4 w-4 text-ink-ghost" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
