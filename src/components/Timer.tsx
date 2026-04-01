"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function Timer({
  durationSeconds,
  onComplete,
}: {
  durationSeconds: number;
  onComplete?: () => void;
}) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const remainingAtStartRef = useRef(durationSeconds);
  const rafRef = useRef<number>(0);

  const tick = useCallback(() => {
    if (!startTimeRef.current) return;

    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const newRemaining = Math.max(0, remainingAtStartRef.current - elapsed);
    setRemaining(newRemaining);

    if (newRemaining <= 0) {
      setIsRunning(false);
      startTimeRef.current = null;
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
      onComplete?.();
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [onComplete]);

  useEffect(() => {
    if (isRunning) {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isRunning, tick]);

  function start() {
    startTimeRef.current = Date.now();
    remainingAtStartRef.current = remaining;
    setIsRunning(true);
  }

  function pause() {
    setIsRunning(false);
    startTimeRef.current = null;
  }

  function reset() {
    setIsRunning(false);
    startTimeRef.current = null;
    setRemaining(durationSeconds);
  }

  const progress = remaining / durationSeconds;
  const offset = CIRCUMFERENCE * (1 - progress);
  const mins = Math.floor(remaining / 60);
  const secs = Math.floor(remaining % 60);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-36 w-36">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="var(--paper-deep)"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="var(--sky)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-200"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-semibold tabular-nums text-ink">
            {mins}:{secs.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        {!isRunning ? (
          <button
            type="button"
            onClick={remaining > 0 ? start : reset}
            className="rounded-xl bg-sky px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {remaining <= 0 ? "Reset" : remaining < durationSeconds ? "Resume" : "Start"}
          </button>
        ) : (
          <button
            type="button"
            onClick={pause}
            className="rounded-xl bg-paper-deep px-6 py-2.5 text-sm font-medium text-ink transition-opacity hover:opacity-90"
          >
            Pause
          </button>
        )}
        {remaining < durationSeconds && remaining > 0 && (
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-paper-deep px-6 py-2.5 text-sm font-medium text-ink-muted transition-opacity hover:opacity-90"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
