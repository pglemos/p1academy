import {
  buildLegendsOverallPdf,
  type LegendsOverallHeat,
  type LegendsOverallResult,
  type LegendsOverallStanding,
} from "@/lib/legendsOverallPdf";
import { getServiceSupabaseClient } from "@/lib/p1Supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const championshipSlug = "legends-2026";

type ChampionshipRow = {
  id: string;
  name: string;
  season: string;
};

type HeatRow = {
  id: string;
  title: string;
  heat_date: string;
  type: string;
};

type StandingRow = {
  position: number;
  driver_name: string;
  total: number | string;
  regular_total: number | string;
  super_final_total: number | string;
  valid_regular_results: number;
  discarded_regular_results: number;
  wins: number;
};

type ResultRow = {
  heat_id: string;
  driver_name: string;
  score: number | string;
  position: number | null;
  official_ms: number | null;
  status: string;
};

export async function GET() {
  const supabase = getServiceSupabaseClient();
  const { data: championship, error: championshipError } = await supabase
    .from("p1_championships")
    .select("id, name, season")
    .eq("slug", championshipSlug)
    .single<ChampionshipRow>();

  if (championshipError || !championship) {
    return new Response("Campeonato nao encontrado.", { status: 404 });
  }

  const { data: heats, error: heatsError } = await supabase
    .from("p1_heats")
    .select("id, title, heat_date, type")
    .eq("championship_id", championship.id)
    .eq("is_published", true)
    .order("heat_date", { ascending: true })
    .order("title", { ascending: true })
    .returns<HeatRow[]>();

  if (heatsError || !heats?.length) {
    return new Response("Nenhuma bateria publicada encontrada.", { status: 404 });
  }

  const { data: standings, error: standingsError } = await supabase
    .from("p1_public_standings")
    .select("position, driver_name, total, regular_total, super_final_total, valid_regular_results, discarded_regular_results, wins")
    .eq("championship_slug", championshipSlug)
    .order("position", { ascending: true })
    .returns<StandingRow[]>();

  if (standingsError || !standings?.length) {
    return new Response("Classificacao nao encontrada.", { status: 404 });
  }

  const { data: results, error: resultsError } = await supabase
    .from("p1_heat_results")
    .select("heat_id, driver_name, score, position, official_ms, status")
    .in("heat_id", heats.map((heat) => heat.id))
    .eq("status", "ok")
    .returns<ResultRow[]>();

  if (resultsError) {
    return new Response("Resultados nao encontrados.", { status: 500 });
  }

  const pdf = await buildLegendsOverallPdf({
    championshipName: championship.name,
    season: championship.season,
    generatedAt: new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "America/Sao_Paulo",
    }).format(new Date()),
    heats: heats.map<LegendsOverallHeat>((heat) => ({
      id: heat.id,
      title: heat.title,
      date: heat.heat_date,
      type: heat.type,
    })),
    standings: standings.map<LegendsOverallStanding>((row) => ({
      position: Number(row.position),
      driverName: row.driver_name,
      total: Number(row.total),
      regularTotal: Number(row.regular_total),
      superFinalTotal: Number(row.super_final_total),
      validRegularResults: Number(row.valid_regular_results),
      discardedRegularResults: Number(row.discarded_regular_results),
      wins: Number(row.wins),
    })),
    results: (results ?? []).map<LegendsOverallResult>((row) => ({
      heatId: row.heat_id,
      driverName: row.driver_name,
      score: Number(row.score),
      position: row.position,
      officialMs: row.official_ms,
    })),
  });

  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="resultado-geral-legends-kart-series.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
