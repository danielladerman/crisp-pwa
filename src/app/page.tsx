import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, getDrillsByCategory, DRILLS } from "@/lib/drills";
import { getStreak } from "@/lib/streak";
import { HomeContent } from "./HomeContent";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let streak = 0;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      streak = await getStreak(supabase, user.id);
    }
  } catch {
    // Not authenticated or Supabase unavailable
  }

  const randomDrill = DRILLS[Math.floor(Math.random() * DRILLS.length)];

  const categoriesWithCounts = CATEGORIES.map((cat) => ({
    ...cat,
    drillCount: getDrillsByCategory(cat.id).length,
  }));

  return (
    <HomeContent
      streak={streak}
      randomDrillId={randomDrill.id}
      categories={categoriesWithCounts}
    />
  );
}
