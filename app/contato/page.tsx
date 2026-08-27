import {
  CalendarCheck,
  Camera,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  Handshake,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
  Radio,
  Trophy,
} from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { PageHero } from "@/components/PageHero";
import { Lift, Reveal } from "@/components/Motion";
import {
  contactName,
  instagramHandle,
  instagramUrl,
  mapUrl,
  trackAddress,
  whatsappDisplay,
  whatsappNumber,
} from "@/data/site";

export const metadata = {
  title: "Contato & Agendamento de Pista | P1 Academy",
  description:
    "Fale com a equipe da P1 Academy e André Felisberto. Agende aulas de kart, tire dúvidas sobre a Legends Kart Series e envie propostas de patrocínio.",
};

const directChannels = [
  {
    icon: MessageCircle,
    tag: "Resposta Imediata",
    title: "WhatsApp Oficial",
    desc: `Atendimento direto com ${contactName} para agendamento de aulas, vagas de grid e dúvidas técnicas.`,
    actionText: `Chamar ${whatsappDisplay}`,
    href: `https://wa.me/${whatsappNumber}?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20as%20aulas%20e%20campeonatos%20da%20P1%20Academy.`,
    isExternal: true,
  },
  {
    icon: Camera,
    tag: "Comunidade & Bastidores",
    title: "Instagram",
    desc: "Acompanhe coberturas de baterias, voltas rápidas, stories de dia de corrida e anúncios de novas turmas.",
    actionText: `Seguir ${instagramHandle}`,
    href: instagramUrl,
    isExternal: true,
  },
  {
    icon: MapPin,
    tag: "Sede de Pista",
    title: "Kartódromo de Betim",
    desc: trackAddress,
    actionText: "Abrir Rota no Google Maps",
    href: mapUrl,
    isExternal: true,
  },
];

export default function ContatoPage() {
  return (
    <>
      <PageHero
        title="Canais de Contato"
        text="Agende treinos práticos, confirme sua vaga na Legends Kart Series ou envie uma mensagem direta para a comissão técnica da P1 Academy."
        image="/images/academy-coaching.png"
      />

      <section className="section tight">
        <div className="container grid-2 align-start gap-32">
          <Reveal className="grid-1 gap-20">
            <div className="p1-hero-record-banner p-20 mb-0">
              <div className="record-banner-left">
                <span className="record-badge">🟢 Atendimento Online</span>
                <h3 className="text-white m-0 text-xl font-bold">Fale Direto com André Felisberto</h3>
                <p className="text-muted text-sm mt-4">
                  Retorno médio em menos de 1 hora para agendamentos e informações de etapas.
                </p>
              </div>
            </div>

            {directChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <Lift className="card" key={channel.title}>
                  <div className="tip-header">
                    <span className="tip-tag">{channel.tag}</span>
                    <Icon className="tip-icon" size={24} color="var(--gold)" />
                  </div>
                  <h3>{channel.title}</h3>
                  <p className="text-muted text-sm mb-16">{channel.desc}</p>
                  <a
                    className="btn primary"
                    href={channel.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={channel.actionText}
                  >
                    <Icon size={16} /> {channel.actionText}
                  </a>
                </Lift>
              );
            })}
          </Reveal>

          <Reveal>
            <div className="section-head mb-20">
              <h2>Formulário de Solicitação</h2>
              <div className="accent-line" />
              <p>Envie seus dados para receber a grade de horários disponíveis e o valor dos pacotes de aula.</p>
            </div>
            <BookingForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
