import { NextResponse } from "next/server";
import { isAdminContext, requireP1Admin } from "@/lib/p1Admin";
import { getServiceSupabaseClient } from "@/lib/p1Supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const admin = await requireP1Admin(request);
  if (!isAdminContext(admin)) {
    return admin;
  }

  const supabase = getServiceSupabaseClient();
  const { data: championship, error: championshipError } = await supabase
    .from("p1_championships")
    .select("id, slug, name, season")
    .eq("slug", "legends-2026")
    .single();

  if (championshipError || !championship) {
    return NextResponse.json({ message: "Campeonato nao encontrado." }, { status: 500 });
  }

  const [registrations, drivers, stages, heats, standings] = await Promise.all([
    supabase
      .from("p1_registrations")
      .select("id, protocol, full_name, email, whatsapp, city, current_level, preferred_race_windows, status, created_at")
      .eq("championship_id", championship.id)
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("p1_drivers")
      .select("id, display_name, email, whatsapp, city, current_level, status, created_at")
      .eq("championship_id", championship.id)
      .order("display_name", { ascending: true })
      .limit(100),
    supabase
      .from("p1_stages")
      .select("id, stage_code, title, scheduled_date, scheduled_time, weekday, status, max_seats")
      .eq("championship_id", championship.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("p1_heats")
      .select("id, title, heat_date, type, source, is_published, created_at")
      .eq("championship_id", championship.id)
      .order("heat_date", { ascending: false })
      .limit(50),
    supabase
      .from("p1_public_standings")
      .select("position, driver_name, total, regular_total, super_final_total, valid_regular_results, wins")
      .eq("championship_slug", "legends-2026")
      .order("position", { ascending: true })
      .limit(50),
  ]);

  return NextResponse.json({
    admin,
    championship,
    registrations: registrations.data ?? [],
    drivers: drivers.data ?? [],
    stages: stages.data ?? [],
    heats: heats.data ?? [],
    standings: standings.data ?? [],
  }, {
    headers: { "Cache-Control": "no-store" },
  });
}
