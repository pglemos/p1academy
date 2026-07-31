import Image from "next/image";
import Link from "next/link";
import { Flag, Gauge, MapPin, Route, RotateCcw, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Motion";
import { mapUrl, trackAddress } from "@/data/site";
import { trackGuide, trackLayouts, trackLayoutStats } from "@/data/tracados";
import { getServiceSupabaseClient, hasServiceSupabaseEnv } from "@/lib/p1Supabase";

export const metadata = {
  title: "Traçados | P1 Academy",
};

export const dynamic = "force-dynamic";

type TrackRecord = {
  driverName: string;
  bestLap: string;
  heatTitle: string;
  heatDate: string;
};

type HeatResultRecordRow = {
  driver_name: string;
  raw_ms: number | null;
  official_ms: number | null;
  p1_heats:
    | {
        title: string;
        heat_date: string;
        track_layout: string | null;
      }
    | {
        title: string;
        heat_date: string;
        track_layout: string | null;
      }[]
    | null;
};

export default async function TracadosPage() {
  const featuredLayout = trackLayouts[0];
  const trackRecords = await getLegendsTrackRecords();
  const featuredRecord = trackRecords.get(recordKey(featuredLayout.title));

  return (
    <>
      <PageHero
        title="Traçados"
        text="Biblioteca dos traçados do Kartódromo Internacional de Betim. Consulte sentido, metragem, chicanes e referências para briefing."
        image="/images/wallpaper-kart-dawn.png"
      />

      <section className="section tight">
        <div className="container track-overview">
          <Reveal className="section-head">
            <MapPin size={30} color="var(--acid)" />
            <h2>Kartódromo Internacional de Betim</h2>
            <div className="accent-line" />
            <p>
              Sede oficial da Legends Kart Series, a pista em Betim permite alternar bases, sentidos e chicanes. A leitura do mapa antes da bateria ajuda o piloto a chegar com referências claras de freada, ápice e saída.
            </p>
            <p>
              Endereço: {trackAddress}. A confirmação de traçado, clima, briefing e janela de pista deve seguir sempre a comunicação da organização no dia da etapa.
            </p>
            <p className="track-record-note">
              Os records exibidos nesta página consideram somente tempos oficiais obtidos na Legends Kart Series a partir de 2026.
            </p>
            <div className="button-row">
              <a className="btn primary" href={mapUrl} target="_blank" rel="noreferrer">
                <MapPin size={18} /> Abrir mapa
              </a>
              <Link className="btn secondary" href="/contato">
                Falar com a organização
              </Link>
            </div>
          </Reveal>

          <Reveal className="track-feature-map">
            <div className="track-feature-media">
              <Image
                src={featuredLayout.image}
                alt={`Mapa do ${featuredLayout.title} no Kartódromo Internacional de Betim`}
                fill
                priority
                sizes="(max-width: 1120px) 100vw, 48vw"
              />
            </div>
            <div className="track-feature-caption">
              <span>Destaque da pista</span>
              <strong>{featuredLayout.title}</strong>
              <small>{featuredLayout.distance.toLocaleString("pt-BR")} m</small>
              <TrackRecordBlock record={featuredRecord} compact />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section carbon-section">
        <div className="container">
          <Reveal className="section-head center">
            <Route size={30} color="var(--acid)" />
            <h2>Leitura rápida dos traçados</h2>
            <div className="accent-line" />
            <p>Use a galeria para comparar sentido, distância e presença de chicane antes de definir estratégia de volta lançada, ultrapassagem e gestão de tráfego.</p>
          </Reveal>

          <div className="track-stats">
            {trackLayoutStats.map((stat) => (
              <Reveal className="track-stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </Reveal>
            ))}
          </div>

          <div className="track-guide-grid">
            {trackGuide.map((item, index) => {
              const icons = [Flag, RotateCcw, ShieldCheck, Gauge];
              const Icon = icons[index];
              return (
                <Reveal className="track-guide-card" key={item.title}>
                  <Icon size={24} color="var(--acid)" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" id="galeria-tracados">
        <div className="container">
          <Reveal className="section-head">
            <Flag size={30} color="var(--acid)" />
            <h2>Galeria completa</h2>
            <div className="accent-line" />
            <p>Todos os mapas recebidos foram adicionados ao site com nome, variação, metragem e record Legends 2026 quando já houver tempo oficial publicado naquele traçado.</p>
          </Reveal>

          <div className="track-layout-grid">
            {trackLayouts.map((layout) => (
              <Reveal className="track-card" key={layout.id}>
                <a href={layout.image} target="_blank" rel="noreferrer" aria-label={`Abrir mapa do ${layout.title}`}>
                  <span className="track-card-media">
                    <Image
                      src={layout.image}
                      alt={`Mapa do ${layout.title} no Kartódromo Internacional de Betim`}
                      fill
                      sizes="(max-width: 720px) 100vw, (max-width: 1120px) 50vw, 33vw"
                    />
                  </span>
                  <span className="track-card-meta">
                    <span>Traçado {layout.number}</span>
                    <strong>{layout.variant}</strong>
                    <small>{layout.distance.toLocaleString("pt-BR")} m</small>
                    <TrackRecordBlock record={trackRecords.get(recordKey(layout.title))} />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function TrackRecordBlock({ record, compact = false }: { record?: TrackRecord; compact?: boolean }) {
  if (!record) {
    return (
      <span className={compact ? "track-record compact empty" : "track-record empty"}>
        <span>Record Legends 2026</span>
        <strong>Sem marca oficial</strong>
        <small>Aguardando tempo da Legends neste traçado.</small>
      </span>
    );
  }

  return (
    <span className={compact ? "track-record compact" : "track-record"}>
      <span>Record Legends 2026</span>
      <strong>{record.bestLap}</strong>
      <small>
        {record.driverName} · {record.heatTitle} · {formatDate(record.heatDate)}
      </small>
    </span>
  );
}

async function getLegendsTrackRecords(): Promise<Map<string, TrackRecord>> {
  if (!hasServiceSupabaseEnv()) {
    return new Map();
  }

  try {
    const supabase = getServiceSupabaseClient();
    const { data, error } = await supabase
      .from("p1_heat_results")
      .select("driver_name, raw_ms, official_ms, p1_heats!inner(title, heat_date, track_layout, is_published, p1_championships!inner(slug))")
      .eq("status", "ok")
      .eq("p1_heats.is_published", true)
      .eq("p1_heats.p1_championships.slug", "legends-2026")
      .gte("p1_heats.heat_date", "2026-01-01")
      .returns<HeatResultRecordRow[]>();

    if (error || !data) {
      return new Map();
    }

    const records = new Map<string, TrackRecord & { ms: number }>();

    data.forEach((row) => {
      const heat = Array.isArray(row.p1_heats) ? row.p1_heats[0] : row.p1_heats;
      const lapMs = row.official_ms ?? row.raw_ms;
      if (!heat?.track_layout || lapMs === null) return;

      const key = recordKey(heat.track_layout);
      const existing = records.get(key);
      if (existing && existing.ms <= lapMs) return;

      records.set(key, {
        ms: lapMs,
        driverName: row.driver_name,
        bestLap: formatLap(lapMs),
        heatTitle: heat.title,
        heatDate: heat.heat_date,
      });
    });

    return new Map(Array.from(records.entries()).map(([key, record]) => [key, record]));
  } catch {
    return new Map();
  }
}

function recordKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/tracado\s*(\d+)/, "tracado-$1")
    .replace(/\s+normal\b/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "");
}

function formatLap(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;
  return `${minutes}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(3, "0")}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}
