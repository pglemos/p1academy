"use client";

import { useEffect, useMemo, useState } from "react";
import { Clipboard, Copy, FileDown, Plus, Radio, RefreshCw, RotateCcw, Share2, Timer, Trash2 } from "lucide-react";
import {
  calculateHeatResults,
  formatScore,
  formatTimingValue,
  type DriverStatus,
  type HeatDriverInput,
  type HeatInput,
  type HeatType,
} from "@/lib/legendsScoring";

const STORAGE_KEY = "p1-legends-scoring-heat";
type SourceMode = "live" | "manual";
type LiveStatus = {
  kind: "idle" | "ok" | "warn" | "error";
  text: string;
};
type LegendsScoringAppProps = {
  initialHeat?: HeatInput | null;
  initialMessage?: string;
};

const emptyDrivers: HeatDriverInput[] = [
  { id: "driver-1", name: "", kart: "", bestTime: "", status: "ok", order: 1 },
  { id: "driver-2", name: "", kart: "", bestTime: "", status: "ok", order: 2 },
  { id: "driver-3", name: "", kart: "", bestTime: "", status: "ok", order: 3 },
  { id: "driver-4", name: "", kart: "", bestTime: "", status: "ok", order: 4 },
];

const sampleHeat: HeatInput = {
  id: "legends-bateria-exemplo",
  title: "Bateria exemplo",
  date: "2026-06-01",
  type: "regular",
  drivers: [
    { id: "andre", name: "Piloto 01", kart: "31", bestTime: "1:05.500", status: "ok", order: 1 },
    { id: "bruno", name: "Piloto 02", kart: "12", bestTime: "1:06.000", status: "ok", order: 2 },
    { id: "caio", name: "Piloto 03", kart: "08", bestTime: "1:06.000", status: "ok", order: 3 },
    { id: "daniel", name: "Piloto 04", kart: "22", bestTime: "1:14.650", status: "ok", order: 4 },
  ],
};

export function LegendsScoringApp({ initialHeat = null, initialMessage = "" }: LegendsScoringAppProps) {
  const [heat, setHeat] = useState<HeatInput>(() => initialHeat ? normalizeHeat(initialHeat) : createEmptyHeat());
  const [message, setMessage] = useState(initialMessage);
  const [sourceMode, setSourceMode] = useState<SourceMode>(initialHeat ? "manual" : "live");
  const [liveStatus, setLiveStatus] = useState<LiveStatus>({
    kind: initialHeat ? "ok" : "idle",
    text: initialHeat ? "Snapshot publico carregado." : "Aguardando cronometragem ao vivo.",
  });
  const [lastSync, setLastSync] = useState("");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(heat));
  }, [heat]);

  useEffect(() => {
    if (sourceMode !== "live") {
      return;
    }

    let cancelled = false;
    let inFlight = false;

    async function run() {
      if (inFlight) {
        return;
      }

      inFlight = true;
      const status = await syncLiveHeat();
      inFlight = false;

      if (cancelled) {
        return;
      }

      setLiveStatus(status.status);
      if (status.heat) {
        setHeat(status.heat);
        setLastSync(status.syncedAt || new Date().toLocaleTimeString("pt-BR"));
      }
    }

    run();
    const interval = window.setInterval(run, 10_000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [sourceMode]);

  const results = useMemo(() => calculateHeatResults(heat), [heat]);
  const validResults = results.filter((result) => result.status === "ok");
  const winner = validResults[0];
  const encodedHeat = useMemo(() => encodeHeat(heat), [heat]);
  const sharePath = useMemo(() => buildSharePath(encodedHeat), [encodedHeat]);
  const pdfPath = useMemo(() => buildPdfPath(encodedHeat), [encodedHeat]);
  const fieldsDisabled = sourceMode === "live";

  function updateDriver(id: string, field: keyof HeatDriverInput, value: string) {
    setHeat((current) => ({
      ...current,
      drivers: current.drivers.map((driver) => (
        driver.id === id
          ? { ...driver, [field]: field === "status" ? value as DriverStatus : value }
          : driver
      )),
    }));
  }

  async function syncNow() {
    setLiveStatus({ kind: "idle", text: "Sincronizando com a cronometragem..." });
    const status = await syncLiveHeat();
    setLiveStatus(status.status);
    if (status.heat) {
      setHeat(status.heat);
      setLastSync(status.syncedAt || new Date().toLocaleTimeString("pt-BR"));
    }
  }

  function addDriver() {
    setHeat((current) => {
      const nextOrder = current.drivers.length + 1;
      return {
        ...current,
        drivers: [
          ...current.drivers,
          { id: `driver-${Date.now()}-${nextOrder}`, name: "", kart: "", bestTime: "", status: "ok", order: nextOrder },
        ],
      };
    });
  }

  function removeDriver(id: string) {
    setHeat((current) => ({
      ...current,
      drivers: current.drivers
        .filter((driver) => driver.id !== id)
        .map((driver, index) => ({ ...driver, order: index + 1 })),
    }));
  }

  async function copyShareUrl() {
    const fullUrl = typeof window === "undefined" ? sharePath : new URL(sharePath, window.location.origin).href;
    await copyText(fullUrl);
    setMessage("Link público da bateria copiado.");
  }

  async function copyResults() {
    const text = [
      `${heat.title} - ${heat.type === "super-final" ? "Super Final" : "Bateria regular"}`,
      heat.date ? `Data: ${heat.date}` : "",
      "",
      ...results.map((result) => (
        `${result.position ? `${result.position}º` : "-"} | ${result.name} | Kart ${result.kart || "-"} | ${formatTimingValue(result.officialMs)} | ${formatScore(result.score)} pts${result.note ? ` | ${result.note}` : ""}`
      )),
    ].filter(Boolean).join("\n");

    await copyText(text);
    setMessage("Resultado em texto copiado.");
  }

  return (
    <div className="scoring-app">
      <div className="scoring-board">
        <section className="scoring-panel scoring-control" aria-label="Lançamento da bateria">
          <div className="scoring-panel-head">
            <Timer size={24} />
            <div>
              <span className="eyebrow">Race control</span>
              <h2>Lançar bateria</h2>
            </div>
          </div>

          <div className={`live-status live-status-${liveStatus.kind}`}>
            <Radio size={20} />
            <div>
              <strong>{sourceMode === "live" ? "Cronometragem autônoma" : "Fallback operacional"}</strong>
              <span>{liveStatus.text}{lastSync ? ` Última leitura: ${lastSync}.` : ""}</span>
            </div>
            <button className="btn ghost" type="button" onClick={syncNow} disabled={sourceMode !== "live"}>
              <RefreshCw size={18} /> Sincronizar
            </button>
            <button
              className="btn secondary"
              type="button"
              onClick={() => setSourceMode((current) => current === "live" ? "manual" : "live")}
            >
              {sourceMode === "live" ? "Ativar fallback manual" : "Voltar ao vivo"}
            </button>
          </div>

          <div className="scoring-meta-grid">
            <label className="field">
              <span>Nome da bateria</span>
              <input
                value={heat.title}
                onChange={(event) => setHeat((current) => ({ ...current, title: event.target.value }))}
                placeholder="Bateria 01"
                disabled={fieldsDisabled}
              />
            </label>
            <label className="field">
              <span>Data</span>
              <input
                type="date"
                value={heat.date}
                onChange={(event) => setHeat((current) => ({ ...current, date: event.target.value }))}
                disabled={fieldsDisabled}
              />
            </label>
            <label className="field">
              <span>Tipo</span>
              <select
                value={heat.type}
                onChange={(event) => setHeat((current) => ({ ...current, type: event.target.value as HeatType }))}
                disabled={fieldsDisabled}
              >
                <option value="regular">Bateria regular - 10,000 pts</option>
                <option value="super-final">Super Final - 5,000 pts</option>
              </select>
            </label>
          </div>

          <div className="driver-input-list">
            <div className="driver-input-header">
              <span>Piloto</span>
              <span>Kart</span>
              <span>Melhor volta</span>
              <span>Status</span>
              <span />
            </div>
            {heat.drivers.map((driver) => (
              <div className="driver-input-row" key={driver.id}>
                <input
                  value={driver.name}
                  onChange={(event) => updateDriver(driver.id, "name", event.target.value)}
                  placeholder={`Piloto ${driver.order}`}
                  disabled={fieldsDisabled}
                />
                <input
                  value={driver.kart}
                  onChange={(event) => updateDriver(driver.id, "kart", event.target.value)}
                  placeholder="31"
                  disabled={fieldsDisabled}
                />
                <input
                  value={driver.bestTime}
                  onChange={(event) => updateDriver(driver.id, "bestTime", event.target.value)}
                  placeholder="1:05.500"
                  disabled={fieldsDisabled}
                />
                <select
                  value={driver.status}
                  onChange={(event) => updateDriver(driver.id, "status", event.target.value)}
                  disabled={fieldsDisabled}
                >
                  <option value="ok">Tempo válido</option>
                  <option value="no-time">Sem tempo</option>
                  <option value="dsq">DSQ</option>
                </select>
                <button
                  aria-label={`Remover ${driver.name || `piloto ${driver.order}`}`}
                  className="icon-button"
                  type="button"
                  onClick={() => removeDriver(driver.id)}
                  disabled={fieldsDisabled || heat.drivers.length <= 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="scoring-toolbar">
            <button className="btn secondary" type="button" onClick={addDriver} disabled={fieldsDisabled}>
              <Plus size={18} /> Adicionar piloto
            </button>
            <button className="btn ghost" type="button" onClick={() => setHeat(sampleHeat)} disabled={fieldsDisabled}>
              <Clipboard size={18} /> Carregar exemplo
            </button>
            <button className="btn ghost" type="button" onClick={() => setHeat({ ...heat, drivers: emptyDrivers })} disabled={fieldsDisabled}>
              <RotateCcw size={18} /> Limpar pilotos
            </button>
          </div>
        </section>

        <aside className="scoring-panel scoring-summary" aria-label="Resumo da bateria">
          <span className="eyebrow">Resultado ao vivo</span>
          <h2>{winner ? winner.name : "Aguardando tempos"}</h2>
          <div className="scoring-podium">
            <div>
              <span>Melhor volta</span>
              <strong>{formatTimingValue(winner?.officialMs ?? null)}</strong>
            </div>
            <div>
              <span>Pontuação do vencedor</span>
              <strong>{heat.type === "super-final" ? "5,000" : "10,000"}</strong>
            </div>
            <div>
              <span>Base do cálculo</span>
              <strong>{heat.type === "super-final" ? "Super Final" : "Regular"}</strong>
            </div>
          </div>
          <p>
            A pontuação é calculada pela diferença para o melhor tempo: base menos gap em segundos. Diferenças acima de 9 segundos recebem 1,000 ponto.
          </p>
          <div className="share-box">
            <span>Endereço público da bateria</span>
            <input readOnly value={sharePath} aria-label="Link público do resultado" />
            <button className="btn primary" type="button" onClick={copyShareUrl}>
              <Share2 size={18} /> Copiar link
            </button>
            <button className="btn secondary" type="button" onClick={copyResults}>
              <Copy size={18} /> Copiar resultado
            </button>
            <a className="btn secondary" href={pdfPath} target="_blank" rel="noreferrer">
              <FileDown size={18} /> Baixar PDF
            </a>
          </div>
          {message ? <p className="success">{message}</p> : null}
        </aside>
      </div>

      <section className="scoring-panel scoring-results" aria-label="Resultado calculado">
        <div className="scoring-panel-head">
          <Timer size={24} />
          <div>
            <span className="eyebrow">Tabela oficial</span>
            <h2>Resultado calculado</h2>
          </div>
        </div>

        <div className="score-table">
          <div className="score-row score-row-head">
            <span>Pos</span>
            <span>Piloto</span>
            <span>Kart</span>
            <span>Tempo oficial</span>
            <span>Diferença</span>
            <span>Pontos</span>
            <span>Voltas</span>
            <span>VM</span>
            <span>2ª melhor</span>
            <span>UF</span>
            <span>Observação</span>
          </div>
          {results.length ? results.map((result) => (
            <div className="score-row" key={result.id}>
              <span>{result.position ? `${result.position}º` : "-"}</span>
              <strong>{result.name}</strong>
              <span>{result.kart || "-"}</span>
              <span>{formatTimingValue(result.officialMs)}</span>
              <span>{result.gapMs === null ? "-" : `+${(result.gapMs / 1000).toFixed(3)}s`}</span>
              <span className={result.position === 1 ? "score-pill win" : "score-pill"}>{formatScore(result.score)}</span>
              <span>{result.totalLaps || "-"}</span>
              <span>{result.averageSpeedKmh || "-"}</span>
              <span>{result.secondBestTime || "-"}</span>
              <span>{result.federation || "-"}</span>
              <span className="score-note">{result.note || "Tempo válido"}</span>
            </div>
          )) : (
            <div className="score-empty">Insira pelo menos um piloto com tempo válido para gerar a tabela.</div>
          )}
        </div>
      </section>
    </div>
  );
}

function normalizeHeat(value: HeatInput): HeatInput {
  return {
    id: value.id || "legends-loaded",
    title: value.title || "Bateria Legends",
    date: value.date || "",
    type: value.type === "super-final" ? "super-final" : "regular",
    generatedAt: value.generatedAt || "",
    source: value.source || "snapshot",
    trackLayout: value.trackLayout || "",
    category: value.category || "",
    drivers: Array.isArray(value.drivers) && value.drivers.length
      ? value.drivers.map((driver, index) => {
        const record = driver as HeatDriverInput & Record<string, string | number | null | undefined>;

        return {
          id: driver.id || `driver-${index + 1}`,
          name: driver.name || "",
          kart: driver.kart || "",
          bestTime: driver.bestTime || readDriverString(record, joinKey("lap", "Time")),
          status: driver.status || "ok",
          order: index + 1,
          sourcePosition: driver.sourcePosition ?? null,
          bestLapNumber: driver.bestLapNumber || "",
          totalLaps: driver.totalLaps || "",
          averageSpeedKmh: driver.averageSpeedKmh || "",
          secondBestLapNumber: driver.secondBestLapNumber || "",
          secondBestTime: driver.secondBestTime || readDriverString(record, joinKey("secondBest", "Lap", "Time")),
          federation: driver.federation || "",
          gapToLeader: driver.gapToLeader || "",
          gapToPrevious: driver.gapToPrevious || "",
        };
      })
      : emptyDrivers,
  };
}

function readDriverString(driver: Record<string, string | number | null | undefined>, key: string): string {
  const value = driver[key];
  return typeof value === "string" ? value : "";
}

function joinKey(...parts: string[]): string {
  return parts.join("");
}

function createEmptyHeat(): HeatInput {
  return {
    id: "legends-bateria",
    title: "Bateria 01",
    date: "",
    type: "regular",
    source: "manual",
    drivers: emptyDrivers,
  };
}

function buildSharePath(encodedHeat: string): string {
  return `/competicoes/pontuacao?data=${encodedHeat}`;
}

function buildPdfPath(encodedHeat: string): string {
  return `/api/competicoes/legends/pdf?data=${encodedHeat}`;
}

function encodeHeat(heat: HeatInput): string {
  const bytes = new TextEncoder().encode(JSON.stringify(heat));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return encodeURIComponent(btoa(binary));
}

async function syncLiveHeat(): Promise<{ heat: HeatInput | null; syncedAt?: string; status: LiveStatus }> {
  try {
    const response = await fetch("/api/competicoes/legends/live", { cache: "no-store" });
    const payload = await response.json() as {
      heat?: HeatInput;
      syncedAt?: string;
      message?: string;
      configured?: boolean;
    };

    if (!response.ok || !payload.heat) {
      return {
        heat: null,
        status: {
          kind: payload.configured ? "warn" : "idle",
          text: payload.message || "Cronometragem ao vivo ainda sem dados.",
        },
      };
    }

    return {
      heat: normalizeHeat(payload.heat),
      syncedAt: payload.syncedAt ? new Date(payload.syncedAt).toLocaleTimeString("pt-BR") : undefined,
      status: { kind: "ok", text: "Dados recebidos da cronometragem em tempo real." },
    };
  } catch {
    return {
      heat: null,
      status: { kind: "error", text: "Falha ao conectar na cronometragem ao vivo." },
    };
  }
}

async function copyText(text: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
