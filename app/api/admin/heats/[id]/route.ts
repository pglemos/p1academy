import { NextResponse } from "next/server";
import { isAdminContext, requireP1Admin } from "@/lib/p1Admin";
import { getServiceSupabaseClient } from "@/lib/p1Supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  if (typeof body.isPublished !== "boolean") {
    return NextResponse.json({ message: "Envie o estado de publicacao da bateria." }, { status: 400 });
  }

  const supabase = getServiceSupabaseClient();
  const { data: heat, error } = await supabase
    .from("p1_heats")
    .update({ is_published: body.isPublished })
    .eq("id", id)
    .select("id")
    .single();

  if (error || !heat) {
    return NextResponse.json({ message: "Bateria nao encontrada." }, { status: 404 });
  }

  return NextResponse.json({ heat });
}

export async function DELETE(request: Request, context: RouteContext) {
  const admin = await requireP1Admin(request);
  if (!isAdminContext(admin)) {
    return admin;
  }

  const { id } = await context.params;
  const supabase = getServiceSupabaseClient();

  const { error: resultError } = await supabase.from("p1_heat_results").delete().eq("heat_id", id);
  if (resultError) {
    return NextResponse.json({ message: "Nao foi possivel remover os resultados da bateria." }, { status: 500 });
  }

  const { data: heat, error } = await supabase.from("p1_heats").delete().eq("id", id).select("id").single();
  if (error || !heat) {
    return NextResponse.json({ message: "Bateria nao encontrada." }, { status: 404 });
  }

  return NextResponse.json({ heat });
}
