import { NextResponse } from "next/server";
import { isAdminContext, requireP1Admin } from "@/lib/p1Admin";
import { getServiceSupabaseClient } from "@/lib/p1Supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses = new Set(["scheduled", "open", "full", "completed", "cancelled"]);

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const admin = await requireP1Admin(request);
  if (!isAdminContext(admin)) {
    return admin;
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const updatePayload: Record<string, unknown> = {};

  if (typeof body.status === "string") {
    if (!allowedStatuses.has(body.status)) {
      return NextResponse.json({ message: "Status da etapa invalido." }, { status: 400 });
    }
    updatePayload.status = body.status;
  }

  if (typeof body.maxSeats === "number") {
    if (!Number.isFinite(body.maxSeats) || body.maxSeats < 0) {
      return NextResponse.json({ message: "Quantidade de vagas invalida." }, { status: 400 });
    }
    updatePayload.max_seats = Math.floor(body.maxSeats);
  }

  if (typeof body.isPublished === "boolean") {
    updatePayload.is_published = body.isPublished;
  }

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json({ message: "Envie ao menos um campo para atualizar." }, { status: 400 });
  }

  const supabase = getServiceSupabaseClient();
  const { data: stage, error } = await supabase
    .from("p1_stages")
    .update(updatePayload)
    .eq("id", id)
    .select("id")
    .single();

  if (error || !stage) {
    return NextResponse.json({ message: "Etapa nao encontrada." }, { status: 404 });
  }

  return NextResponse.json({ stage });
}
