"use client";

import { ClipboardCheck, Send, ShieldCheck, X } from "lucide-react";
import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { legendsCompetition, legendsPdf } from "@/data/legends";

type RegistrationFormState = {
  fullName: string;
  cpf: string;
  birthDate: string;
  whatsapp: string;
  email: string;
  city: string;
  age: string;
  weight: string;
  experience: string;
  currentLevel: string;
  availability: string;
  intendedHeats: string;
  rankingInterest: string;
  preferredRaceWindows: string;
  equipment: string;
  equipmentDetails: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalRestrictions: string;
  allergies: string;
  medications: string;
  goals: string;
  notes: string;
  acceptedContact: boolean;
  acceptedRules: boolean;
  acceptedResponsibility: boolean;
  acceptedImage: boolean;
};

const initialState: RegistrationFormState = {
  fullName: "",
  cpf: "",
  birthDate: "",
  whatsapp: "",
  email: "",
  city: "",
  age: "",
  weight: "",
  experience: "Já andei algumas vezes",
  currentLevel: "A definir pela organização",
  availability: "",
  intendedHeats: "Quero participar quando houver vaga",
  rankingInterest: "Quero entrar no ranking geral",
  preferredRaceWindows: "Sem preferência definida",
  equipment: "Tenho capacete próprio",
  equipmentDetails: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  medicalRestrictions: "",
  allergies: "",
  medications: "",
  goals: "",
  notes: "",
  acceptedContact: false,
  acceptedRules: false,
  acceptedResponsibility: false,
  acceptedImage: false,
};

const requiredFields: Array<{ field: keyof RegistrationFormState; label: string }> = [
  { field: "fullName", label: "nome completo" },
  { field: "cpf", label: "CPF" },
  { field: "birthDate", label: "data de nascimento" },
  { field: "whatsapp", label: "WhatsApp" },
  { field: "email", label: "e-mail" },
  { field: "city", label: "cidade/UF" },
  { field: "age", label: "idade" },
  { field: "weight", label: "peso com equipamento" },
  { field: "availability", label: "disponibilidade" },
  { field: "emergencyContactName", label: "contato de emergência" },
  { field: "emergencyContactPhone", label: "telefone de emergência" },
];

function listMissingFields(fields: string[]) {
  if (fields.length === 1) {
    return fields[0];
  }

  return `${fields.slice(0, -1).join(", ")} e ${fields.at(-1)}`;
}

function parsePositiveNumber(value: string) {
  const normalized = value.replace(",", ".").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatOptional(value: string, fallback = "Não informado") {
  return value.trim() || fallback;
}

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
      <div className="registration-modal" role="dialog" aria-modal="true" aria-label="Cadastro completo do piloto">
        <button ref={closeButtonRef} className="registration-modal-close" type="button" onClick={closeModal} aria-label="Fechar inscrição">
          <X size={22} />
        </button>
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

    const missingFields = requiredFields
      .filter(({ field }) => {
        const value = form[field];
        return typeof value === "string" && !value.trim();
      })
      .map(({ label }) => label);

    if (missingFields.length > 0) {
      setError(`Preencha os campos obrigatórios: ${listMissingFields(missingFields)}.`);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Informe um e-mail válido para a organização conseguir confirmar a inscrição.");
      return;
    }

    const age = parsePositiveNumber(form.age);
    if (!age || age < 8 || age > 90) {
      setError("Informe uma idade válida para o competidor.");
      return;
    }

    const weight = parsePositiveNumber(form.weight);
    if (!weight || weight < 30 || weight > 180) {
      setError("Informe um peso aproximado válido com equipamento.");
      return;
    }

    if (!form.acceptedContact || !form.acceptedRules || !form.acceptedResponsibility || !form.acceptedImage) {
      setError("Confirme todos os aceites obrigatórios para enviar a inscrição.");
      return;
    }

    const message = [
      `INSCRIÇÃO - ${legendsCompetition.name}`,
      `${legendsCompetition.edition} | Temporada ${legendsCompetition.season}`,
      `Sede: ${legendsCompetition.venue}`,
      "",
      "DADOS DO PILOTO",
      `Nome completo: ${form.fullName}`,
      `CPF: ${form.cpf}`,
      `Data de nascimento: ${form.birthDate}`,
      `WhatsApp: ${form.whatsapp}`,
      `E-mail: ${form.email}`,
      `Cidade/UF: ${form.city}`,
      `Idade: ${form.age}`,
      `Peso aproximado com equipamento: ${form.weight} kg`,
      "",
      "PERFIL COMPETITIVO",
      `Experiência: ${form.experience}`,
      `Nível declarado: ${form.currentLevel}`,
      `Objetivo no campeonato: ${formatOptional(form.goals)}`,
      "",
      "PARTICIPAÇÃO",
      `Baterias pretendidas: ${form.intendedHeats}`,
      `Interesse no ranking: ${form.rankingInterest}`,
      `Janelas preferidas: ${form.preferredRaceWindows}`,
      `Disponibilidade detalhada: ${form.availability}`,
      "",
      "EQUIPAMENTO",
      `Equipamento: ${form.equipment}`,
      `Detalhes do equipamento: ${formatOptional(form.equipmentDetails)}`,
      "",
      "SEGURANÇA E SAÚDE",
      `Contato de emergência: ${form.emergencyContactName}`,
      `Telefone de emergência: ${form.emergencyContactPhone}`,
      `Restrições médicas: ${formatOptional(form.medicalRestrictions, "Nenhuma informada")}`,
      `Alergias: ${formatOptional(form.allergies, "Nenhuma informada")}`,
      `Medicamentos de uso contínuo: ${formatOptional(form.medications, "Nenhum informado")}`,
      `Observações operacionais: ${formatOptional(form.notes, "Sem observações")}`,
      "",
      "ACEITES",
      "Autorizo contato por WhatsApp/e-mail para confirmação e orientações.",
      "Li ou vou ler o regulamento oficial antes da primeira bateria.",
      "Estou ciente de que a inscrição depende de aceite da organização, disponibilidade de vaga, briefing e termo de responsabilidade no kartódromo.",
      "Autorizo o uso de imagem em fotos, vídeos, ranking e materiais da competição P1 Academy.",
      "",
      `Regulamento: ${legendsPdf}`,
    ].join("\n");

    setSuccess("Inscrição pronta. Você será direcionado ao WhatsApp para enviar os dados completos à organização.");
    window.location.assign(`https://wa.me/${legendsCompetition.whatsappNumber}?text=${encodeURIComponent(message)}`);
  }

  return (
    <form className="championship-form" onSubmit={handleSubmit} noValidate>
      <div className="championship-form-head">
        <span className="eyebrow">Pré-inscrição oficial</span>
        <h3>
          <ClipboardCheck size={24} /> Inscrição Legends Kart Series
        </h3>
        <p>
          Cadastro completo para análise de vaga, enquadramento de nível, janelas de participação, equipamentos e orientações de segurança do campeonato.
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
        <div className="grid-3">
          <label className="field">
            <span>CPF</span>
            <input name="cpf" value={form.cpf} onChange={(event) => update("cpf", event.target.value)} placeholder="000.000.000-00" inputMode="numeric" autoComplete="off" required />
          </label>
          <label className="field">
            <span>Data de nascimento</span>
            <input name="birthDate" value={form.birthDate} onChange={(event) => update("birthDate", event.target.value)} placeholder="dd/mm/aaaa" inputMode="numeric" autoComplete="bday" required />
          </label>
          <label className="field">
            <span>Idade</span>
            <input type="number" name="age" value={form.age} onChange={(event) => update("age", event.target.value)} placeholder="Ex: 34" inputMode="numeric" min="8" max="90" required />
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
      </fieldset>

      <fieldset className="form-section">
        <legend>Perfil competitivo</legend>
        <label className="field">
          <span>Peso aproximado com equipamento</span>
          <input type="number" name="weight" value={form.weight} onChange={(event) => update("weight", event.target.value)} placeholder="Ex: 92" inputMode="decimal" min="30" max="180" required />
          <small className="field-hint">Informe o peso em kg para orientar lastro e organização das baterias.</small>
        </label>
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
        <label className="field">
          <span>Objetivo no campeonato</span>
          <textarea name="goals" value={form.goals} onChange={(event) => update("goals", event.target.value)} placeholder="Ex: aprender ritmo de tomada, disputar ranking, preparar para campeonatos, treinar constância." />
        </label>
      </fieldset>

      <fieldset className="form-section">
        <legend>Participação</legend>
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
            <span>Interesse no ranking geral</span>
            <select name="rankingInterest" value={form.rankingInterest} onChange={(event) => update("rankingInterest", event.target.value)}>
              <option>Quero entrar no ranking geral</option>
              <option>Quero correr apenas baterias avulsas</option>
              <option>Quero entender as regras antes de decidir</option>
            </select>
          </label>
        </div>
        <label className="field">
          <span>Janelas preferidas</span>
          <select name="preferredRaceWindows" value={form.preferredRaceWindows} onChange={(event) => update("preferredRaceWindows", event.target.value)}>
            <option>Sem preferência definida</option>
            <option>Quartas 20:30</option>
            <option>Quartas 21:05</option>
            <option>Sábados 09:15</option>
            <option>Posso participar em qualquer janela disponível</option>
          </select>
        </label>
        <label className="field">
          <span>Dias e horários disponíveis</span>
          <textarea name="availability" value={form.availability} onChange={(event) => update("availability", event.target.value)} placeholder="Ex: quartas à noite, sábados pela manhã, datas em que não consigo correr, disponibilidade para chamadas de última hora." required />
        </label>
      </fieldset>

      <fieldset className="form-section">
        <legend>Equipamento</legend>
        <div className="grid-2">
          <label className="field">
            <span>Equipamento disponível</span>
            <select name="equipment" value={form.equipment} onChange={(event) => update("equipment", event.target.value)}>
              <option>Tenho capacete próprio</option>
              <option>Tenho capacete e macacão próprios</option>
              <option>Tenho capacete, macacão, luvas e sapatilha</option>
              <option>Preciso usar equipamento do kartódromo</option>
              <option>Tenho dúvida sobre equipamentos</option>
            </select>
          </label>
          <label className="field">
            <span>Detalhes do equipamento</span>
            <input name="equipmentDetails" value={form.equipmentDetails} onChange={(event) => update("equipmentDetails", event.target.value)} placeholder="Ex: capacete próprio tamanho 58, sem macacão, levo luvas." />
          </label>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Segurança e saúde</legend>
        <div className="grid-2">
          <label className="field">
            <span>Contato de emergência</span>
            <input name="emergencyContactName" value={form.emergencyContactName} onChange={(event) => update("emergencyContactName", event.target.value)} placeholder="Nome completo" autoComplete="off" required />
          </label>
          <label className="field">
            <span>Telefone de emergência</span>
            <input name="emergencyContactPhone" value={form.emergencyContactPhone} onChange={(event) => update("emergencyContactPhone", event.target.value)} placeholder="(21) 99999-9999" autoComplete="tel" required />
          </label>
        </div>
        <div className="grid-3">
          <label className="field">
            <span>Restrições médicas</span>
            <input name="medicalRestrictions" value={form.medicalRestrictions} onChange={(event) => update("medicalRestrictions", event.target.value)} placeholder="Ex: nenhuma, lesão, restrição física." />
          </label>
          <label className="field">
            <span>Alergias</span>
            <input name="allergies" value={form.allergies} onChange={(event) => update("allergies", event.target.value)} placeholder="Ex: nenhuma, medicamento, alimento." />
          </label>
          <label className="field">
            <span>Medicamentos</span>
            <input name="medications" value={form.medications} onChange={(event) => update("medications", event.target.value)} placeholder="Uso contínuo ou eventual." />
          </label>
        </div>
        <label className="field">
          <span>Observações operacionais</span>
          <textarea name="notes" value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Ex: necessidade de orientação especial, restrição de agenda, observação para briefing ou nenhuma." />
        </label>
      </fieldset>

      <fieldset className="form-section form-section-compact">
        <legend>Confirmações obrigatórias</legend>
        <label className="check-field">
          <input type="checkbox" checked={form.acceptedContact} onChange={(event) => update("acceptedContact", event.target.checked)} />
          <span>Autorizo a organização a entrar em contato por WhatsApp ou e-mail para confirmação de vaga, bateria, briefing e orientações do campeonato.</span>
        </label>
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
        <Send size={18} /> Enviar inscrição
      </button>
    </form>
  );
}
