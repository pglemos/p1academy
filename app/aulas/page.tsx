import Link from "next/link";
import {
  Award,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Compass,
  CornerDownRight,
  Flame,
  Gauge,
  HelpCircle,
  Radio,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { MediaFrame } from "@/components/MediaFrame";
import { PageHero } from "@/components/PageHero";
import { Lift, Reveal } from "@/components/Motion";

export const metadata = {
  title: "Aulas de Kart de Alta Performance | P1 Academy",
  description:
    "Aulas de kart personalizadas com o Campeão Brasileiro André Felisberto no Kartódromo Internacional de Betim: do rookie briefing à preparação para campeonatos.",
};

const courseModules = [
  {
    id: "rookie",
    title: "Primeira Bateria & Fundamentos",
    level: "Iniciante / Rookie",
    duration: "1h30 de Imersão",
    label: "Rookie Briefing",
    image: "/images/academy-coaching.png",
    description:
      "Perfeito para quem nunca pilotou ou quer sair do improviso. Foco em postura ergonômica, dosagem de freio, aceleração progressiva e respeito às bandeiras de segurança.",
    deliverables: [
      "Briefing individual de segurança e dinâmica do kart",
      "Ajuste biomecânico de banco, pedais e pegada de volante",
      "Sessão de pista com instrução de freada e tangência",
      "Debriefing pós-bateria com análise dos tempos de volta",
    ],
    highlight: "Ideal para primeira vitória no rental",
  },
  {
    id: "performance",
    title: "Academy Performance & Telemetria",
    level: "Intermediário / Piloto Rental",
    duration: "2h00 com Telemetria",
    label: "Volta Lançada",
    image: "/images/hero-kart-night.png",
    description:
      "Treino focado em baixar tempos de volta de forma consistente. Análise de telemetria setor a setor, trail braking, leitura de aderência e correção de trajetória em curvas de alta.",
    deliverables: [
      "Mapeamento de referências visuais de frenagem em Betim",
      "Análise de delta por setor (S1, S2 e S3) comparado ao instrutor",
      "Gravação onboard e correção de ângulo de volante",
      "Técnica de equalização: como extrair 100% de qualquer kart sorteado",
    ],
    highlight: "Redução média de 1.2s por volta",
  },
  {
    id: "racecraft",
    title: "Racecraft & Grid de Campeonato",
    level: "Competitivo / Legends",
    duration: "2h30 Intensivo de Pista",
    label: "Racecraft",
    image: "/images/competition-corner.png",
    description:
      "Preparação completa para o grid da Legends Kart Series e torneios nacionais. Simulação de largada, defesa de posição sem perda de embalo, ultrapassagem no vácuo e mentalidade de corrida.",
    deliverables: [
      "Simulações reais de largada parada e em movimento",
      "Estratégia de corrida, gerenciamento de pneus e vácuo",
      "Defesa de linha interna e antecipação de acidentes",
      "Planejamento de descarte e pontuação para campeonato",
    ],
    highlight: "Ritmo de disputa roda a roda",
  },
];

const pillars = [
  {
    step: "01",
    icon: Compass,
    title: "Briefing Técnico",
    text: "Alinhamento de metas antes de ligar o motor: traçado do dia, condições de aderência e referências de frenagem.",
  },
  {
    step: "02",
    icon: Radio,
    title: "Condução & Pista",
    text: "Sessão prática no Kartódromo de Betim com acompanhamento visual na mureta e rádio/gestos de correção imediata.",
  },
  {
    step: "03",
    icon: Gauge,
    title: "Telemetria & Vídeo",
    text: "Análise setor a setor dos milésimos com sobreposição de voltas e identificação de onde o tempo está sendo perdido.",
  },
  {
    step: "04",
    icon: Trophy,
    title: "Plano de Evolução",
    text: "Metas claras para a próxima etapa ou campeonato, com exercícios de consistência e acompanhamento contínuo.",
  },
];

export default function AulasPage() {
  return (
    <>
      <PageHero
        title="Aulas de Kart"
        text="Treinamentos personalizados com o Campeão Brasileiro André Felisberto no Kartódromo Internacional de Betim. Transforme freada, tangência e consistência em ritmo de pole position."
        image="/images/academy-coaching.png"
      />

      <section className="section tight">
        <div className="container">
          <Reveal className="section-head center">
            <h2>Módulos de Formação & Treinamento</h2>
            <div className="accent-line" />
            <p>
              Estruturados para atender desde quem está dando a primeira volta de kart até pilotos experientes que buscam o topo do pódio na Legends Kart Series.
            </p>
          </Reveal>

          <div className="grid-3 gap-24">
            {courseModules.map((course) => (
              <Lift className="feature-card course-card" key={course.id}>
                <div className="course-media-wrapper">
                  <MediaFrame label={course.label} src={course.image} alt={course.title} />
                  <span className="course-level-badge">{course.level}</span>
                </div>
                <div className="feature-body">
                  <div className="course-meta-row">
                    <span className="course-duration">
                      <Clock size={14} /> {course.duration}
                    </span>
                    <span className="course-tag">{course.highlight}</span>
                  </div>
                  <h3>{course.title}</h3>
                  <p className="course-desc">{course.description}</p>
                  <div className="course-deliverables">
                    <strong>O que está incluído:</strong>
                    <ul>
                      {course.deliverables.map((item, idx) => (
                        <li key={idx}>
                          <CheckCircle2 size={14} color="var(--gold)" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a className="btn primary course-cta-btn" href="#agendamento">
                    <CalendarCheck size={16} /> Agendar este Treino
                  </a>
                </div>
              </Lift>
            ))}
          </div>
        </div>
      </section>

      <section className="section carbon-section">
        <div className="container">
          <Reveal className="section-head center">
            <h2>O Método dos 4 Pilares da P1</h2>
            <div className="accent-line" />
            <p>Uma metodologia estruturada e repetível para acelerar sua curva de aprendizado sem desperdício de baterias.</p>
          </Reveal>
          <div className="grid-4 gap-20">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Lift className="card pillar-card" key={pillar.title}>
                  <span className="pillar-step">{pillar.step}</span>
                  <Icon size={28} color="var(--acid)" className="mb-12" />
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </Lift>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section tight" id="agendamento">
        <div className="container grid-2 align-start">
          <Reveal className="section-head">
            <h2>Reserve Sua Sessão na Pista</h2>
            <div className="accent-line" />
            <p>
              Preencha os dados abaixo para receber as datas disponíveis, horários de pista e confirmação direta com André Felisberto via WhatsApp.
            </p>
            <div className="card p-20 mb-24">
              <h4 className="mb-8">Informações Importantes:</h4>
              <ul className="check-list">
                <li>Local das aulas: Kartódromo Internacional de Betim (MG)</li>
                <li>Equipamentos fornecidos: Lastro, capacete homologado (se necessário)</li>
                <li>Atendimento individual ou em grupos fechados de até 4 pilotos</li>
                <li>Datas flexíveis durante a semana e finais de semana</li>
              </ul>
            </div>
            <div className="button-row">
              <Link className="btn secondary" href="/andre-felisberto">
                <Trophy size={18} /> Conhecer André Felisberto
              </Link>
              <Link className="btn ghost" href="/dicas">
                <Zap size={18} /> Ver Dicas de Pilotagem
              </Link>
            </div>
          </Reveal>
          <BookingForm />
        </div>
      </section>
    </>
  );
}
