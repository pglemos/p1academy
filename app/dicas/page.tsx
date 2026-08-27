import Link from "next/link";
import {
  Award,
  CalendarCheck,
  Compass,
  CornerDownRight,
  Flame,
  Gauge,
  HelpCircle,
  Maximize2,
  MoveUpRight,
  RotateCcw,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Lift, Reveal } from "@/components/Motion";

export const metadata = {
  title: "Dicas de Pilotagem & Telemetria | P1 Academy",
  description:
    "Técnicas essenciais de kartismo: frenagem, tangência, transferência de carga, leitura de equalização e consistência com o campeão brasileiro André Felisberto.",
};

const technicalGuides = [
  {
    icon: Gauge,
    step: "01",
    tag: "Frenagem",
    title: "Freada em Linha & Trail Braking",
    summary:
      "A freada deve ser forte e direta com o volante reto. Reduza a pressão progressivamente conforme aponta o kart para a entrada da curva para evitar o travamento do eixo traseiro.",
    takeaways: [
      "Aplique 100% de pressão inicial no ponto de referência e alivie na aproximação",
      "Não esterce o volante com pé fundo no freio no kart rental (risco de rodada instantânea)",
      "Carregue a velocidade mínima ideal sem estrangular o motor 4 tempos na saída",
    ],
  },
  {
    icon: Compass,
    step: "02",
    tag: "Geometria de Pista",
    title: "Ápice Tardio vs. Ápice Geométrico",
    summary:
      "A velocidade em reta nasce na tração de saída. Em curvas que antecedem retas longas, atrase a tomada (late apex) para acelerar mais cedo com o kart já alinhado.",
    takeaways: [
      "Ápice geométrico em curvas de alta velocidade e chicanes rápidas",
      "Ápice tardio em grampos e curvas que antecedem as retas principais",
      "Olhe sempre para onde você quer colocar o kart 2 segundos à frente",
    ],
  },
  {
    icon: Zap,
    step: "03",
    tag: "Dinâmica do Kart",
    title: "Transferência de Carga & Postura",
    summary:
      "Karts de locação não têm suspensão ou diferencial. O peso do seu corpo atua diretamente como peso suspenso sobre os pneus externos.",
    takeaways: [
      "Mantenha as costas firmes contra o banco; não se incline para o lado de dentro da curva",
      "Nas curvas fechadas, apoie o peso suavemente no pneu dianteiro externo",
      "Mãos nas posições 9h15 no volante, com pegada firme mas sem tensão excessiva nos ombros",
    ],
  },
  {
    icon: RotateCcw,
    step: "04",
    tag: "Diagnóstico",
    title: "Leitura de Equalização nas Primeiras Voltas",
    summary:
      "Cada kart rental tem comportamento único de motor e alinhamento. Use a volta de aquecimento e as duas primeiras voltas rápidas para mapear o comportamento.",
    takeaways: [
      "Se o kart sai de frente (subesterço): freie 1 metro mais cedo e aponte mais agressivo",
      "Se o kart sai de traseira (sobre-esterço): seja mais suave no volante e evite solavancos",
      "Monitore o torque em subidas e ajuste sua linha para carregar mais embalo",
    ],
  },
  {
    icon: Flame,
    step: "05",
    tag: "Racecraft",
    title: "Ultrapassagem & Defesa Sustentável",
    summary:
      "Ultrapassagem limpa se constrói na aproximação. Posicione o bico do kart na zona cega do adversário antes da freada para garantir a linha interna com segurança.",
    takeaways: [
      "Evite toques laterais: no kart indoor, qualquer batida reduz a rotação do motor de ambos",
      "Defenda a linha interna nas curvas-chave sem fazer ziguezague ilegal",
      "Observe os pontos fracos do adversário duas voltas antes de lançar o ataque definitivo",
    ],
  },
  {
    icon: Award,
    step: "06",
    tag: "Performance",
    title: "Consistência de Milésimos",
    summary:
      "Vence quem comete menos erros. Um piloto que vira 15 voltas no mesmo décimo supera aquele que faz uma única volta rápida e erra nas demais.",
    takeaways: [
      "Defina marcos visuais físicos fixos na pista (zebras, postes, manchas de asfalto)",
      "Mantenha o mesmo ritmo respiratório para preservar a concentração sob calor",
      "Anote seus setores de volta e compare com os tempos de referência da P1",
    ],
  },
];

export default function DicasPage() {
  return (
    <>
      <PageHero
        title="Dicas de Pilotagem"
        text="Técnica automobilística aplicada ao kartismo rental e de competição. Métodos comprovados para reduzir tempos de volta, conservar pneus e disputar posições com maestria."
        image="/images/academy-coaching.png"
      />

      <section className="section tight">
        <div className="container">
          <Reveal className="section-head center">
            <h2>Fundamentos de Alta Performance</h2>
            <div className="accent-line" />
            <p>
              Desenvolvido a partir da vivência prática de títulos nacionais com André Felisberto. Cada módulo foca nos detalhes que separam o piloto amador do grid profissional.
            </p>
          </Reveal>

          <div className="grid-2 gap-24">
            {technicalGuides.map((guide) => {
              const Icon = guide.icon;
              return (
                <Lift className="card technical-tip-card" key={guide.title}>
                  <div className="tip-header">
                    <span className="tip-step">{guide.step}</span>
                    <span className="tip-tag">{guide.tag}</span>
                    <Icon className="tip-icon" size={24} color="var(--gold)" />
                  </div>
                  <h3>{guide.title}</h3>
                  <p className="tip-summary">{guide.summary}</p>
                  <div className="tip-takeaways">
                    <strong>Pontos-chave na pista:</strong>
                    <ul>
                      {guide.takeaways.map((item, idx) => (
                        <li key={idx}>
                          <CornerDownRight size={14} color="var(--acid)" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Lift>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section carbon-section">
        <div className="container grid-2 align-center">
          <Reveal className="section-head">
            <h2>Evolua na Prática com Mentoria de Pista</h2>
            <div className="accent-line" />
            <p>
              Ler a teoria é o primeiro passo. Ajustar a freada com cronometragem em tempo real, telemetria de setores e rádio no box com André Felisberto transforma o seu resultado na Legends Kart Series.
            </p>
            <div className="button-row">
              <Link className="btn primary" href="/aulas">
                <CalendarCheck size={18} /> Conhecer Aulas da P1
              </Link>
              <Link className="btn secondary" href="/tracados">
                <Compass size={18} /> Estudar Traçados de Betim
              </Link>
            </div>
          </Reveal>
          <Reveal className="legends-panel">
            <h3>Diagnóstico Individual</h3>
            <p>
              Durante os treinos práticos, avaliamos:
            </p>
            <ul className="check-list">
              <li>Delta de freada e desaceleração nos setores mais técnicos</li>
              <li>Pressão de volante e correção de trajetória em curvas de alta</li>
              <li>Consistência de volta em simulação de corrida de 15 a 25 minutos</li>
              <li>Equalização de kart e escolha de linhas alternativas com chuva/pista fria</li>
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
