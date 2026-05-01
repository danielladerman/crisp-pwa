import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SeedEditor, type Seed } from "./SeedEditor";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `Seed ${id.slice(0, 6)} — Crisp` };
}

export default async function SeedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data, error } = await supabase
    .from("seeds")
    .select("id, body, category, status, source_drill_id, created_at, updated_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) notFound();

  return <SeedEditor seed={data as Seed} />;
}
