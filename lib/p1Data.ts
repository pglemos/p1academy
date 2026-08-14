import {
  legendsCalendarSummary,
  legendsCompetition,
  legendsOfficialCalendar,
  legendsRankingPreview,
  legendsResultsPreview,
} from "@/data/legends";
import { formatScore, formatTimingValue } from "@/lib/legendsScoring";
import { getPublicSupabaseClient, hasPublicSupabaseEnv } from "@/lib/p1Supabase";
import type { P1CalendarMonth, P1PublicData } from "@/lib/p1Types";

const championshipSlug = "legends-2026";

type ChampionshipRow = {
  id: string;
  slug: string;
  name: string;
  edition: string;
  season: string;
  status: string;
  venue: string | null;
  address: string | null;
  organizer: string | null;
  whatsapp: string | null;
  whatsapp_number: string | null;
  format: string | null;
  ballast: string | null;
  heat_duration: string | null;
  super_final_duration: string | null;
  seats: string | null;
  valid_results: string | null;
  expected_stages: string | null;
  rules_pdf: string | null;
  calendar_pdf: string | null;
  version: string | null;
  version_date: string | null;
  settings: Record<string, unknown> | null;
};

type StageRow = {
  id: string;
  stage_code: string;
  race_number: number;
  scheduled_date: string;
  scheduled_time: string;
  weekday: string;
  month_name: string;
  status: string;
};

type StandingRow = {
  position: number;
  driver_name: string;
  total: number | string;
  valid_regular_results: number;
  wins: number;
};

type HeatRow = {
  id: string;
  title: string;
  heat_date: string;
  type: string;
};

type ResultRow = {
  heat_id: string;
  driver_name: string;
  position: number | null;
  official_ms: number | null;
  score: number | string;
  status: string;
};

export async function getLegendsPublicData(): Promise<P1PublicData> {
  if (!hasPublicSupabaseEnv()) {
    return getStaticLegendsData();
  }

  try {
    const supabase = getPublicSupabaseClient();
    const { data: championship, error: championshipError } = await supabase
      .from("p1_championships")
      .select("*")
      .eq("slug", championshipSlug)
      .single<ChampionshipRow>();

    if (championshipError || !championship) {
      return getStaticLegendsData();
    }

    const [{ data: stages }, { data: standings }, { data: heats }] = await Promise.all([
      supabase
        .from("p1_stages")
        .select("id, stage_code, race_number, scheduled_date, scheduled_time, weekday, month_name, status")
        .eq("championship_id", championship.id)
        .order("sort_order", { ascending: true })
        .returns<StageRow[]>(),
        supabase
          .from("p1_public_standings")
          .select("position, driver_name, total, valid_regular_results, wins")
          .eq("championship_slug", championshipSlug)
          .order("position", { ascending: true })
          .returns<StandingRow[]>(),
      supabase
        .from("p1_heats")
        .select("id, title, heat_date, type")
        .eq("championship_id", championship.id)
        .eq("is_published", true)
        .order("heat_date", { ascending: false })
        .order("created_at", { ascending: false })
        .returns<HeatRow[]>(),
    ]);

    const orderedHeats = [...(heats ?? [])].sort((a, b) => {
      const byDate = a.heat_date.localeCompare(b.heat_date);
      if (byDate !== 0) {
        return byDate;
      }

      return a.title.localeCompare(b.title, "pt-BR");
    });
    const results = await loadHeatResults(orderedHeats);

    return {
      source: "supabase",
      championship: {
        id: championship.id,
        slug: championship.slug,
        name: championship.name,
        edition: championship.edition,
        season: championship.season,
        status: championship.status,
        venue: championship.venue ?? legendsCompetition.venue,
        address: championship.address ?? legendsCompetition.address,
        organizer: championship.organizer ?? legendsCompetition.organizer,
        whatsapp: championship.whatsapp ?? legendsCompetition.whatsapp,
        whatsappNumber: championship.whatsapp_number ?? legendsCompetition.whatsappNumber,
        format: championship.format ?? legendsCompetition.format,
        ballast: championship.ballast ?? legendsCompetition.ballast,
        heatDuration: championship.heat_duration ?? legendsCompetition.heatDuration,
        superFinalDuration: championship.super_final_duration ?? legendsCompetition.superFinalDuration,
        seats: championship.seats ?? legendsCompetition.seats,
        validResults: championship.valid_results ?? legendsCompetition.validResults,
        expectedStages: championship.expected_stages ?? legendsCompetition.expectedStages,
        rulesPdf: championship.rules_pdf ?? "/regulamentos/regulamento-legends-kart-series-2026.pdf",
        calendarPdf: championship.calendar_pdf ?? "/regulamentos/calendario-legends-kart-series-2026.pdf",
        version: championship.version ?? legendsCompetition.version,
        versionDate: formatDateBr(championship.version_date) || legendsCompetition.versionDate,
        settings: championship.settings ?? {},
      },
      calendarSummary: {
        totalRaces: Number(championship.settings?.totalRaces ?? stages?.length ?? legendsCalendarSummary.totalRaces),
        months: String(championship.settings?.months ?? legendsCalendarSummary.months),
        firstRace: String(championship.settings?.firstRace ?? legendsCalendarSummary.firstRace),
        finalRace: String(championship.settings?.finalRace ?? legendsCalendarSummary.finalRace),
        weekdayWindows: String(championship.settings?.weekdayWindows ?? legendsCalendarSummary.weekdayWindows),
        saturdayWindow: String(championship.settings?.saturdayWindow ?? legendsCalendarSummary.saturdayWindow),
      },
      calendarMonths: stages?.length ? groupStagesByMonth(stages) : legendsOfficialCalendar,
      ranking: standings?.length ? standings.map((row) => ({
        position: String(row.position).padStart(2, "0"),
        driver: row.driver_name,
        level: row.wins > 0 ? `${row.wins} vit.` : "Classificado",
        points: formatScore(Number(row.total)),
        valid: `${row.valid_regular_results}/10`,
        wins: row.wins,
      })) : legendsRankingPreview,
      results: results.length ? results : legendsResultsPreview,
    };
  } catch {
    return getStaticLegendsData();
  }
}

function getStaticLegendsData(): P1PublicData {
  return {
    source: "static",
    championship: {
      id: championshipSlug,
      slug: championshipSlug,
      name: legendsCompetition.name,
      edition: legendsCompetition.edition,
      season: legendsCompetition.season,
      status: legendsCompetition.status,
      venue: legendsCompetition.venue,
      address: legendsCompetition.address,
      organizer: legendsCompetition.organizer,
      whatsapp: legendsCompetition.whatsapp,
      whatsappNumber: legendsCompetition.whatsappNumber,
      format: legendsCompetition.format,
      ballast: legendsCompetition.ballast,
      heatDuration: legendsCompetition.heatDuration,
      superFinalDuration: legendsCompetition.superFinalDuration,
      seats: legendsCompetition.seats,
      validResults: legendsCompetition.validResults,
      expectedStages: legendsCompetition.expectedStages,
      rulesPdf: "/regulamentos/regulamento-legends-kart-series-2026.pdf",
      calendarPdf: "/regulamentos/calendario-legends-kart-series-2026.pdf",
      version: legendsCompetition.version,
      versionDate: legendsCompetition.versionDate,
      settings: {},
    },
    calendarSummary: legendsCalendarSummary,
    calendarMonths: legendsOfficialCalendar,
    ranking: legendsRankingPreview,
    results: legendsResultsPreview,
  };
}

function groupStagesByMonth(stages: StageRow[]): P1CalendarMonth[] {
  const byMonth = new Map<string, P1CalendarMonth>();

  stages.forEach((stage) => {
    const month = byMonth.get(stage.month_name) ?? { month: stage.month_name, races: [] };
    month.races.push({
      id: stage.id,
      code: stage.stage_code,
      race: stage.race_number,
      date: formatDateBr(stage.scheduled_date),
      day: stage.weekday,
      time: stage.scheduled_time.slice(0, 5),
      status: stage.status,
    });
    byMonth.set(stage.month_name, month);
  });

  return Array.from(byMonth.values());
}

async function loadHeatResults(heats: HeatRow[]) {
  if (heats.length === 0) {
    return [];
  }

  const supabase = getPublicSupabaseClient();
  const { data: rows } = await supabase
    .from("p1_heat_results")
    .select("heat_id, driver_name, position, official_ms, score, status")
    .in("heat_id", heats.map((heat) => heat.id))
    .eq("position", 1)
    .order("created_at", { ascending: false })
    .returns<ResultRow[]>();

  const winners = new Map((rows ?? []).map((row) => [row.heat_id, row]));

  return heats.map((heat) => {
    const winner = winners.get(heat.id);
    return {
      heat: heat.title,
      date: formatDateBr(heat.heat_date),
      winner: winner?.driver_name ?? "Resultado pendente",
      bestLap: winner ? formatTimingValue(winner.official_ms) : "-",
      points: winner ? formatScore(Number(winner.score)) : heat.type === "super_final" ? "5,000" : "10,000",
      pdfHref: `/api/campeonatos/legends/pdf/${heat.id}`,
    };
  });
}

function formatDateBr(value?: string | null) {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.slice(0, 10).split("-");
  return day && month && year ? `${day}/${month}/${year}` : value;
}
