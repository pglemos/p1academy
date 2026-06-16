"use client";

import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Download,
  Eye,
  FileText,
  Filter,
  Flag,
  Home,
  LogOut,
  Mail,
  Medal,
  MessageCircle,
  MoreVertical,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Timer,
  Trophy,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { getBrowserSupabaseClient } from "@/lib/p1BrowserSupabase";
import { Logo } from "./Logo";

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
  admin_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
  cpf?: string | null;
  birth_date?: string | null;
  age?: number | null;
  weight?: number | null;
  experience?: string | null;
  availability?: string | null;
  equipment?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  goals?: string | null;
  accepted_contact?: boolean | null;
  accepted_rules?: boolean | null;
  accepted_responsibility?: boolean | null;
  accepted_image?: boolean | null;
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
type AdminTab = "dashboard" | "inscricoes" | "pilotos" | "etapas" | "baterias" | "ranking" | "documentos" | "config";

const navItems: Array<{ id: AdminTab; label: string; icon: ReactNode }> = [
  { id: "dashboard", label: "Dashboard", icon: <Home size={19} /> },
  { id: "inscricoes", label: "Inscrições", icon: <ClipboardList size={19} /> },
  { id: "pilotos", label: "Pilotos", icon: <Users size={19} /> },
  { id: "etapas", label: "Etapas", icon: <CalendarDays size={19} /> },
  { id: "baterias", label: "Baterias", icon: <Flag size={19} /> },
  { id: "ranking", label: "Ranking", icon: <Trophy size={19} /> },
  { id: "documentos", label: "Documentos", icon: <FileText size={19} /> },
  { id: "config", label: "Sistema", icon: <Settings size={19} /> },
];

export function AdminDashboard() {
  const [sessionState, setSessionState] = useState<SessionState>("loading");
  const [accessToken, setAccessToken] = useState("");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  const [bootstrapToken, setBootstrapToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("inscricoes");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [selectedRegistrationId, setSelectedRegistrationId] = useState("");
  const [showManualForm, setShowManualForm] = useState(false);

  const statusCounts = useMemo(() => {
    const registrations = overview?.registrations ?? [];
    return {
      total: registrations.length,
      pending: registrations.filter((registration) => registration.status === "pending").length,
      approved: registrations.filter((registration) => registration.status === "approved").length,
      waitlist: registrations.filter((registration) => registration.status === "waitlist").length,
      rejected: registrations.filter((registration) => registration.status === "rejected").length,
    };
  }, [overview]);

  const nextStage = useMemo(
    () => overview?.stages.find((stage) => stage.status !== "completed" && stage.status !== "cancelled") ?? overview?.stages[0],
    [overview],
  );

  const stageOptions = useMemo(() => {
    const windows = new Set<string>();
    overview?.registrations.forEach((registration) => {
      if (registration.preferred_race_windows) {
        windows.add(registration.preferred_race_windows);
      }
    });
    return Array.from(windows).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [overview]);

  const filteredRegistrations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return (overview?.registrations ?? []).filter((registration) => {
      const matchesTerm = term
        ? [registration.full_name, registration.email, registration.whatsapp, registration.protocol, registration.city]
          .join(" ")
          .toLowerCase()
          .includes(term)
        : true;
      const matchesStatus = statusFilter === "all" || registration.status === statusFilter;
      const matchesStage = stageFilter === "all" || registration.preferred_race_windows === stageFilter;
      return matchesTerm && matchesStatus && matchesStage;
    });
  }, [overview, searchTerm, stageFilter, statusFilter]);

  const selectedRegistration = useMemo(() => {
    return filteredRegistrations.find((registration) => registration.id === selectedRegistrationId) ?? filteredRegistrations[0] ?? null;
  }, [filteredRegistrations, selectedRegistrationId]);

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
        setError(typeof payload.message === "string" ? payload.message : "Acesso administrativo indisponível.");
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
      setError("Não foi possível carregar a sessão administrativa.");
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
        setError(typeof payload.message === "string" ? payload.message : "Não foi possível atualizar a inscrição.");
        return;
      }

      await loadOverview();
    } finally {
      setLoading(false);
    }
  }

  async function saveRegistrationNote(id: string, adminNotes: string) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminNotes }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(typeof payload.message === "string" ? payload.message : "Não foi possível salvar a nota.");
        return;
      }

      await loadOverview();
    } finally {
      setLoading(false);
    }
  }

  async function createManualRegistration(formData: Record<string, string>) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/registrations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(typeof payload.message === "string" ? payload.message : "Não foi possível criar a inscrição.");
        return false;
      }

      setShowManualForm(false);
      await loadOverview();
      return true;
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
        setError(typeof payload.message === "string" ? payload.message : "Não foi possível criar o admin inicial.");
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

  function exportRegistrationsCsv() {
    const rows = filteredRegistrations.map((registration) => [
      registration.protocol,
      registration.full_name,
      registration.email,
      registration.whatsapp,
      registration.city,
      translateStatus(registration.status),
      registration.preferred_race_windows ?? "",
      formatDateTime(registration.created_at),
    ]);
    const csv = [["Protocolo", "Nome", "E-mail", "WhatsApp", "Cidade", "Status", "Janela", "Inscrição"], ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll("\"", "\"\"")}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "inscricoes-legends-2026.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (sessionState === "loading") {
    return <div className="admin-app-empty">Carregando operação Legends...</div>;
  }

  if (sessionState === "signed-out") {
    return (
      <div className="admin-app-empty">
        <span className="admin-eyebrow">Acesso restrito</span>
        <h2>Admin Legends bloqueado</h2>
        <p>Entre com uma conta autorizada para operar inscrições, pilotos, etapas, baterias e ranking.</p>
        <a className="admin-primary-action" href="/admin/login">Entrar no admin</a>
      </div>
    );
  }

  return (
    <div className={sidebarCollapsed ? "admin-app collapsed" : "admin-app"}>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <Logo />
          <strong>ADMIN</strong>
        </div>
        <nav className="admin-side-nav" aria-label="Admin Legends">
          {navItems.map((item) => (
            <button
              className={activeTab === item.id ? "active" : ""}
              key={item.id}
              type="button"
              title={item.label}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button
          className="admin-collapse"
          type="button"
          aria-pressed={sidebarCollapsed}
          title={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          onClick={() => setSidebarCollapsed((value) => !value)}
        >
          <ChevronDown size={18} /> <span>{sidebarCollapsed ? "Expandir" : "Recolher"}</span>
        </button>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <span className="admin-eyebrow">P1 Academy Legends Kart Series</span>
            <strong>{overview?.championship.name ?? "Legends Kart Series"} {overview?.championship.season ?? "2026"}</strong>
          </div>
          <div className="admin-account">
            <ShieldCheck size={22} />
            <div>
              <span>Admin P1</span>
              <strong>{overview?.admin.email ?? "Administrador"}</strong>
            </div>
            <button type="button" onClick={signOut} title="Sair">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {error ? (
          <div className="admin-system-alert">
            <ShieldCheck size={22} />
            <div>
              <strong>{error}</strong>
              <p>Se este for o primeiro acesso, use o token temporário configurado na Vercel.</p>
              <div className="admin-inline-form">
                <input value={bootstrapToken} onChange={(event) => setBootstrapToken(event.target.value)} placeholder="P1_BOOTSTRAP_TOKEN" type="password" />
                <button className="admin-primary-action compact" type="button" onClick={bootstrapAdmin} disabled={loading || !bootstrapToken}>
                  <UserPlus size={18} /> Criar primeiro admin
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {overview ? (
          <AdminModule
            activeTab={activeTab}
            createManualRegistration={createManualRegistration}
            exportRegistrationsCsv={exportRegistrationsCsv}
            filteredRegistrations={filteredRegistrations}
            loading={loading}
            nextStage={nextStage}
            overview={overview}
            searchTerm={searchTerm}
            selectedRegistration={selectedRegistration}
            setActiveTab={setActiveTab}
            setSearchTerm={setSearchTerm}
            setSelectedRegistrationId={setSelectedRegistrationId}
            setStageFilter={setStageFilter}
            setStatusFilter={setStatusFilter}
            showManualForm={showManualForm}
            setShowManualForm={setShowManualForm}
            stageFilter={stageFilter}
            stageOptions={stageOptions}
            statusCounts={statusCounts}
            statusFilter={statusFilter}
            updateRegistration={updateRegistration}
            saveRegistrationNote={saveRegistrationNote}
          />
        ) : null}
      </section>
    </div>
  );
}

function AdminModule({
  activeTab,
  createManualRegistration,
  exportRegistrationsCsv,
  filteredRegistrations,
  loading,
  nextStage,
  overview,
  searchTerm,
  selectedRegistration,
  setActiveTab,
  setSearchTerm,
  setSelectedRegistrationId,
  setStageFilter,
  setStatusFilter,
  showManualForm,
  setShowManualForm,
  stageFilter,
  stageOptions,
  statusCounts,
  statusFilter,
  updateRegistration,
  saveRegistrationNote,
}: {
  activeTab: AdminTab;
  createManualRegistration: (formData: Record<string, string>) => Promise<boolean>;
  exportRegistrationsCsv: () => void;
  filteredRegistrations: RegistrationRow[];
  loading: boolean;
  nextStage: StageRow | undefined;
  overview: Overview;
  searchTerm: string;
  selectedRegistration: RegistrationRow | null;
  setActiveTab: (tab: AdminTab) => void;
  setSearchTerm: (value: string) => void;
  setSelectedRegistrationId: (id: string) => void;
  setStageFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
  showManualForm: boolean;
  setShowManualForm: (value: boolean) => void;
  stageFilter: string;
  stageOptions: string[];
  statusCounts: { total: number; pending: number; approved: number; waitlist: number; rejected: number };
  statusFilter: string;
  updateRegistration: (id: string, status: string) => Promise<void>;
  saveRegistrationNote: (id: string, adminNotes: string) => Promise<void>;
}) {
  if (activeTab !== "inscricoes") {
    return (
      <section className="admin-module">
        <ModuleHeader
          kicker="Operação do campeonato"
          title={moduleTitle(activeTab)}
          subtitle="Controle integrado do Legends Kart Series 2026"
          action={activeTab === "baterias" ? <a className="admin-primary-action" href="/campeonatos/pontuacao"><Timer size={18} /> Lançar bateria</a> : null}
        />
        <OperationalGrid activeTab={activeTab} overview={overview} nextStage={nextStage} setActiveTab={setActiveTab} />
      </section>
    );
  }

  return (
    <section className="admin-module">
      <ModuleHeader
        kicker="P1 Academy Legends Kart Series"
        title="Gestão de Inscrições"
        subtitle="Triagem, aprovação e contato dos pilotos inscritos"
        action={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="admin-primary-action compact" type="button" onClick={() => setShowManualForm(true)}><Plus size={18} /> Nova Inscrição</button>
            <button className="admin-export" type="button" onClick={exportRegistrationsCsv}><Download size={18} /> Exportar CSV</button>
          </div>
        }
      />

      {showManualForm ? <ManualRegistrationModal loading={loading} onClose={() => setShowManualForm(false)} onSubmit={createManualRegistration} /> : null}

      <div className="admin-stat-row">
        <StatusCard label="Total inscritos" value={statusCounts.total} tone="white" detail="100%" />
        <StatusCard label="Novos" value={statusCounts.pending} tone="blue" detail={percent(statusCounts.pending, statusCounts.total)} />
        <StatusCard label="Em análise" value={statusCounts.pending} tone="yellow" detail="fila atual" />
        <StatusCard label="Aprovados" value={statusCounts.approved} tone="green" detail={percent(statusCounts.approved, statusCounts.total)} />
        <StatusCard label="Lista de espera" value={statusCounts.waitlist} tone="orange" detail={percent(statusCounts.waitlist, statusCounts.total)} />
        <StatusCard label="Recusados" value={statusCounts.rejected} tone="red" detail={percent(statusCounts.rejected, statusCounts.total)} />
      </div>

      <div className="admin-filter-bar">
        <label className="admin-search">
          <Search size={20} />
          <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Buscar por nome, e-mail, WhatsApp ou protocolo..." />
        </label>
        <SelectFilter label="Status" value={statusFilter} onChange={setStatusFilter} options={[
          ["all", "Todos"],
          ["pending", "Novo"],
          ["approved", "Aprovado"],
          ["waitlist", "Lista de espera"],
          ["rejected", "Recusado"],
        ]} />
        <SelectFilter label="Etapa preferida" value={stageFilter} onChange={setStageFilter} options={[["all", "Todas"], ...stageOptions.map((stage) => [stage, stage] as [string, string])]} />
        <button
          className="admin-filter-button"
          type="button"
          title="Limpar filtros"
          disabled={statusFilter === "all" && stageFilter === "all" && searchTerm.trim() === ""}
          onClick={() => {
            setSearchTerm("");
            setStatusFilter("all");
            setStageFilter("all");
          }}
        >
          <Filter size={18} /> Limpar filtros
        </button>
      </div>

      <div className="admin-registration-tabs">
        <button className={statusFilter === "all" ? "active" : ""} type="button" onClick={() => setStatusFilter("all")}>Todos ({statusCounts.total})</button>
        <button className={statusFilter === "pending" ? "active" : ""} type="button" onClick={() => setStatusFilter("pending")}>Novo ({statusCounts.pending})</button>
        <button className={statusFilter === "approved" ? "active" : ""} type="button" onClick={() => setStatusFilter("approved")}>Aprovado ({statusCounts.approved})</button>
        <button className={statusFilter === "waitlist" ? "active" : ""} type="button" onClick={() => setStatusFilter("waitlist")}>Lista de espera ({statusCounts.waitlist})</button>
        <button className={statusFilter === "rejected" ? "active" : ""} type="button" onClick={() => setStatusFilter("rejected")}>Recusado ({statusCounts.rejected})</button>
      </div>

      <div className="admin-registrations-layout">
        <div className="admin-table-panel">
          <div className="admin-data-table">
            <div className="admin-table-header">
              <span>#</span>
              <span>Nome</span>
              <span>Categoria</span>
              <span>Etapa preferida</span>
              <span>Status</span>
              <span>Data da inscrição</span>
              <span>Ações</span>
            </div>
            {filteredRegistrations.map((registration, index) => (
              <button
                className={selectedRegistration?.id === registration.id ? "admin-table-row selected" : "admin-table-row"}
                key={registration.id}
                type="button"
                onClick={() => setSelectedRegistrationId(registration.id)}
              >
                <span>{index + 1}</span>
                <strong>{registration.full_name}</strong>
                <span>{registration.current_level ?? "Legends"}</span>
                <span>{registration.preferred_race_windows ?? "Todas as etapas"}</span>
                <StatusBadge status={registration.status} />
                <span>{formatDateTime(registration.created_at)}</span>
                <span className="admin-row-actions">
                  <Eye size={18} />
                  <MoreVertical size={18} />
                </span>
              </button>
            ))}
            {filteredRegistrations.length === 0 ? (
              <div className="admin-table-empty">
                <ClipboardList size={28} />
                <strong>Nenhuma inscrição encontrada</strong>
                <span>Quando um piloto se inscrever, ele aparece aqui para triagem.</span>
              </div>
            ) : null}
          </div>
        </div>

        <RegistrationDetailPanel key={selectedRegistration?.id ?? "none"} loading={loading} registration={selectedRegistration} updateRegistration={updateRegistration} saveRegistrationNote={saveRegistrationNote} />
      </div>
    </section>
  );
}

function OperationalGrid({ activeTab, nextStage, overview, setActiveTab }: { activeTab: AdminTab; nextStage: StageRow | undefined; overview: Overview; setActiveTab: (tab: AdminTab) => void }) {
  if (activeTab === "dashboard") {
    const recent = overview.registrations.slice(0, 5);
    const upcoming = overview.stages.filter((stage) => stage.status !== "completed" && stage.status !== "cancelled").slice(0, 6);
    return (
      <div className="admin-dashboard">
        <div className="admin-overview-grid">
          <button type="button" onClick={() => setActiveTab("inscricoes")}><ClipboardList size={22} /><strong>{overview.registrations.length}</strong><span>Inscrições</span></button>
          <button type="button" onClick={() => setActiveTab("pilotos")}><Users size={22} /><strong>{overview.drivers.length}</strong><span>Pilotos ativos</span></button>
          <button type="button" onClick={() => setActiveTab("etapas")}><CalendarDays size={22} /><strong>{overview.stages.length}</strong><span>Janelas oficiais</span></button>
          <button type="button" onClick={() => setActiveTab("baterias")}><Timer size={22} /><strong>{overview.heats.length}</strong><span>Baterias publicadas</span></button>
        </div>

        <div className="admin-dashboard-panels">
          <section className="admin-panel">
            <header className="admin-panel-head">
              <h3>Inscrições recentes</h3>
              <button type="button" onClick={() => setActiveTab("inscricoes")}>Ver todas</button>
            </header>
            {recent.length ? (
              <div className="admin-panel-list">
                {recent.map((registration) => (
                  <div className="admin-panel-row" key={registration.id}>
                    <div><strong>{registration.full_name}</strong><span>{registration.city || "Cidade não informada"}</span></div>
                    <StatusBadge status={registration.status} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyPanel icon={<ClipboardList size={26} />} title="Nenhuma inscrição ainda" />
            )}
          </section>

          <section className="admin-panel">
            <header className="admin-panel-head">
              <h3>Próximas etapas</h3>
              <button type="button" onClick={() => setActiveTab("etapas")}>Ver calendário</button>
            </header>
            {upcoming.length ? (
              <div className="admin-panel-list">
                {upcoming.map((stage) => (
                  <div className="admin-panel-row" key={stage.id}>
                    <div><strong>{stage.stage_code}</strong><span>{stage.weekday}</span></div>
                    <span className="admin-panel-meta">{formatDate(stage.scheduled_date)} · {stage.scheduled_time.slice(0, 5)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyPanel icon={<CalendarDays size={26} />} title={nextStage ? `Próxima: ${nextStage.stage_code}` : "Calendário aguardando publicação"} />
            )}
          </section>
        </div>
      </div>
    );
  }

  if (activeTab === "pilotos") {
    if (overview.drivers.length === 0) {
      return <EmptyPanel icon={<Users size={30} />} title="Nenhum piloto aprovado ainda" text="Pilotos aprovados na triagem de inscrições aparecem aqui." />;
    }
    return (
      <div className="admin-simple-table">
        <div className="admin-simple-head"><span>Piloto</span><span>Cidade</span><span>Nível</span><span>Status</span></div>
        {overview.drivers.map((driver) => (
          <div key={driver.id}><strong>{driver.display_name}</strong><span>{driver.city ?? "Cidade não informada"}</span><span>{driver.current_level ?? "Legends"}</span><StatusBadge status={driver.status} /></div>
        ))}
      </div>
    );
  }

  if (activeTab === "etapas") {
    return (
      <div className="admin-simple-table">
        <div className="admin-simple-head"><span>Etapa</span><span>Dia</span><span>Data e hora</span><span>Status</span></div>
        {overview.stages.map((stage) => (
          <div key={stage.id}><strong>{stage.stage_code}</strong><span>{stage.weekday}</span><span>{formatDate(stage.scheduled_date)} às {stage.scheduled_time.slice(0, 5)}</span><StatusBadge status={stage.status} /></div>
        ))}
      </div>
    );
  }

  if (activeTab === "baterias") {
    if (overview.heats.length === 0) {
      return <EmptyPanel icon={<Flag size={30} />} title="Nenhuma bateria publicada ainda" text="Lance uma bateria pelo sistema de pontuação para gerar resultados." />;
    }
    return (
      <div className="admin-simple-table">
        <div className="admin-simple-head"><span>Bateria</span><span>Data</span><span>Tipo</span><span>Fonte</span></div>
        {overview.heats.map((heat) => (
          <div key={heat.id}><strong>{heat.title}</strong><span>{formatDate(heat.heat_date)}</span><span>{heat.type === "super_final" ? "Super Final" : "Regular"}</span><span>{translateSource(heat.source)}</span></div>
        ))}
      </div>
    );
  }

  if (activeTab === "ranking") {
    if (overview.standings.length === 0) {
      return <EmptyPanel icon={<Trophy size={30} />} title="Ranking será montado após as baterias" text="A classificação geral aparece quando houver resultados publicados." />;
    }
    return (
      <div className="admin-simple-table">
        <div className="admin-simple-head"><span>Piloto</span><span>Pontos</span><span>Válidas</span><span>Vitórias</span></div>
        {overview.standings.map((row) => (
          <div key={`${row.position}-${row.driver_name}`}><strong><Medal size={16} /> {String(row.position).padStart(2, "0")} {row.driver_name}</strong><span>{Number(row.total).toLocaleString("pt-BR", { minimumFractionDigits: 3 })} pts</span><span>{row.valid_regular_results}/10 válidas</span><span>{row.wins} vitórias</span></div>
        ))}
      </div>
    );
  }

  if (activeTab === "config") {
    return <SystemModule overview={overview} />;
  }

  return (
    <div className="admin-document-grid">
      <a href="/regulamentos/calendario-legends-kart-series-2026.pdf" target="_blank" rel="noreferrer"><FileText size={22} /><strong>Calendário oficial</strong><span>PDF Legends 2026</span></a>
      <a href="/regulamentos/regulamento-legends-kart-series-2026.pdf" target="_blank" rel="noreferrer"><FileText size={22} /><strong>Regulamento oficial</strong><span>PDF do campeonato</span></a>
    </div>
  );
}

function SystemModule({ overview }: { overview: Overview }) {
  const publishedHeats = overview.heats.filter((heat) => heat.is_published).length;
  const reviewed = overview.registrations.filter((registration) => registration.status !== "pending").length;

  return (
    <div className="admin-system-grid">
      <div className="admin-system-block">
        <h3>Integrações</h3>
        <ul className="admin-system-list">
          <li><ShieldCheck size={16} /> <span>Banco de dados Supabase</span> <em className="ok">Conectado</em></li>
          <li><ShieldCheck size={16} /> <span>Sessão administrativa</span> <em className="ok">Ativa</em></li>
          <li><Trophy size={16} /> <span>Campeonato</span> <em className="ok">{overview.championship.name} {overview.championship.season}</em></li>
        </ul>
      </div>

      <div className="admin-system-block">
        <h3>Resumo operacional</h3>
        <ul className="admin-system-list">
          <li><ClipboardList size={16} /> <span>Inscrições</span> <em>{overview.registrations.length}</em></li>
          <li><ClipboardList size={16} /> <span>Inscrições revisadas</span> <em>{reviewed}</em></li>
          <li><Users size={16} /> <span>Pilotos ativos</span> <em>{overview.drivers.length}</em></li>
          <li><CalendarDays size={16} /> <span>Etapas no calendário</span> <em>{overview.stages.length}</em></li>
          <li><Timer size={16} /> <span>Baterias publicadas</span> <em>{publishedHeats}</em></li>
          <li><Trophy size={16} /> <span>Pilotos no ranking</span> <em>{overview.standings.length}</em></li>
        </ul>
      </div>

      <div className="admin-system-block">
        <h3>Conta</h3>
        <ul className="admin-system-list">
          <li><Mail size={16} /> <span>Administrador</span> <em>{overview.admin.email}</em></li>
        </ul>
      </div>

      <div className="admin-system-block">
        <h3>Documentos oficiais</h3>
        <div className="admin-document-grid compact">
          <a href="/regulamentos/calendario-legends-kart-series-2026.pdf" target="_blank" rel="noreferrer"><FileText size={20} /><strong>Calendário oficial</strong><span>PDF Legends 2026</span></a>
          <a href="/regulamentos/regulamento-legends-kart-series-2026.pdf" target="_blank" rel="noreferrer"><FileText size={20} /><strong>Regulamento oficial</strong><span>PDF do campeonato</span></a>
        </div>
      </div>
    </div>
  );
}

function RegistrationDetailPanel({ loading, registration, updateRegistration, saveRegistrationNote }: { loading: boolean; registration: RegistrationRow | null; updateRegistration: (id: string, status: string) => Promise<void>; saveRegistrationNote: (id: string, adminNotes: string) => Promise<void> }) {
  const [detailTab, setDetailTab] = useState<"perfil" | "documentos" | "historico">("perfil");
  const [noteDraft, setNoteDraft] = useState(registration?.admin_notes ?? "");

  if (!registration) {
    return (
      <aside className="admin-detail-panel empty">
        <ClipboardList size={30} />
        <strong>Nenhum piloto selecionado</strong>
        <span>Selecione uma inscrição para ver o perfil e liberar ações rápidas.</span>
      </aside>
    );
  }

  const noteChanged = noteDraft.trim() !== (registration.admin_notes ?? "").trim();

  return (
    <aside className="admin-detail-panel">
      <div className="admin-detail-head">
        <div>
          <h3>{registration.full_name}</h3>
          <span>ID {registration.protocol}</span>
        </div>
        <StatusBadge status={registration.status} />
      </div>

      <div className="admin-detail-tabs">
        <button className={detailTab === "perfil" ? "active" : ""} type="button" onClick={() => setDetailTab("perfil")}>Perfil</button>
        <button className={detailTab === "documentos" ? "active" : ""} type="button" onClick={() => setDetailTab("documentos")}>Documentos</button>
        <button className={detailTab === "historico" ? "active" : ""} type="button" onClick={() => setDetailTab("historico")}>Histórico</button>
      </div>

      {detailTab === "perfil" ? (
        <>
          <DetailSection title="Dados pessoais" rows={[
            ["WhatsApp", registration.whatsapp],
            ["E-mail", registration.email],
            ["Cidade / UF", registration.city || "Não informado"],
            ["CPF", registration.cpf || "Não informado"],
            ["Idade", registration.age ? `${registration.age} anos` : "Não informado"],
            ["Categoria desejada", "Legends"],
            ["Data da inscrição", formatDateTime(registration.created_at)],
          ]} />

          <DetailSection title="Perfil competitivo" rows={[
            ["Nível atual", registration.current_level ?? "Não informado"],
            ["Experiência", registration.experience ?? "Não informado"],
            ["Peso declarado", registration.weight ? `${registration.weight} kg` : "Não informado"],
            ["Etapa preferida", registration.preferred_race_windows ?? "Todas as etapas"],
            ["Disponibilidade", registration.availability ?? "Não informado"],
            ["Status interno", translateStatus(registration.status)],
          ]} />
        </>
      ) : null}

      {detailTab === "documentos" ? (
        <>
          <DetailSection title="Confirmações do piloto" rows={[
            ["Autoriza contato", boolLabel(registration.accepted_contact)],
            ["Leu o regulamento", boolLabel(registration.accepted_rules)],
            ["Ciente das condições", boolLabel(registration.accepted_responsibility)],
            ["Autoriza uso de imagem", boolLabel(registration.accepted_image)],
          ]} />

          <DetailSection title="Segurança" rows={[
            ["Contato de emergência", registration.emergency_contact_name || "Não informado"],
            ["Telefone de emergência", registration.emergency_contact_phone || "Não informado"],
            ["Equipamento", registration.equipment ?? "Não informado"],
          ]} />

          <div className="admin-detail-docs">
            <strong>Documentos oficiais</strong>
            <a href="/regulamentos/regulamento-legends-kart-series-2026.pdf" target="_blank" rel="noreferrer"><FileText size={16} /> Regulamento oficial</a>
            <a href="/regulamentos/calendario-legends-kart-series-2026.pdf" target="_blank" rel="noreferrer"><FileText size={16} /> Calendário oficial</a>
          </div>
        </>
      ) : null}

      {detailTab === "historico" ? (
        <div className="admin-detail-timeline">
          <div className="admin-timeline-item">
            <span className="admin-timeline-dot" />
            <div>
              <strong>Inscrição recebida</strong>
              <span>{formatDateTime(registration.created_at)}</span>
            </div>
          </div>
          {registration.reviewed_at ? (
            <div className="admin-timeline-item">
              <span className="admin-timeline-dot" />
              <div>
                <strong>Status atualizado para {translateStatus(registration.status)}</strong>
                <span>{formatDateTime(registration.reviewed_at)}</span>
              </div>
            </div>
          ) : (
            <div className="admin-timeline-item pending">
              <span className="admin-timeline-dot" />
              <div>
                <strong>Aguardando triagem</strong>
                <span>Use as ações rápidas para aprovar, recusar ou enviar para a lista de espera.</span>
              </div>
            </div>
          )}
          {registration.goals ? (
            <DetailSection title="Objetivo no campeonato" rows={[["Declarado", registration.goals]]} />
          ) : null}
        </div>
      ) : null}

      <div className="admin-detail-note">
        <strong>Notas internas</strong>
        <textarea value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} placeholder="Adicionar nota interna..." />
        <button type="button" disabled={loading || !noteChanged} onClick={() => saveRegistrationNote(registration.id, noteDraft.trim())}>Salvar nota</button>
      </div>

      <div className="admin-quick-actions">
        <strong>Ações rápidas</strong>
        <div>
          <button className="approve" type="button" disabled={loading} onClick={() => updateRegistration(registration.id, "approved")}>Aprovar</button>
          <button className="waitlist" type="button" disabled={loading} onClick={() => updateRegistration(registration.id, "waitlist")}>Lista de espera</button>
          <button className="reject" type="button" disabled={loading} onClick={() => updateRegistration(registration.id, "rejected")}>Recusar</button>
        </div>
        <a href={`https://wa.me/${digitsOnly(registration.whatsapp)}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Enviar WhatsApp</a>
        <a href={`mailto:${registration.email}`}><Mail size={17} /> Enviar e-mail</a>
      </div>
    </aside>
  );
}

function ManualRegistrationModal({ loading, onClose, onSubmit }: { loading: boolean; onClose: () => void; onSubmit: (data: Record<string, string>) => Promise<boolean> }) {
  const [form, setForm] = useState({
    fullName: "", cpf: "", birthDate: "", whatsapp: "", email: "", city: "",
    age: "", weight: "", experience: "Já andei algumas vezes",
    currentLevel: "A definir pela organização", availability: "",
    intendedHeats: "Quero participar quando houver vaga",
    rankingInterest: "Quero entrar no ranking geral",
    preferredRaceWindows: "Sem preferência definida",
    equipment: "Tenho capacete próprio", equipmentDetails: "",
    emergencyContactName: "", emergencyContactPhone: "",
    medicalRestrictions: "", allergies: "", medications: "",
    goals: "", notes: "",
    acceptedContact: true, acceptedRules: true,
    acceptedResponsibility: true, acceptedImage: true,
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  function updateText(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateBool(field: string, value: boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!form.fullName.trim() || !form.whatsapp.trim() || !form.email.trim()) {
      setFormError("Preencha os campos obrigatórios: nome completo, WhatsApp e e-mail.");
      return;
    }

    const ok = await onSubmit(form as unknown as Record<string, string>);
    if (ok) {
      setFormSuccess("Inscrição criada com sucesso.");
    }
  }

  return (
    <div className="registration-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="registration-modal" role="dialog" aria-modal="true" aria-label="Inscrição manual do piloto">
        <button className="registration-modal-close" type="button" onClick={onClose} aria-label="Fechar">
          <X size={22} />
        </button>
        <div className="registration-modal-body">
          <form className="championship-form" onSubmit={handleSubmit} noValidate>
            <div className="championship-form-head">
              <span className="eyebrow">Inscrição manual — Admin</span>
              <h3><ClipboardList size={24} /> Nova Inscrição Legends</h3>
              <p>Cadastro manual de piloto pela organização. Os aceites são marcados automaticamente.</p>
            </div>

            <fieldset className="form-section">
              <legend>Dados do piloto</legend>
              <div className="grid-2">
                <label className="field">
                  <span>Nome completo</span>
                  <input name="fullName" value={form.fullName} onChange={(e) => updateText("fullName", e.target.value)} placeholder="Nome e sobrenome" required />
                </label>
                <label className="field">
                  <span>WhatsApp</span>
                  <input name="whatsapp" value={form.whatsapp} onChange={(e) => updateText("whatsapp", e.target.value)} placeholder="(21) 99999-9999" required />
                </label>
              </div>
              <div className="grid-3">
                <label className="field">
                  <span>CPF</span>
                  <input name="cpf" value={form.cpf} onChange={(e) => updateText("cpf", e.target.value)} placeholder="000.000.000-00" inputMode="numeric" />
                </label>
                <label className="field">
                  <span>Data de nascimento</span>
                  <input name="birthDate" value={form.birthDate} onChange={(e) => updateText("birthDate", e.target.value)} placeholder="dd/mm/aaaa" inputMode="numeric" />
                </label>
                <label className="field">
                  <span>Idade</span>
                  <input type="number" name="age" value={form.age} onChange={(e) => updateText("age", e.target.value)} placeholder="Ex: 34" inputMode="numeric" min="8" max="90" />
                </label>
              </div>
              <div className="grid-2">
                <label className="field">
                  <span>E-mail</span>
                  <input type="email" name="email" value={form.email} onChange={(e) => updateText("email", e.target.value)} placeholder="piloto@email.com" required />
                </label>
                <label className="field">
                  <span>Cidade/UF</span>
                  <input name="city" value={form.city} onChange={(e) => updateText("city", e.target.value)} placeholder="Ex: Belo Horizonte/MG" />
                </label>
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend>Perfil competitivo</legend>
              <label className="field">
                <span>Peso aproximado com equipamento</span>
                <input type="number" name="weight" value={form.weight} onChange={(e) => updateText("weight", e.target.value)} placeholder="Ex: 92" inputMode="decimal" min="30" max="180" />
                <small className="field-hint">Informe o peso em kg para orientar lastro e organização das baterias.</small>
              </label>
              <div className="grid-2">
                <label className="field">
                  <span>Experiência em kart</span>
                  <select name="experience" value={form.experience} onChange={(e) => updateText("experience", e.target.value)}>
                    <option>Primeira competição</option>
                    <option>Já andei algumas vezes</option>
                    <option>Participo de campeonatos indoor/rental</option>
                    <option>Tenho experiência avançada em kart</option>
                  </select>
                </label>
                <label className="field">
                  <span>Nível declarado</span>
                  <select name="currentLevel" value={form.currentLevel} onChange={(e) => updateText("currentLevel", e.target.value)}>
                    <option>A definir pela organização</option>
                    <option>Estreante</option>
                    <option>Intermediário</option>
                    <option>Competitivo</option>
                    <option>Avançado</option>
                  </select>
                </label>
              </div>
              <label className="field">
                <span>Objetivo no campeonato</span>
                <textarea name="goals" value={form.goals} onChange={(e) => updateText("goals", e.target.value)} placeholder="Ex: aprender ritmo de tomada, disputar ranking, preparar para campeonatos, treinar constância." />
              </label>
            </fieldset>

            <fieldset className="form-section">
              <legend>Participação</legend>
              <div className="grid-2">
                <label className="field">
                  <span>Participação desejada</span>
                  <select name="intendedHeats" value={form.intendedHeats} onChange={(e) => updateText("intendedHeats", e.target.value)}>
                    <option>Quero participar quando houver vaga</option>
                    <option>Quero correr o máximo de baterias possível</option>
                    <option>Quero participar de baterias avulsas</option>
                    <option>Quero entrar no ranking geral</option>
                  </select>
                </label>
                <label className="field">
                  <span>Interesse no ranking geral</span>
                  <select name="rankingInterest" value={form.rankingInterest} onChange={(e) => updateText("rankingInterest", e.target.value)}>
                    <option>Quero entrar no ranking geral</option>
                    <option>Quero correr apenas baterias avulsas</option>
                    <option>Quero entender as regras antes de decidir</option>
                  </select>
                </label>
              </div>
              <label className="field">
                <span>Janelas preferidas</span>
                <select name="preferredRaceWindows" value={form.preferredRaceWindows} onChange={(e) => updateText("preferredRaceWindows", e.target.value)}>
                  <option>Sem preferência definida</option>
                  <option>Quartas 20:30</option>
                  <option>Quartas 21:05</option>
                  <option>Sábados 09:15</option>
                  <option>Posso participar em qualquer janela disponível</option>
                </select>
              </label>
              <label className="field">
                <span>Dias e horários disponíveis</span>
                <textarea name="availability" value={form.availability} onChange={(e) => updateText("availability", e.target.value)} placeholder="Ex: quartas à noite, sábados pela manhã, datas em que não consigo correr, disponibilidade para chamadas de última hora." />
              </label>
            </fieldset>

            <fieldset className="form-section">
              <legend>Equipamento</legend>
              <div className="grid-2">
                <label className="field">
                  <span>Equipamento disponível</span>
                  <select name="equipment" value={form.equipment} onChange={(e) => updateText("equipment", e.target.value)}>
                    <option>Tenho capacete próprio</option>
                    <option>Tenho capacete e macacão próprios</option>
                    <option>Tenho capacete, macacão, luvas e sapatilha</option>
                    <option>Preciso usar equipamento do kartódromo</option>
                    <option>Tenho dúvida sobre equipamentos</option>
                  </select>
                </label>
                <label className="field">
                  <span>Detalhes do equipamento</span>
                  <input name="equipmentDetails" value={form.equipmentDetails} onChange={(e) => updateText("equipmentDetails", e.target.value)} placeholder="Ex: capacete próprio tamanho 58, sem macacão, levo luvas." />
                </label>
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend>Segurança e saúde</legend>
              <div className="grid-2">
                <label className="field">
                  <span>Contato de emergência</span>
                  <input name="emergencyContactName" value={form.emergencyContactName} onChange={(e) => updateText("emergencyContactName", e.target.value)} placeholder="Nome completo" />
                </label>
                <label className="field">
                  <span>Telefone de emergência</span>
                  <input name="emergencyContactPhone" value={form.emergencyContactPhone} onChange={(e) => updateText("emergencyContactPhone", e.target.value)} placeholder="(21) 99999-9999" />
                </label>
              </div>
              <div className="grid-3">
                <label className="field">
                  <span>Restrições médicas</span>
                  <input name="medicalRestrictions" value={form.medicalRestrictions} onChange={(e) => updateText("medicalRestrictions", e.target.value)} placeholder="Ex: nenhuma, lesão, restrição física." />
                </label>
                <label className="field">
                  <span>Alergias</span>
                  <input name="allergies" value={form.allergies} onChange={(e) => updateText("allergies", e.target.value)} placeholder="Ex: nenhuma, medicamento, alimento." />
                </label>
                <label className="field">
                  <span>Medicamentos</span>
                  <input name="medications" value={form.medications} onChange={(e) => updateText("medications", e.target.value)} placeholder="Uso contínuo ou eventual." />
                </label>
              </div>
              <label className="field">
                <span>Observações operacionais</span>
                <textarea name="notes" value={form.notes} onChange={(e) => updateText("notes", e.target.value)} placeholder="Ex: necessidade de orientação especial, restrição de agenda, observação para briefing ou nenhuma." />
              </label>
            </fieldset>

            <fieldset className="form-section form-section-compact">
              <legend>Confirmações obrigatórias</legend>
              <label className="check-field">
                <input type="checkbox" checked={form.acceptedContact} onChange={(e) => updateBool("acceptedContact", e.target.checked)} />
                <span>Autorizo a organização a entrar em contato por WhatsApp ou e-mail para confirmação de vaga, bateria, briefing e orientações do campeonato.</span>
              </label>
              <label className="check-field">
                <input type="checkbox" checked={form.acceptedRules} onChange={(e) => updateBool("acceptedRules", e.target.checked)} />
                <span>Li ou vou ler o regulamento oficial antes da primeira bateria.</span>
              </label>
              <label className="check-field">
                <input type="checkbox" checked={form.acceptedResponsibility} onChange={(e) => updateBool("acceptedResponsibility", e.target.checked)} />
                <span>Estou ciente de que a participação depende de aceite da organização, vaga disponível, briefing e termo de responsabilidade no kartódromo.</span>
              </label>
              <label className="check-field">
                <input type="checkbox" checked={form.acceptedImage} onChange={(e) => updateBool("acceptedImage", e.target.checked)} />
                <span>Autorizo o uso de imagem em fotos, vídeos, ranking e materiais da competição P1 Academy.</span>
              </label>
            </fieldset>

            {formError ? <p className="error">{formError}</p> : null}
            {formSuccess ? <p className="success">{formSuccess}</p> : null}
            <button className="btn primary" type="submit" disabled={loading}>
              <Send size={18} /> {loading ? "Criando..." : "Criar inscrição"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function boolLabel(value: boolean | null | undefined) {
  return value ? "Sim" : "Não";
}

function ModuleHeader({ action, kicker, subtitle, title }: { action: ReactNode; kicker: string; subtitle: string; title: string }) {
  return (
    <div className="admin-module-head">
      <div>
        <span className="admin-eyebrow">{kicker}</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function StatusCard({ detail, label, tone, value }: { detail: string; label: string; tone: string; value: number }) {
  return (
    <div className={`admin-status-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <em>{detail}</em>
    </div>
  );
}

function SelectFilter({ label, onChange, options, value }: { label: string; onChange: (value: string) => void; options: Array<[string, string]>; value: string }) {
  return (
    <label className="admin-select">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}

function DetailSection({ rows, title }: { rows: Array<[string, string]>; title: string }) {
  return (
    <section className="admin-detail-section">
      <h4>{title}</h4>
      {rows.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </section>
  );
}

function EmptyPanel({ icon, title, text }: { icon: ReactNode; title: string; text?: string }) {
  return (
    <div className="admin-empty-panel">
      <span className="admin-empty-icon">{icon}</span>
      <strong>{title}</strong>
      {text ? <span>{text}</span> : null}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`admin-status admin-status-${status}`}>{translateStatus(status)}</span>;
}

function formatDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-");
  return day && month && year ? `${day}/${month}/${year}` : value;
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
}

function moduleTitle(tab: AdminTab) {
  const labels: Record<AdminTab, string> = {
    dashboard: "Dashboard",
    inscricoes: "Gestão de Inscrições",
    pilotos: "Pilotos",
    etapas: "Etapas",
    baterias: "Baterias e Resultados",
    ranking: "Ranking",
    documentos: "Documentos Oficiais",
    config: "Sistema",
  };
  return labels[tab];
}

function percent(value: number, total: number) {
  return total ? `${Math.round((value / total) * 100)}%` : "0%";
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function translateStatus(status: string) {
  const labels: Record<string, string> = {
    active: "ativo",
    approved: "aprovado",
    cancelled: "cancelada",
    completed: "concluída",
    full: "lotada",
    inactive: "inativo",
    open: "aberta",
    pending: "novo",
    rejected: "recusado",
    scheduled: "programada",
    suspended: "suspenso",
    waitlist: "lista de espera",
  };

  return labels[status] ?? status;
}

function translateSource(source: string) {
  const labels: Record<string, string> = {
    import: "importação",
    live: "cronometragem",
    manual: "manual",
  };

  return labels[source] ?? source;
}
