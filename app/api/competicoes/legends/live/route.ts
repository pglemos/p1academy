import { NextResponse } from "next/server";
import { normalizeTimingResponse } from "@/lib/timingAdapter";
import type { HeatInput } from "@/lib/legendsScoring";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const defaultTestSourceUrl = "https://livetime.azurewebsites.net/?uid=58856059-c4fd-4626-aea7-42aefc048eec";
const renderedCacheTtlMs = 6_000;
let renderedCache: { sourceUrl: string; heat: HeatInput; syncedAt: string; expiresAt: number } | null = null;
let lastRenderIssue = "";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const querySourceUrl = requestUrl.searchParams.get("source");
  const sourceUrl = normalizeAllowedSourceUrl(querySourceUrl)
    ?? process.env.LEGENDS_TIMING_LIVE_URL
    ?? process.env.LEGENDS_LIVE_URL
    ?? process.env[joinKey("LEGENDS_", "LAP", "TIME", "_LIVE_URL")]
    ?? defaultTestSourceUrl;
  const token = process.env.LEGENDS_TIMING_API_TOKEN
    ?? process.env.LEGENDS_API_TOKEN
    ?? process.env[joinKey("LEGENDS_", "LAP", "TIME", "_API_TOKEN")];

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
    const heat = normalizeTimingResponse(payload) ?? await renderLiveTimeSource(sourceUrl);

    if (!heat) {
      return NextResponse.json(
        {
          configured: true,
          waiting: true,
          sourceUrl,
          message: lastRenderIssue
            ? `Fonte ao vivo conectada, mas a renderização da LiveTime falhou: ${lastRenderIssue}`
            : "Fonte ao vivo conectada. Aguardando a cronometragem publicar a tabela da corrida.",
        },
        {
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    return NextResponse.json(
      {
        configured: true,
        waiting: false,
        sourceUrl,
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

async function renderLiveTimeSource(sourceUrl: string): Promise<HeatInput | null> {
  if (!sourceUrl.includes("livetime.azurewebsites.net")) {
    return null;
  }

  if (renderedCache && renderedCache.sourceUrl === sourceUrl && renderedCache.expiresAt > Date.now()) {
    return renderedCache.heat;
  }

  const [{ default: puppeteer }, { default: chromium }] = await Promise.all([
    import("puppeteer-core"),
    import("@sparticuz/chromium"),
  ]);
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

  try {
    chromium.setGraphicsMode = false;
    const chromiumArgs = await chromium.args;
    browser = await puppeteer.launch({
      args: chromiumArgs,
      defaultViewport: {
        deviceScaleFactor: 1,
        hasTouch: false,
        height: 1080,
        isLandscape: true,
        isMobile: false,
        width: 1440,
      },
      executablePath: await resolveChromiumExecutablePath(chromium),
      headless: "shell",
    });

    const page = await browser.newPage();
    page.setDefaultTimeout(22_000);
    await page.goto(sourceUrl, { waitUntil: "domcontentloaded", timeout: 15_000 });

    try {
      await page.waitForSelector(".table-livetime tbody tr, table tbody tr", { timeout: 22_000 });
    } catch {
      // The initial LiveTime page is still useful for normalization; if the table
      // has not been published yet, normalizeTimingResponse will return null.
    }

    const renderedHtml = await page.content();
    const heat = normalizeTimingResponse(renderedHtml);

    if (heat) {
      renderedCache = {
        sourceUrl,
        heat,
        syncedAt: new Date().toISOString(),
        expiresAt: Date.now() + renderedCacheTtlMs,
      };
    }

    return heat;
  } catch (error) {
    lastRenderIssue = error instanceof Error ? error.message : "erro desconhecido";
    console.error("LiveTime render failed", error);
    return null;
  } finally {
    await browser?.close();
  }
}

async function resolveChromiumExecutablePath(chromium: typeof import("@sparticuz/chromium").default): Promise<string> {
  if (process.env.CHROME_EXECUTABLE_PATH) {
    return process.env.CHROME_EXECUTABLE_PATH;
  }

  if (!process.env.VERCEL) {
    const fs = await import("node:fs/promises");
    const localCandidates = [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    ];

    for (const candidate of localCandidates) {
      try {
        await fs.access(candidate);
        return candidate;
      } catch {
        // Continue probing local browser paths.
      }
    }
  }

  return chromium.executablePath();
}

function joinKey(...parts: string[]): string {
  return parts.join("");
}

function normalizeAllowedSourceUrl(value: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    if (url.hostname !== "livetime.azurewebsites.net") {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}
