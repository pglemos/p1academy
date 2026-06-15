import { NextResponse } from "next/server";
import { getBearerToken } from "@/lib/p1Admin";
import { getServiceSupabaseClient } from "@/lib/p1Supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const configuredToken = process.env.P1_BOOTSTRAP_TOKEN;
  if (!configuredToken) {
    return NextResponse.json({ message: "Bootstrap administrativo nao configurado." }, { status: 403 });
  }

  const bearer = getBearerToken(request);
  if (!bearer) {
    return NextResponse.json({ message: "Login obrigatorio para bootstrap." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  if (body?.token !== configuredToken) {
    return NextResponse.json({ message: "Token de bootstrap invalido." }, { status: 403 });
  }

  const supabase = getServiceSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser(bearer);
  const user = userData.user;

  if (userError || !user?.email) {
    return NextResponse.json({ message: "Sessao invalida." }, { status: 401 });
  }

  const { count, error: countError } = await supabase
    .from("p1_admin_users")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true);

  if (countError) {
    return NextResponse.json({ message: "Nao foi possivel verificar admins existentes." }, { status: 500 });
  }

  if ((count ?? 0) > 0) {
    return NextResponse.json({ message: "Bootstrap bloqueado: ja existe admin ativo." }, { status: 409 });
  }

  const { error } = await supabase.from("p1_admin_users").insert({
    email: user.email.toLowerCase(),
    role: "owner",
    is_active: true,
  });

  if (error) {
    return NextResponse.json({ message: "Nao foi possivel criar o primeiro admin." }, { status: 500 });
  }

  return NextResponse.json({ email: user.email, role: "owner" });
}
