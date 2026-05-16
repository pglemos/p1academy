import { NextResponse } from "next/server";
import { normalizeLapTimeResponse } from "@/lib/laptimeAdapter";

export const dynamic = "force-dynamic";

export async function GET() {
  const sourceUrl = process.env.LEGENDS_LAPTIME_LIVE_URL;
  const token = process.env.LEGENDS_LAPTIME_API_TOKEN;

  if (!sourceUrl) {
    return NextResponse.json(
      {
        configured: false,
        message: "Fonte de cronometragem ao vivo ainda não configurada.",
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  try {
    const response = await fetch(sourceUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json,text/plain,text/html;q=0.9,*/*;q=0.8",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          configured: true,
          message: `Cronometragem respondeu com HTTP ${response.status}.`,
        },
        {
          status: 502,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : await response.text();
    const heat = normalizeLapTimeResponse(payload);

    if (!heat) {
      return NextResponse.json(
        {
          configured: true,
          message: "Fonte ao vivo disponível, mas o formato ainda não foi reconhecido.",
        },
        {
          status: 422,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    return NextResponse.json(
      {
        configured: true,
        syncedAt: new Date().toISOString(),
        heat,
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        configured: true,
        message: error instanceof Error ? error.message : "Falha ao consultar a cronometragem.",
      },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
