import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const pdfPath = path.join(process.cwd(), "public", "regulamentos", "calendario-legends-kart-series-2026.pdf");
  const pdf = await readFile(pdfPath);

  return new NextResponse(pdf, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Content-Disposition": 'inline; filename="calendario-legends-kart-series-2026.pdf"',
      "Content-Type": "application/pdf",
    },
  });
}
