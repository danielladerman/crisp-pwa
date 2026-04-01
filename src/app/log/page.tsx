import { createClient } from "@/lib/supabase/server";
import { LogEntry, type PracticeLog } from "@/components/LogEntry";

export const metadata = { title: "Practice Log — Crisp" };
export const dynamic = "force-dynamic";

export default async function LogPage() {
  let logs: PracticeLog[] = [];

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from("practice_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(50);

      logs = (data as PracticeLog[]) || [];
    }
  } catch {
    // Not authenticated or Supabase unavailable
  }

  return (
    <div className="mx-auto max-w-lg px-5 pt-8 pb-6">
      <h1 className="text-2xl font-semibold text-ink">Practice Log</h1>

      {logs.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-ink-muted">No practice sessions yet.</p>
          <p className="mt-1 text-sm text-ink-ghost">
            Start your first drill and it will show up here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {logs.map((log) => (
            <LogEntry key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  );
}
