import { NextResponse } from "next/server";
import { isAdminContext, requireP1Admin } from "@/lib/p1Admin";
import { getServiceSupabaseClient } from "@/lib/p1Supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses = new Set(["active", "inactive", "suspended"]);

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
      return NextResponse.json({ message: "Status do piloto invalido." }, { status: 400 });
    }
    updatePayload.status = body.status;
  }

  if (typeof body.currentLevel === "string") {
    updatePayload.current_level = body.currentLevel.trim() || null;
  }

  if (typeof body.displayName === "string") {
    const displayName = body.displayName.trim();
    if (!displayName) {
      return NextResponse.json({ message: "Nome publico do piloto obrigatorio." }, { status: 400 });
    }
    updatePayload.display_name = displayName;
  }

  if (typeof body.publicProfile === "boolean") {
    updatePayload.public_profile = body.publicProfile;
  }

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json({ message: "Envie ao menos um campo para atualizar." }, { status: 400 });
  }

  const supabase = getServiceSupabaseClient();
  const { data: driver, error } = await supabase
    .from("p1_drivers")
    .update(updatePayload)
    .eq("id", id)
    .select("id")
    .single();

  if (error || !driver) {
    return NextResponse.json({ message: "Piloto nao encontrado." }, { status: 404 });
  }

  return NextResponse.json({ driver });
}
