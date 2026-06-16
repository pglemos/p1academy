import { NextResponse } from "next/server";
import { isAdminContext, requireP1Admin } from "@/lib/p1Admin";
import { getServiceSupabaseClient } from "@/lib/p1Supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ManualRegistrationPayload = Record<string, unknown>;

export async function POST(request: Request) {
  const admin = await requireP1Admin(request);
  if (!isAdminContext(admin)) {
    return admin;
  }

  let payload: ManualRegistrationPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Envie os dados em JSON valido." }, { status: 400 });
  }

  const fullName = text(payload.fullName);
  const whatsapp = text(payload.whatsapp);
  const email = text(payload.email);

  if (!fullName || !whatsapp || !email) {
    return NextResponse.json({ message: "Nome, WhatsApp e e-mail sao obrigatorios." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: "Informe um e-mail valido." }, { status: 400 });
  }

  const supabase = getServiceSupabaseClient();
  const { data: championship, error: championshipError } = await supabase
    .from("p1_championships")
    .select("id")
    .eq("slug", "legends-2026")
    .single();

  if (championshipError || !championship) {
    return NextResponse.json({ message: "Campeonato nao encontrado." }, { status: 500 });
  }

  const age = Number(payload.age) || null;
  const weight = payload.weight ? Number(String(payload.weight).replace(",", ".")) : null;

  const { data: registration, error } = await supabase
    .from("p1_registrations")
    .insert({
      championship_id: championship.id,
      full_name: fullName,
      cpf: text(payload.cpf) || "",
      birth_date: text(payload.birthDate) || null,
      whatsapp,
      email: email.toLowerCase(),
      city: text(payload.city),
      age,
      weight,
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
      accepted_contact: true,
      accepted_rules: true,
      accepted_responsibility: true,
      accepted_image: true,
      admin_notes: `Inscrição manual criada por ${admin.email}`,
    })
    .select("id, protocol, status")
    .single();

  if (error || !registration) {
    return NextResponse.json({ message: "Nao foi possivel criar a inscricao." }, { status: 500 });
  }

  return NextResponse.json({ registration }, { status: 201 });
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
