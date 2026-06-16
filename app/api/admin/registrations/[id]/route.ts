import { NextResponse } from "next/server";
import { isAdminContext, requireP1Admin } from "@/lib/p1Admin";
import { getServiceSupabaseClient } from "@/lib/p1Supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses = new Set(["pending", "approved", "rejected", "waitlist"]);

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
  const hasStatus = typeof body.status === "string" && body.status.length > 0;
  const status = hasStatus ? (body.status as string) : "";
  const hasAdminNotes = typeof body.adminNotes === "string";

  if (hasStatus && !allowedStatuses.has(status)) {
    return NextResponse.json({ message: "Status invalido." }, { status: 400 });
  }

  if (!hasStatus && !hasAdminNotes) {
    return NextResponse.json({ message: "Envie um novo status ou uma nota interna." }, { status: 400 });
  }

  const updatePayload: Record<string, unknown> = {};

  if (hasStatus) {
    updatePayload.status = status;
    updatePayload.reviewed_at = new Date().toISOString();
    updatePayload.reviewed_by = admin.userId;
  }

  if (hasAdminNotes) {
    updatePayload.admin_notes = body.adminNotes;
  }

  const supabase = getServiceSupabaseClient();
  const { data: registration, error } = await supabase
    .from("p1_registrations")
    .update(updatePayload)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !registration) {
    return NextResponse.json({ message: "Inscricao nao encontrada." }, { status: 404 });
  }

  if (status === "approved") {
    await supabase.from("p1_drivers").upsert({
      championship_id: registration.championship_id,
      registration_id: registration.id,
      full_name: registration.full_name,
      display_name: registration.full_name,
      email: registration.email,
      whatsapp: registration.whatsapp,
      city: registration.city,
      current_level: registration.current_level,
      weight: registration.weight,
      status: "active",
      public_profile: true,
    }, { onConflict: "registration_id" });
  }

  return NextResponse.json({ registration });
}
