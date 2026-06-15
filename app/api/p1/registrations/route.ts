import { NextResponse } from "next/server";
import { getServiceSupabaseClient } from "@/lib/p1Supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RegistrationPayload = Record<string, unknown>;

const requiredFields = [
  "fullName",
  "cpf",
  "birthDate",
  "whatsapp",
  "email",
  "city",
  "age",
  "weight",
  "availability",
  "emergencyContactName",
  "emergencyContactPhone",
];

export async function POST(request: Request) {
  let payload: RegistrationPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Envie uma inscricao em JSON valido." }, { status: 400 });
  }

  const validationError = validateRegistrationPayload(payload);
  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  try {
    const supabase = getServiceSupabaseClient();
    const { data: championship, error: championshipError } = await supabase
      .from("p1_championships")
      .select("id, whatsapp_number")
      .eq("slug", "legends-2026")
      .single();

    if (championshipError || !championship) {
      return NextResponse.json({ message: "Campeonato Legends 2026 nao encontrado." }, { status: 500 });
    }

    const { data: registration, error } = await supabase
      .from("p1_registrations")
      .insert({
        championship_id: championship.id,
        full_name: text(payload.fullName),
        cpf: text(payload.cpf),
        birth_date: text(payload.birthDate),
        whatsapp: text(payload.whatsapp),
        email: text(payload.email).toLowerCase(),
        city: text(payload.city),
        age: Number(payload.age),
        weight: Number(String(payload.weight).replace(",", ".")),
        experience: text(payload.experience),
        current_level: text(payload.currentLevel),
        availability: text(payload.availability),
        intended_heats: text(payload.intendedHeats),
        ranking_interest: text(payload.rankingInterest),
        preferred_race_windows: text(payload.preferredRaceWindows),
        equipment: text(payload.equipment),
        equipment_details: text(payload.equipmentDetails),
        emergency_contact_name: text(payload.emergencyContactName),
        emergency_contact_phone: text(payload.emergencyContactPhone),
        medical_restrictions: text(payload.medicalRestrictions),
        allergies: text(payload.allergies),
        medications: text(payload.medications),
        goals: text(payload.goals),
        notes: text(payload.notes),
        accepted_contact: Boolean(payload.acceptedContact),
        accepted_rules: Boolean(payload.acceptedRules),
        accepted_responsibility: Boolean(payload.acceptedResponsibility),
        accepted_image: Boolean(payload.acceptedImage),
      })
      .select("id, protocol, status")
      .single();

    if (error || !registration) {
      return NextResponse.json({ message: "Nao foi possivel registrar a inscricao." }, { status: 500 });
    }

    const whatsappMessage = [
      "INSCRICAO LEGENDS KART SERIES",
      `Protocolo: ${registration.protocol}`,
      `Nome: ${text(payload.fullName)}`,
      `WhatsApp: ${text(payload.whatsapp)}`,
      "Status: inscricao recebida para analise da organizacao.",
    ].join("\n");

    return NextResponse.json({
      protocol: registration.protocol,
      status: registration.status,
      whatsappUrl: `https://wa.me/${championship.whatsapp_number}?text=${encodeURIComponent(whatsappMessage)}`,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Supabase nao configurado para inscricoes." }, { status: 503 });
  }
}

function validateRegistrationPayload(payload: RegistrationPayload) {
  const missing = requiredFields.filter((field) => !text(payload[field]));
  if (missing.length > 0) {
    return `Preencha os campos obrigatorios: ${missing.join(", ")}.`;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(payload.email))) {
    return "Informe um e-mail valido.";
  }

  const age = Number(payload.age);
  if (!Number.isFinite(age) || age < 8 || age > 90) {
    return "Informe uma idade valida.";
  }

  const weight = Number(String(payload.weight).replace(",", "."));
  if (!Number.isFinite(weight) || weight < 30 || weight > 180) {
    return "Informe um peso valido.";
  }

  if (!payload.acceptedContact || !payload.acceptedRules || !payload.acceptedResponsibility || !payload.acceptedImage) {
    return "Confirme todos os aceites obrigatorios.";
  }

  return "";
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
