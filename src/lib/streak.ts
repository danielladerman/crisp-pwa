import { type SupabaseClient } from "@supabase/supabase-js";

export async function getStreak(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const { data } = await supabase
    .from("practice_logs")
    .select("completed_at")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })
    .limit(365);

  if (!data || data.length === 0) return 0;

  // Get distinct dates (in user's local midnight, but we approximate with UTC dates)
  const dates = [
    ...new Set(
      data.map((row) => new Date(row.completed_at).toISOString().slice(0, 10))
    ),
  ].sort((a, b) => b.localeCompare(a)); // newest first

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  // Streak must start from today or yesterday
  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diffDays = Math.round(
      (prev.getTime() - curr.getTime()) / 86400000
    );
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
