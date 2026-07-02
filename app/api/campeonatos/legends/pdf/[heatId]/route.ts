import { buildLegendsResultPdf } from "@/lib/legendsResultPdf";
import type { HeatInput } from "@/lib/legendsScoring";
import { getServiceSupabaseClient } from "@/lib/p1Supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ heatId: string }>;
};

type HeatRow = {
  title: string;
  raw_payload: HeatInput | null;
};

export async function GET(_request: Request, context: RouteContext) {
  const { heatId } = await context.params;
  const supabase = getServiceSupabaseClient();

  const { data: championship, error: championshipError } = await supabase
    .from("p1_championships")
    .select("id")
    .eq("slug", "legends-2026")
    .single();

  if (championshipError || !championship) {
    return new Response("Campeonato nao encontrado.", { status: 404 });
  }

  const { data: heat, error: heatError } = await supabase
    .from("p1_heats")
    .select("title, raw_payload")
    .eq("id", heatId)
    .eq("championship_id", championship.id)
    .eq("is_published", true)
    .single<HeatRow>();

  if (heatError || !heat?.raw_payload) {
    return new Response("Bateria publicada nao encontrada.", { status: 404 });
  }

  const pdf = buildLegendsResultPdf({
    ...heat.raw_payload,
    title: heat.raw_payload.title || heat.title,
  });

  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slugify(heat.title || "resultado-legends")}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}

function slugify(value: string): string {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "resultado-legends"
  );
}
