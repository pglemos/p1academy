"use client";

import { CalendarCheck, Send } from "lucide-react";
import { FormEvent, useState } from "react";
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
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function update(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.phone.trim() || !form.schedule.trim()) {
      setError("Preencha nome, WhatsApp e preferência de data ou horário.");
      return;
    }

    const message = [
      "Olá, P1 Academy. Quero agendar uma experiência.",
      "",
      `Nome: ${form.name}`,
      `WhatsApp: ${form.phone}`,
      `Interesse: ${form.interest}`,
      `Experiência: ${form.experience}`,
      `Preferência: ${form.schedule}`,
      `Observações: ${form.notes || "Sem observações"}`,
      "",
      `Contato: ${contactName}`,
      `Local: ${trackAddress}`,
    ].join("\n");

    setSuccess("Mensagem pronta. O WhatsApp será aberto para confirmar o envio.");
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="form card" onSubmit={handleSubmit}>
      <h3>
        <CalendarCheck size={22} /> Agendamento P1
      </h3>
      <div className="grid-2">
        <label className="field">
          <span>Nome</span>
          <input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Seu nome" />
        </label>
        <label className="field">
          <span>WhatsApp</span>
          <input value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="(21) 99596-0077" />
        </label>
      </div>
      <div className="grid-2">
        <label className="field">
          <span>Interesse</span>
          <select value={form.interest} onChange={(event) => update("interest", event.target.value)}>
            <option>Aulas P1 Academy</option>
            <option>Bateria avulsa</option>
            <option>Campeonatos</option>
            <option>Evento corporativo</option>
            <option>Patrocínio</option>
          </select>
        </label>
        <label className="field">
          <span>Experiência</span>
          <select value={form.experience} onChange={(event) => update("experience", event.target.value)}>
            <option>Primeira vez</option>
            <option>Já andei algumas vezes</option>
            <option>Participo de campeonatos</option>
            <option>Quero treinar performance</option>
          </select>
        </label>
      </div>
      <label className="field">
        <span>Preferência de data ou horário</span>
        <input value={form.schedule} onChange={(event) => update("schedule", event.target.value)} placeholder="Ex: sábado pela manhã" />
      </label>
      <label className="field">
        <span>Observações</span>
        <textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Conte objetivo, grupo, idade ou meta na pista." />
      </label>
      {error ? <p className="error">{error}</p> : null}
      {success ? <p className="success">{success}</p> : null}
      <button className="btn primary" type="submit">
        <Send size={18} /> Enviar para WhatsApp
      </button>
    </form>
  );
}
