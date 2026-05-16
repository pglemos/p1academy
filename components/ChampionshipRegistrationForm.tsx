"use client";

import { ClipboardCheck, Send, ShieldCheck, X } from "lucide-react";
import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { legendsCompetition, legendsPdf } from "@/data/legends";

type RegistrationFormState = {
  fullName: string;
  whatsapp: string;
  email: string;
  city: string;
  age: string;
  weight: string;
  experience: string;
  currentLevel: string;
  availability: string;
  intendedHeats: string;
  equipment: string;
  emergencyContact: string;
  goals: string;
  notes: string;
  acceptedRules: boolean;
  acceptedResponsibility: boolean;
  acceptedImage: boolean;
};

const initialState: RegistrationFormState = {
  fullName: "",
  whatsapp: "",
  email: "",
  city: "",
  age: "",
  weight: "",
  experience: "Já andei algumas vezes",
  currentLevel: "A definir pela organização",
  availability: "",
  intendedHeats: "Quero participar quando houver vaga",
  equipment: "Tenho capacete próprio",
  emergencyContact: "",
  goals: "",
  notes: "",
  acceptedRules: false,
  acceptedResponsibility: false,
  acceptedImage: false,
};

export function ChampionshipRegistrationModal() {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function openRegistration(event?: Event) {
      event?.preventDefault();
      setOpen(true);
      if (window.location.hash !== "#inscricao") {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#inscricao`);
      }
    }

    function handleDocumentClick(event: Event) {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-registration-trigger]")) {
        openRegistration(event);
      }
    }

    function handleHashChange() {
      if (window.location.hash === "#inscricao") {
        setOpen(true);
      }
    }

    document.addEventListener("click", handleDocumentClick);
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => {
      document.removeEventListener("click", handleDocumentClick);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function closeModal() {
    setOpen(false);
    if (typeof window !== "undefined" && window.location.hash === "#inscricao") {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  }

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="registration-modal-backdrop" onMouseDown={handleBackdropClick}>
      <div className="registration-modal" role="dialog" aria-modal="true" aria-labelledby="registration-modal-title">
        <div className="registration-modal-head">
          <div>
            <span className="eyebrow">Inscrição Legends</span>
            <h2 id="registration-modal-title">Cadastro completo do piloto</h2>
            <p>Preencha os dados para a organização analisar vaga, nível, disponibilidade, segurança e retorno pelo WhatsApp.</p>
          </div>
          <button ref={closeButtonRef} className="registration-modal-close" type="button" onClick={closeModal} aria-label="Fechar inscrição">
            <X size={22} />
          </button>
        </div>
        <div className="registration-modal-body">
          <ChampionshipRegistrationForm />
        </div>
      </div>
    </div>
  );
}

export function ChampionshipRegistrationForm() {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function update<K extends keyof RegistrationFormState>(field: K, value: RegistrationFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const requiredTextFields: Array<keyof RegistrationFormState> = [
      "fullName",
      "whatsapp",
      "email",
      "city",
      "age",
      "weight",
      "availability",
    ];

    const missingTextField = requiredTextFields.some((field) => {
      const value = form[field];
      return typeof value === "string" && !value.trim();
    });

    if (missingTextField) {
      setError("Preencha os dados obrigatórios do piloto, peso e disponibilidade.");
      return;
    }

    if (!form.acceptedRules || !form.acceptedResponsibility || !form.acceptedImage) {
      setError("Confirme os aceites obrigatórios para enviar a pré-inscrição.");
      return;
    }

    const message = [
      `Pré-inscrição - ${legendsCompetition.name}`,
      `${legendsCompetition.edition} | Temporada ${legendsCompetition.season}`,
      "",
      "DADOS DO PILOTO",
      `Nome completo: ${form.fullName}`,
      `WhatsApp: ${form.whatsapp}`,
      `E-mail: ${form.email}`,
      `Cidade/UF: ${form.city}`,
      `Idade: ${form.age}`,
      `Peso aproximado com equipamento: ${form.weight}`,
      "",
      "PERFIL COMPETITIVO",
      `Experiência: ${form.experience}`,
      `Nível declarado: ${form.currentLevel}`,
      `Baterias pretendidas: ${form.intendedHeats}`,
      `Equipamento: ${form.equipment}`,
      `Objetivo no campeonato: ${form.goals || "Não informado"}`,
      "",
      "DISPONIBILIDADE E SEGURANÇA",
      `Disponibilidade: ${form.availability}`,
      `Contato de emergência: ${form.emergencyContact || "Informarei depois"}`,
      `Observações médicas/operacionais: ${form.notes || "Sem observações"}`,
      "",
      "ACEITES",
      "Li o regulamento informado pela organização.",
      "Estou ciente de que devo assinar termo de responsabilidade no kartódromo.",
      "Autorizo o uso de imagem em materiais da competição P1 Academy.",
      "",
      `Regulamento: ${legendsPdf}`,
    ].join("\n");

    setSuccess("Pré-inscrição pronta. O WhatsApp será aberto para enviar os dados à organização.");
    window.open(
      `https://wa.me/${legendsCompetition.whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <form className="championship-form" onSubmit={handleSubmit}>
      <div className="championship-form-head">
        <span className="eyebrow">Pré-inscrição oficial</span>
        <h3>
          <ClipboardCheck size={24} /> Cadastro Legends Kart Series
        </h3>
        <p>
          Este formulário é exclusivo para campeonato. Ele coleta os dados necessários para análise de vaga, enquadramento de nível, disponibilidade de bateria e orientações de segurança.
        </p>
      </div>

      <fieldset className="form-section">
        <legend>Dados do piloto</legend>
        <div className="grid-2">
          <label className="field">
            <span>Nome completo</span>
            <input name="fullName" value={form.fullName} onChange={(event) => update("fullName", event.target.value)} placeholder="Nome e sobrenome" autoComplete="name" required />
          </label>
          <label className="field">
            <span>WhatsApp</span>
            <input name="whatsapp" value={form.whatsapp} onChange={(event) => update("whatsapp", event.target.value)} placeholder="(21) 99999-9999" autoComplete="tel" required />
          </label>
        </div>
        <div className="grid-2">
          <label className="field">
            <span>E-mail</span>
            <input type="email" name="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="piloto@email.com" autoComplete="email" required />
          </label>
          <label className="field">
            <span>Cidade/UF</span>
            <input name="city" value={form.city} onChange={(event) => update("city", event.target.value)} placeholder="Ex: Belo Horizonte/MG" required />
          </label>
        </div>
        <div className="grid-2">
          <label className="field">
            <span>Idade</span>
            <input name="age" value={form.age} onChange={(event) => update("age", event.target.value)} placeholder="Ex: 34" inputMode="numeric" required />
          </label>
          <label className="field">
            <span>Peso aproximado com equipamento</span>
            <input name="weight" value={form.weight} onChange={(event) => update("weight", event.target.value)} placeholder="Ex: 92 kg" required />
          </label>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Perfil competitivo</legend>
        <div className="grid-2">
          <label className="field">
            <span>Experiência em kart</span>
            <select name="experience" value={form.experience} onChange={(event) => update("experience", event.target.value)}>
              <option>Primeira competição</option>
              <option>Já andei algumas vezes</option>
              <option>Participo de campeonatos indoor/rental</option>
              <option>Tenho experiência avançada em kart</option>
            </select>
          </label>
          <label className="field">
            <span>Nível declarado</span>
            <select name="currentLevel" value={form.currentLevel} onChange={(event) => update("currentLevel", event.target.value)}>
              <option>A definir pela organização</option>
              <option>Estreante</option>
              <option>Intermediário</option>
              <option>Competitivo</option>
              <option>Avançado</option>
            </select>
          </label>
        </div>
        <div className="grid-2">
          <label className="field">
            <span>Participação desejada</span>
            <select name="intendedHeats" value={form.intendedHeats} onChange={(event) => update("intendedHeats", event.target.value)}>
              <option>Quero participar quando houver vaga</option>
              <option>Quero correr o máximo de baterias possível</option>
              <option>Quero participar de baterias avulsas</option>
              <option>Quero entrar no ranking geral</option>
            </select>
          </label>
          <label className="field">
            <span>Equipamento</span>
            <select name="equipment" value={form.equipment} onChange={(event) => update("equipment", event.target.value)}>
              <option>Tenho capacete próprio</option>
              <option>Tenho capacete e macacão próprios</option>
              <option>Preciso usar equipamento do kartódromo</option>
              <option>Tenho dúvida sobre equipamentos</option>
            </select>
          </label>
        </div>
        <label className="field">
          <span>Objetivo no campeonato</span>
          <textarea name="goals" value={form.goals} onChange={(event) => update("goals", event.target.value)} placeholder="Ex: aprender ritmo de tomada, disputar ranking, preparar para campeonatos, treinar constância." />
        </label>
      </fieldset>

      <fieldset className="form-section">
        <legend>Disponibilidade e segurança</legend>
        <label className="field">
          <span>Dias e horários disponíveis</span>
          <textarea name="availability" value={form.availability} onChange={(event) => update("availability", event.target.value)} placeholder="Ex: sábados à tarde, domingos pela manhã, noites durante a semana." required />
        </label>
        <div className="grid-2">
          <label className="field">
            <span>Contato de emergência</span>
            <input name="emergencyContact" value={form.emergencyContact} onChange={(event) => update("emergencyContact", event.target.value)} placeholder="Nome e telefone" />
          </label>
          <label className="field">
            <span>Observações médicas/operacionais</span>
            <input name="notes" value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Ex: restrição física, remédio, alergia ou nenhuma" />
          </label>
        </div>
      </fieldset>

      <fieldset className="form-section form-section-compact">
        <legend>Confirmações obrigatórias</legend>
        <label className="check-field">
          <input type="checkbox" checked={form.acceptedRules} onChange={(event) => update("acceptedRules", event.target.checked)} />
          <span>Li ou vou ler o regulamento oficial antes da primeira bateria.</span>
        </label>
        <label className="check-field">
          <input type="checkbox" checked={form.acceptedResponsibility} onChange={(event) => update("acceptedResponsibility", event.target.checked)} />
          <span>Estou ciente de que a participação depende de aceite da organização, vaga disponível, briefing e termo de responsabilidade no kartódromo.</span>
        </label>
        <label className="check-field">
          <input type="checkbox" checked={form.acceptedImage} onChange={(event) => update("acceptedImage", event.target.checked)} />
          <span>Autorizo o uso de imagem em fotos, vídeos, ranking e materiais da competição P1 Academy.</span>
        </label>
      </fieldset>

      <div className="registration-footnote">
        <ShieldCheck size={20} />
        <p>Pré-inscrição não garante vaga automática. A organização confirma bateria, grupo, orientações de lastro e próximos passos pelo WhatsApp.</p>
      </div>

      {error ? <p className="error">{error}</p> : null}
      {success ? <p className="success">{success}</p> : null}
      <button className="btn primary" type="submit">
        <Send size={18} /> Enviar pré-inscrição
      </button>
    </form>
  );
}
