"use client";

import { CalendarCheck, CheckCircle2, Send, TriangleAlert } from "lucide-react";
import { FormEvent, useId, useState } from "react";
import { contactName, trackAddress, whatsappNumber } from "@/data/site";

type FormState = {
  name: string;
  phone: string;
  interest: string;
  experience: string;
  schedule: string;
  notes: string;
};

const initialState: FormState = {
  name: "",
  phone: "",
  interest: "Aulas P1 Academy",
  experience: "Primeira vez",
  schedule: "",
  notes: "",
};

export function BookingForm() {
  const formId = useId();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function update(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (error) setError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.phone.trim() || !form.schedule.trim()) {
      setError("Por favor, preencha os campos obrigatórios: Nome, WhatsApp e Preferência de data/horário.");
      return;
    }

    const message = [
      "Olá, P1 Academy. Quero agendar uma experiência.",
      "",
      `Nome: ${form.name.trim()}`,
      `WhatsApp: ${form.phone.trim()}`,
      `Interesse: ${form.interest}`,
      `Experiência: ${form.experience}`,
      `Preferência: ${form.schedule.trim()}`,
      `Observações: ${form.notes.trim() || "Sem observações"}`,
      "",
      `Contato: ${contactName}`,
      `Local: ${trackAddress}`,
    ].join("\n");

    setSuccess("Mensagem formatada com sucesso. Redirecionando para o WhatsApp oficial...");
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate aria-labelledby={`${formId}-title`}>
      <h3 id={`${formId}-title`}>
        <CalendarCheck size={22} /> Agendamento P1
      </h3>

      <div className="grid-2">
        <div className="field">
          <label htmlFor={`${formId}-name`}>
            <span>Nome completo *</span>
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="Seu nome"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={Boolean(error && !form.name.trim())}
          />
        </div>

        <div className="field">
          <label htmlFor={`${formId}-phone`}>
            <span>WhatsApp com DDD *</span>
          </label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            placeholder="(31) 99999-9999"
            autoComplete="tel"
            required
            aria-required="true"
            aria-invalid={Boolean(error && !form.phone.trim())}
          />
        </div>
      </div>

      <div className="grid-2">
        <div className="field">
          <label htmlFor={`${formId}-interest`}>
            <span>Interesse principal</span>
          </label>
          <select
            id={`${formId}-interest`}
            name="interest"
            value={form.interest}
            onChange={(event) => update("interest", event.target.value)}
          >
            <option>Aulas P1 Academy</option>
            <option>Bateria avulsa</option>
            <option>Campeonatos</option>
            <option>Evento corporativo</option>
            <option>Patrocínio</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor={`${formId}-experience`}>
            <span>Nível de experiência</span>
          </label>
          <select
            id={`${formId}-experience`}
            name="experience"
            value={form.experience}
            onChange={(event) => update("experience", event.target.value)}
          >
            <option>Primeira vez</option>
            <option>Já andei algumas vezes</option>
            <option>Participo de campeonatos</option>
            <option>Quero treinar performance</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor={`${formId}-schedule`}>
          <span>Preferência de data ou horário *</span>
        </label>
        <input
          id={`${formId}-schedule`}
          name="schedule"
          type="text"
          value={form.schedule}
          onChange={(event) => update("schedule", event.target.value)}
          placeholder="Ex: Sábado pela manhã ou Quinta à noite"
          required
          aria-required="true"
          aria-invalid={Boolean(error && !form.schedule.trim())}
        />
      </div>

      <div className="field">
        <label htmlFor={`${formId}-notes`}>
          <span>Observações adicionais</span>
        </label>
        <textarea
          id={`${formId}-notes`}
          name="notes"
          value={form.notes}
          onChange={(event) => update("notes", event.target.value)}
          placeholder="Conte seu objetivo, grupo de amigos, idade ou meta na pista."
          rows={3}
        />
      </div>

      {error ? (
        <p className="error" role="alert" aria-live="assertive">
          <TriangleAlert size={16} /> {error}
        </p>
      ) : null}

      {success ? (
        <p className="success" role="status" aria-live="polite">
          <CheckCircle2 size={16} /> {success}
        </p>
      ) : null}

      <button className="btn primary" type="submit">
        <Send size={18} /> Confirmar & Abrir WhatsApp
      </button>
    </form>
  );
}
