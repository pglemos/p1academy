"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Clock, Flag, LogOut, RefreshCw, ShieldCheck, UserPlus, X } from "lucide-react";
import { getBrowserSupabaseClient } from "@/lib/p1BrowserSupabase";

type RegistrationRow = {
  id: string;
  protocol: string;
  full_name: string;
  email: string;
  whatsapp: string;
  city: string;
  current_level: string | null;
  preferred_race_windows: string | null;
  status: string;
  created_at: string;
};

type DriverRow = {
  id: string;
  display_name: string;
  email: string | null;
  whatsapp: string | null;
  city: string | null;
  current_level: string | null;
  status: string;
};

type StageRow = {
  id: string;
  stage_code: string;
  title: string;
  scheduled_date: string;
  scheduled_time: string;
  weekday: string;
  status: string;
  max_seats: number;
};

type HeatRow = {
  id: string;
  title: string;
  heat_date: string;
  type: string;
  source: string;
  is_published: boolean;
};

type StandingRow = {
  position: number;
  driver_name: string;
  total: number | string;
  regular_total: number | string;
  super_final_total: number | string;
  valid_regular_results: number;
  wins: number;
};

type Overview = {
  admin: { email: string };
  championship: { name: string; season: string };
  registrations: RegistrationRow[];
  drivers: DriverRow[];
  stages: StageRow[];
  heats: HeatRow[];
  standings: StandingRow[];
};

type SessionState = "loading" | "signed-out" | "ready";

export function AdminDashboard() {
  const [sessionState, setSessionState] = useState<SessionState>("loading");
  const [accessToken, setAccessToken] = useState("");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  const [bootstrapToken, setBootstrapToken] = useState("");
  const [loading, setLoading] = useState(false);

  const pendingRegistrations = useMemo(
    () => overview?.registrations.filter((registration) => registration.status === "pending").length ?? 0,
    [overview],
  );

  const loadOverview = useCallback(async (token = accessToken) => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/overview", {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setOverview(null);
        setError(typeof payload.message === "string" ? payload.message : "Acesso administrativo indisponivel.");
        return;
      }

      setOverview(payload);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    async function loadSession() {
      const supabase = getBrowserSupabaseClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        setSessionState("signed-out");
        return;
      }

      setAccessToken(token);
      setSessionState("ready");
      await loadOverview(token);
    }

    loadSession().catch(() => {
      setError("Nao foi possivel carregar a sessao administrativa.");
      setSessionState("signed-out");
    });
  }, [loadOverview]);

  async function updateRegistration(id: string, status: string) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(typeof payload.message === "string" ? payload.message : "Nao foi possivel atualizar a inscricao.");
        return;
      }

      await loadOverview();
    } finally {
      setLoading(false);
    }
  }

  async function bootstrapAdmin() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/bootstrap", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: bootstrapToken }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(typeof payload.message === "string" ? payload.message : "Nao foi possivel criar o admin inicial.");
        return;
      }

      setBootstrapToken("");
      await loadOverview();
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    const supabase = getBrowserSupabaseClient();
    await supabase.auth.signOut();
    window.location.assign("/admin/login");
  }

  if (sessionState === "loading") {
    return <div className="admin-panel">Carregando painel...</div>;
  }

  if (sessionState === "signed-out") {
    return (
      <div className="admin-panel">
        <h2>Login necessario</h2>
        <p>Entre com uma conta autorizada no Supabase Auth para acessar a operacao.</p>
        <a className="btn primary" href="/admin/login">Entrar no admin</a>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <div className="admin-toolbar">
        <div>
          <span className="eyebrow">Race control</span>
          <h2>{overview?.championship.name ?? "Legends Kart Series"} {overview?.championship.season ?? ""}</h2>
          <p>{overview ? `${pendingRegistrations} inscricoes pendentes, ${overview.drivers.length} pilotos ativos e ${overview.heats.length} baterias publicadas.` : "Aguardando autorizacao administrativa."}</p>
        </div>
        <div className="button-row">
          <button className="btn secondary" type="button" onClick={() => loadOverview()} disabled={loading}>
            <RefreshCw size={18} /> Atualizar
          </button>
          <button className="btn ghost" type="button" onClick={signOut}>
            <LogOut size={18} /> Sair
          </button>
        </div>
      </div>

      {error ? (
        <div className="admin-panel admin-warning">
          <ShieldCheck size={22} />
          <div>
            <strong>{error}</strong>
            <p>Se este for o primeiro acesso, informe o token temporario de bootstrap configurado na Vercel.</p>
            <div className="admin-inline-form">
              <input value={bootstrapToken} onChange={(event) => setBootstrapToken(event.target.value)} placeholder="P1_BOOTSTRAP_TOKEN" type="password" />
              <button className="btn primary" type="button" onClick={bootstrapAdmin} disabled={loading || !bootstrapToken}>
                <UserPlus size={18} /> Criar primeiro admin
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {overview ? (
        <>
          <section className="admin-grid">
            <Metric title="Inscricoes" value={overview.registrations.length} />
            <Metric title="Pendentes" value={pendingRegistrations} />
            <Metric title="Pilotos" value={overview.drivers.length} />
            <Metric title="Etapas" value={overview.stages.length} />
          </section>

          <section className="admin-panel">
            <div className="admin-panel-head">
              <h3>Inscricoes</h3>
              <span>{overview.registrations.length} registros</span>
            </div>
            <div className="admin-table">
              {overview.registrations.map((registration) => (
                <div className="admin-row" key={registration.id}>
                  <strong>{registration.full_name}</strong>
                  <span>{registration.protocol}</span>
                  <span>{registration.whatsapp}</span>
                  <span>{registration.preferred_race_windows ?? "Sem preferencia"}</span>
                  <StatusBadge status={registration.status} />
                  <div className="admin-actions">
                    <button type="button" onClick={() => updateRegistration(registration.id, "approved")} title="Aprovar">
                      <Check size={16} />
                    </button>
                    <button type="button" onClick={() => updateRegistration(registration.id, "waitlist")} title="Lista de espera">
                      <Clock size={16} />
                    </button>
                    <button type="button" onClick={() => updateRegistration(registration.id, "rejected")} title="Rejeitar">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {overview.registrations.length === 0 ? <p className="muted">Nenhuma inscricao registrada ainda.</p> : null}
            </div>
          </section>

          <section className="admin-grid admin-grid-wide">
            <div className="admin-panel">
              <div className="admin-panel-head">
                <h3>Ranking</h3>
                <span>{overview.standings.length} pilotos pontuados</span>
              </div>
              <div className="admin-table">
                {overview.standings.map((row) => (
                  <div className="admin-row compact" key={`${row.position}-${row.driver_name}`}>
                    <strong>{String(row.position).padStart(2, "0")} {row.driver_name}</strong>
                    <span>{Number(row.total).toLocaleString("pt-BR", { minimumFractionDigits: 3 })} pts</span>
                    <span>{row.valid_regular_results}/10</span>
                    <span>{row.wins} vit.</span>
                  </div>
                ))}
                {overview.standings.length === 0 ? <p className="muted">Ranking sera montado apos publicacao das baterias.</p> : null}
              </div>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-head">
                <h3>Proximas etapas</h3>
                <span>{overview.stages.length} janelas</span>
              </div>
              <div className="admin-table">
                {overview.stages.slice(0, 12).map((stage) => (
                  <div className="admin-row compact" key={stage.id}>
                    <strong><Flag size={14} /> {stage.stage_code}</strong>
                    <span>{formatDate(stage.scheduled_date)}</span>
                    <span>{stage.scheduled_time.slice(0, 5)}</span>
                    <StatusBadge status={stage.status} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-head">
              <h3>Baterias publicadas</h3>
              <span>{overview.heats.length} resultados</span>
            </div>
            <div className="admin-table">
              {overview.heats.map((heat) => (
                <div className="admin-row compact" key={heat.id}>
                  <strong>{heat.title}</strong>
                  <span>{formatDate(heat.heat_date)}</span>
                  <span>{heat.type === "super_final" ? "Super Final" : "Regular"}</span>
                  <span>{heat.source}</span>
                </div>
              ))}
              {overview.heats.length === 0 ? <p className="muted">Nenhuma bateria publicada ainda. Use o sistema de pontuacao para salvar uma bateria.</p> : null}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <div className="metric-card">
      <strong>{value}</strong>
      <span>{title}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`admin-status admin-status-${status}`}>{status}</span>;
}

function formatDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-");
  return day && month && year ? `${day}/${month}/${year}` : value;
}
