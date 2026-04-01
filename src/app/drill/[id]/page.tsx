import { notFound } from "next/navigation";
import { getDrillById, DRILLS } from "@/lib/drills";
import { DrillView } from "@/components/DrillView";

export function generateStaticParams() {
  return DRILLS.map((drill) => ({ id: drill.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const drill = getDrillById(id);
  if (!drill) return { title: "Drill Not Found" };
  return { title: `${drill.name} — Crisp` };
}

export default async function DrillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const drill = getDrillById(id);

  if (!drill) {
    notFound();
  }

  return <DrillView drill={drill} />;
}
