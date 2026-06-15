import { NextResponse } from "next/server";
import { getLegendsPublicData } from "@/lib/p1Data";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (slug !== "legends-2026") {
    return NextResponse.json({ message: "Campeonato nao encontrado." }, { status: 404 });
  }

  const data = await getLegendsPublicData();
  return NextResponse.json({ source: data.source, ranking: data.ranking }, {
    headers: { "Cache-Control": "no-store" },
  });
}
