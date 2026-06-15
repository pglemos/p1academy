import { NextRequest } from "next/server";
import { buildLegendsResultPdf } from "@/lib/legendsResultPdf";
import type { HeatInput } from "@/lib/legendsScoring";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const data = request.nextUrl.searchParams.get("data");
  const heat = decodeHeatParam(data);

  if (!heat) {
    return new Response("Resultado nao informado.", { status: 400 });
  }

  const pdf = buildLegendsResultPdf(heat);

  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slugify(heat.title || "resultado-legends")}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}

function decodeHeatParam(data: string | null): HeatInput | null {
  if (!data) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(decodeURIComponent(data), "base64").toString("utf-8")) as HeatInput;
  } catch {
    try {
      return JSON.parse(Buffer.from(data, "base64").toString("utf-8")) as HeatInput;
    } catch {
      return null;
    }
  }
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "resultado-legends";
}
