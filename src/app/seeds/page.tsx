import { createClient } from "@/lib/supabase/server";
import { SeedsClient, type SeedListItem } from "./SeedsClient";

export const metadata = { title: "Seeds — Crisp" };
export const dynamic = "force-dynamic";

export default async function SeedsPage() {
  let seeds: SeedListItem[] = [];

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from("seeds")
        .select("id, body, category, status, updated_at, source_drill_id")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(100);

      seeds = (data as SeedListItem[]) || [];
    }
  } catch {
    // Not authenticated or Supabase unavailable
  }

  return <SeedsClient initialSeeds={seeds} />;
}
