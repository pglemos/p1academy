import { NextResponse } from "next/server";
import { isAdminContext, requireP1Admin } from "@/lib/p1Admin";
import { calculateHeatResults, type HeatInput } from "@/lib/legendsScoring";
import { getServiceSupabaseClient } from "@/lib/p1Supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const admin = await requireP1Admin(request);
  if (!isAdminContext(admin)) {
    return admin;
  }

  const body = await request.json().catch(() => null) as (HeatInput & { stageId?: string; publish?: boolean }) | null;
  if (!body?.title || !body.date || !Array.isArray(body.drivers)) {
    return NextResponse.json({ message: "Dados da bateria incompletos." }, { status: 400 });
  }

  const results = calculateHeatResults(body);
  if (results.length === 0) {
    return NextResponse.json({ message: "Inclua ao menos um piloto com resultado." }, { status: 400 });
  }

  const supabase = getServiceSupabaseClient();
  const { data: championship, error: championshipError } = await supabase
    .from("p1_championships")
    .select("id")
    .eq("slug", "legends-2026")
    .single();

  if (championshipError || !championship) {
    return NextResponse.json({ message: "Campeonato nao encontrado." }, { status: 500 });
  }

  const { data: heat, error: heatError } = await supabase
    .from("p1_heats")
    .insert({
      championship_id: championship.id,
      stage_id: body.stageId || null,
      title: body.title,
      heat_date: body.date,
      type: body.type === "super-final" ? "super_final" : "regular",
      source: normalizeSource(body.source),
      track_layout: body.trackLayout ?? null,
      category: body.category ?? null,
      is_published: body.publish ?? true,
      raw_payload: body,
    })
    .select("id")
    .single();

  if (heatError || !heat) {
    return NextResponse.json({ message: "Nao foi possivel salvar a bateria." }, { status: 500 });
  }

  const { error: resultError } = await supabase.from("p1_heat_results").insert(results.map((result) => ({
    heat_id: heat.id,
    championship_id: championship.id,
    driver_name: result.name,
    kart: result.kart ?? null,
    position: result.position,
    status: result.status,
    raw_ms: result.rawMs,
    official_ms: result.officialMs,
    gap_ms: result.gapMs,
    score: result.score,
    note: result.note || null,
    source_position: result.sourcePosition ?? null,
    best_lap_number: result.bestLapNumber ?? null,
    total_laps: result.totalLaps ?? null,
    average_speed_kmh: result.averageSpeedKmh ?? null,
    second_best_lap_number: result.secondBestLapNumber ?? null,
    second_best_time: result.secondBestTime ?? null,
    federation: result.federation ?? null,
    gap_to_leader: result.gapToLeader ?? null,
    gap_to_previous: result.gapToPrevious ?? null,
  })));

  if (resultError) {
    await supabase.from("p1_heats").delete().eq("id", heat.id);
    return NextResponse.json({ message: "Nao foi possivel salvar os resultados." }, { status: 500 });
  }

  return NextResponse.json({ heatId: heat.id, results: results.length }, { status: 201 });
}

function normalizeSource(source: HeatInput["source"] | undefined) {
  if (source === "timing-live") {
    return "live";
  }

  if (source === "snapshot") {
    return "import";
  }

  return "manual";
}
