import { buildLegendsResultPdf } from "@/lib/legendsResultPdf";
import { compareLegendsHeatOrder, formatLegendsHeatTitle, type HeatInput } from "@/lib/legendsScoring";
import { getServiceSupabaseClient } from "@/lib/p1Supabase";
import { isSuperFinalHeatType } from "@/lib/p1Types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ heatId: string }>;
};

type HeatRow = {
  id: string;
  title: string;
  heat_date: string;
  type: string;
  created_at: string;
  raw_payload: HeatInput | null;
};

type PublishedHeatOrderRow = Pick<HeatRow, "id" | "title" | "heat_date" | "type" | "created_at">;

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
    .select("id, title, heat_date, type, created_at, raw_payload")
    .eq("id", heatId)
    .eq("championship_id", championship.id)
    .eq("is_published", true)
    .single<HeatRow>();

  if (heatError || !heat?.raw_payload) {
    return new Response("Bateria publicada nao encontrada.", { status: 404 });
  }

  const { data: publishedHeats, error: publishedHeatsError } = await supabase
    .from("p1_heats")
    .select("id, title, heat_date, type, created_at")
    .eq("championship_id", championship.id)
    .eq("is_published", true)
    .returns<PublishedHeatOrderRow[]>();
  const orderedRegularHeats = publishedHeatsError
    ? []
    : [...(publishedHeats ?? [])]
      .sort((a, b) => compareLegendsHeatOrder({
        id: a.id,
        title: a.title,
        date: a.heat_date,
        createdAt: a.created_at,
      }, {
        id: b.id,
        title: b.title,
        date: b.heat_date,
        createdAt: b.created_at,
      }))
      .filter((publishedHeat) => !isSuperFinalHeatType(publishedHeat.type));
  const regularNumber = orderedRegularHeats.findIndex((publishedHeat) => publishedHeat.id === heat.id) + 1;
  const displayTitle = isSuperFinalHeatType(heat.type) || regularNumber === 0
    ? heat.title || heat.raw_payload.title
    : formatLegendsHeatTitle(regularNumber);

  const pdf = buildLegendsResultPdf({
    ...heat.raw_payload,
    title: displayTitle,
  });

  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slugify(displayTitle || "resultado-legends")}.pdf"`,
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
