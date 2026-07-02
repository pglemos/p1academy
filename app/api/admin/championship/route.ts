import { NextResponse } from "next/server";
import { isAdminContext, requireP1Admin } from "@/lib/p1Admin";
import { getServiceSupabaseClient } from "@/lib/p1Supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses = new Set(["Calendário oficial publicado", "draft", "active", "completed", "archived"]);

export async function PATCH(request: Request) {
  const admin = await requireP1Admin(request);
  if (!isAdminContext(admin)) {
    return admin;
  }

  const body = await request.json().catch(() => ({}));
  const updatePayload: Record<string, unknown> = {};

  if (typeof body.status === "string") {
    if (!allowedStatuses.has(body.status)) {
      return NextResponse.json({ message: "Status do campeonato invalido." }, { status: 400 });
    }
    updatePayload.status = body.status;
  }

  if (typeof body.isPublished === "boolean") {
    updatePayload.is_published = body.isPublished;
  }

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json({ message: "Envie ao menos um campo para atualizar." }, { status: 400 });
  }

  const supabase = getServiceSupabaseClient();
  const { data: championship, error } = await supabase
    .from("p1_championships")
    .update(updatePayload)
    .eq("slug", "legends-2026")
    .select("id")
    .single();

  if (error || !championship) {
    return NextResponse.json({ message: "Campeonato nao encontrado." }, { status: 404 });
  }

  return NextResponse.json({ championship });
}
