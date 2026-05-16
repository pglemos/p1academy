"use client";

import { useEffect, useMemo, useState } from "react";
import { Clipboard, Copy, Plus, RotateCcw, Share2, Timer, Trash2 } from "lucide-react";
import {
  calculateHeatResults,
  formatLapTime,
  formatScore,
  type DriverStatus,
  type HeatDriverInput,
  type HeatInput,
type HeatType,
} from "@/lib/legendsScoring";

const STORAGE_KEY = "p1-legends-scoring-heat";
type LegendsScoringAppProps = {
  initialHeat?: HeatInput | null;
  initialMessage?: string;
};

const emptyDrivers: HeatDriverInput[] = [
  { id: "driver-1", name: "", kart: "", lapTime: "", status: "ok", order: 1 },
  { id: "driver-2", name: "", kart: "", lapTime: "", status: "ok", order: 2 },
  { id: "driver-3", name: "", kart: "", lapTime: "", status: "ok", order: 3 },
  { id: "driver-4", name: "", kart: "", lapTime: "", status: "ok", order: 4 },
];

const sampleHeat: HeatInput = {
  id: "legends-bateria-exemplo",
  title: "Bateria exemplo",
  date: "2026-06-01",
  type: "regular",
  drivers: [
    { id: "andre", name: "Piloto 01", kart: "31", lapTime: "1:05.500", status: "ok", order: 1 },
    { id: "bruno", name: "Piloto 02", kart: "12", lapTime: "1:06.000", status: "ok", order: 2 },
    { id: "caio", name: "Piloto 03", kart: "08", lapTime: "1:06.000", status: "ok", order: 3 },
    { id: "daniel", name: "Piloto 04", kart: "22", lapTime: "1:14.650", status: "ok", order: 4 },
  ],
};

export function LegendsScoringApp({ initialHeat = null, initialMessage = "" }: LegendsScoringAppProps) {
  const [heat, setHeat] = useState<HeatInput>(() => initialHeat ? normalizeHeat(initialHeat) : createEmptyHeat());
  const [message, setMessage] = useState(initialMessage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(heat));
  }, [heat]);

  const results = useMemo(() => calculateHeatResults(heat), [heat]);
  const validResults = results.filter((result) => result.status === "ok");
  const winner = validResults[0];
  const sharePath = useMemo(() => buildSharePath(heat), [heat]);

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

  function addDriver() {
    setHeat((current) => {
      const nextOrder = current.drivers.length + 1;
      return {
        ...current,
        drivers: [
          ...current.drivers,
          { id: `driver-${Date.now()}-${nextOrder}`, name: "", kart: "", lapTime: "", status: "ok", order: nextOrder },
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
        `${result.position ? `${result.position}º` : "-"} | ${result.name} | Kart ${result.kart || "-"} | ${formatLapTime(result.officialMs)} | ${formatScore(result.score)} pts${result.note ? ` | ${result.note}` : ""}`
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

          <div className="scoring-meta-grid">
            <label className="field">
              <span>Nome da bateria</span>
              <input
                value={heat.title}
                onChange={(event) => setHeat((current) => ({ ...current, title: event.target.value }))}
                placeholder="Bateria 01"
              />
            </label>
            <label className="field">
              <span>Data</span>
              <input
                type="date"
                value={heat.date}
                onChange={(event) => setHeat((current) => ({ ...current, date: event.target.value }))}
              />
            </label>
            <label className="field">
              <span>Tipo</span>
              <select
                value={heat.type}
                onChange={(event) => setHeat((current) => ({ ...current, type: event.target.value as HeatType }))}
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
                />
                <input
                  value={driver.kart}
                  onChange={(event) => updateDriver(driver.id, "kart", event.target.value)}
                  placeholder="31"
                />
                <input
                  value={driver.lapTime}
                  onChange={(event) => updateDriver(driver.id, "lapTime", event.target.value)}
                  placeholder="1:05.500"
                />
                <select
                  value={driver.status}
                  onChange={(event) => updateDriver(driver.id, "status", event.target.value)}
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
                  disabled={heat.drivers.length <= 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="scoring-toolbar">
            <button className="btn secondary" type="button" onClick={addDriver}>
              <Plus size={18} /> Adicionar piloto
            </button>
            <button className="btn ghost" type="button" onClick={() => setHeat(sampleHeat)}>
              <Clipboard size={18} /> Carregar exemplo
            </button>
            <button className="btn ghost" type="button" onClick={() => setHeat({ ...heat, drivers: emptyDrivers })}>
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
              <strong>{formatLapTime(winner?.officialMs ?? null)}</strong>
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
            <span>Observação</span>
          </div>
          {results.length ? results.map((result) => (
            <div className="score-row" key={result.id}>
              <span>{result.position ? `${result.position}º` : "-"}</span>
              <strong>{result.name}</strong>
              <span>{result.kart || "-"}</span>
              <span>{formatLapTime(result.officialMs)}</span>
              <span>{result.gapMs === null ? "-" : `+${(result.gapMs / 1000).toFixed(3)}s`}</span>
              <span className={result.position === 1 ? "score-pill win" : "score-pill"}>{formatScore(result.score)}</span>
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
    drivers: Array.isArray(value.drivers) && value.drivers.length
      ? value.drivers.map((driver, index) => ({
        id: driver.id || `driver-${index + 1}`,
        name: driver.name || "",
        kart: driver.kart || "",
        lapTime: driver.lapTime || "",
        status: driver.status || "ok",
        order: index + 1,
      }))
      : emptyDrivers,
  };
}

function createEmptyHeat(): HeatInput {
  return {
    id: "legends-bateria",
    title: "Bateria 01",
    date: "",
    type: "regular",
    drivers: emptyDrivers,
  };
}

function buildSharePath(heat: HeatInput): string {
  const payload = encodeHeat(heat);
  return `/competicoes/pontuacao?data=${payload}`;
}

function encodeHeat(heat: HeatInput): string {
  const bytes = new TextEncoder().encode(JSON.stringify(heat));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return encodeURIComponent(btoa(binary));
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
