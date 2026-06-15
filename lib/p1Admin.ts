import { NextResponse } from "next/server";
import { getServiceSupabaseClient } from "@/lib/p1Supabase";

export type P1AdminContext = {
  userId: string;
  email: string;
};

export async function requireP1Admin(request: Request): Promise<P1AdminContext | NextResponse> {
  const token = getBearerToken(request);

  if (!token) {
    return NextResponse.json({ message: "Login administrativo obrigatorio." }, { status: 401 });
  }

  const supabase = getServiceSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  const user = userData.user;

  if (userError || !user?.email) {
    return NextResponse.json({ message: "Sessao invalida." }, { status: 401 });
  }

  const { data: admin, error: adminError } = await supabase
    .from("p1_admin_users")
    .select("id,email,role,is_active")
    .eq("is_active", true)
    .ilike("email", user.email)
    .maybeSingle();

  if (adminError || !admin) {
    return NextResponse.json({ message: "Usuario sem acesso administrativo." }, { status: 403 });
  }

  return {
    userId: user.id,
    email: user.email,
  };
}

export function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  const [type, token] = authorization.split(" ");
  return type?.toLowerCase() === "bearer" && token ? token : "";
}

export function isAdminContext(value: P1AdminContext | NextResponse): value is P1AdminContext {
  return !(value instanceof NextResponse);
}
