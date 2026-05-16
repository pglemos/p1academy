"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  Award,
  Camera,
  ExternalLink,
  Flag,
  Gauge,
  Medal,
  ShieldCheck,
  Sparkles,
  Trophy,
  Wrench,
} from "lucide-react";
import Image from "next/image";

const highlights = [
  { label: "Rio Kart Cup", value: "Campeão", detail: "Sênior 2025" },
  { label: "Ranking nacional", value: "Vice", detail: "Sênior 40+ 2024" },
  { label: "Copa Brasil", value: "Vice", detail: "Pesados 2023" },
  { label: "Instagram", value: "239", detail: "posts públicos" },
];

const timeline = [
  {
    year: "2018",
    title: "Carioca de Kart Indoor Mihaly Hidasy",
    text: "No Kart Indoor Nova América, André aparece nas disputas da Interclubes com primeira fila, pole na segunda tomada e vitória de bateria. A cobertura também registra sua participação técnica antes dos eventos, equalizando karts.",
  },
  {
    year: "2019",
    title: "Festival Brasileiro de Kart Rental",
    text: "Nos resultados oficiais da edição disputada na Granja Viana, figura na categoria Sênior, com top 10 no quadro geral da categoria, e também aparece no Master.",
  },
  {
    year: "2022",
    title: "NKR em crescimento nacional",
    text: "Após cinco etapas do Nacional de Kart Rental, o Portal do Kart Indoor registrava André Felisberto em segundo na categoria Sênior, com 228 pontos.",
  },
  {
    year: "2023",
    title: "Copa Brasil e Copa KMKZY",
    text: "Na 12ª Copa Brasil de Kart Indoor, em Volta Redonda, foi vice da categoria Pesado. No mesmo ciclo competitivo, terminou em quinto na Sênior da Copa KMKZY/NKR, empatado em 123 pontos.",
  },
  {
    year: "2024",
    title: "Top nacional Sênior 40+",
    text: "Fechou o ano como vice-campeão do ranking brasileiro de kart rental na categoria Sênior 40+, somando 3.216 pontos segundo levantamento publicado pela Folha Vitória.",
  },
  {
    year: "2025",
    title: "Título no Rio Kart Cup",
    text: "Conquistou a categoria Sênior do Rio Kart Cup em Guaratinguetá, após recuperação e disputa direta com Chico Lopes. A classificação pública do evento lista André com 148 pontos.",
  },
];

const achievements = [
  {
    icon: Trophy,
    title: "Campeão Rio Kart Cup 2025",
    text: "Título Sênior em evento realizado no Kartódromo de Guaratinguetá-SP, com recuperação competitiva na final.",
  },
  {
    icon: Medal,
    title: "Vice brasileiro Sênior 40+",
    text: "3.216 pontos no ranking nacional de kart rental em 2024, atrás apenas do campeão da temporada na categoria.",
  },
  {
    icon: Award,
    title: "Vice Copa Brasil Pesados",
    text: "Resultado de destaque na 12ª Copa Brasil de Kart Indoor, disputada em Volta Redonda com 180 pilotos de 13 estados.",
  },
  {
    icon: Gauge,
    title: "Pole e ritmo de bateria",
    text: "Registros de pole, vitória e melhoras constantes em séries de Copa Brasil, Carioca e eventos ranqueados pelo NKR.",
  },
  {
    icon: Wrench,
    title: "Leitura técnica de kart",
    text: "Além da pilotagem, há registro público de trabalho de equalização de karts antes de etapas, um diferencial raro no kart rental.",
  },
  {
    icon: ShieldCheck,
    title: "Referência para pilotos",
    text: "Trajetória construída em disputa limpa, consistência, preparação e experiência suficiente para orientar novos pilotos.",
  },
];

const competitions = [
  ["Rio Kart Cup 2025", "Sênior", "1º lugar / 148 pts"],
  ["Ranking brasileiro 2024", "Sênior 40+", "2º lugar / 3.216 pts"],
  ["Copa Brasil 2024", "Sênior", "P1 em bateria / pole position"],
  ["Copa Brasil 2023", "Pesados", "Vice-campeão"],
  ["Copa KMKZY/NKR 2023", "Sênior", "5º lugar / 123 pts"],
  ["NKR 2022", "Sênior", "2º parcial após 5 etapas"],
  ["Festival Brasileiro 2019", "Sênior", "Top 10 em resultados oficiais"],
  ["Carioca Indoor 2018", "Interclubes", "Pole, pódio e vitória de bateria"],
];

const profileFacts = [
  "Piloto do Rio de Janeiro em competições de kart rental.",
  "Atuação recorrente em categorias Sênior, Pesados e Master.",
  "Associado a grids nacionais, eventos NKR, Copa Brasil e Rio Kart Cup.",
  "Perfil público @a_felisberto_ com 239 posts e biografia motivacional verificada em 16/05/2026.",
];

const racePrinciples = [
  ["Velocidade", "Ritmo sustentado, tomada limpa e leitura de tráfego antes da volta heroica."],
  ["Foco", "Decisão curta: referência de freada, ápice, saída e defesa sem desperdício de volante."],
  ["Dedicação", "Preparação fora do kart, repertório de pista e atenção ao equipamento antes da largada."],
  ["Superação", "Recuperação em final, pressão de campeonato e capacidade de transformar revés em corrida."],
];

const sources = [
  ["Instagram público", "https://www.instagram.com/a_felisberto_/"],
  ["Fato 360 - Rio Kart Cup 2025", "https://fato360.com/rio-kart-cup-guaratingueta-campeoes/"],
  ["Brasil Kart - Rio Kart Cup", "https://brasilkart.com.br/riokartcup/"],
  ["Folha Vitória - Ranking brasileiro 2024", "https://www.folhavitoria.com.br/esportes/piloto-capixaba-fecha-o-ano-no-top-3-do-kart-nacional/"],
  ["Correio da Manhã - Copa Brasil 2023", "https://www.correiodamanha.com.br/esportes/2023/05/58627-kart-de-volta-redonda.html"],
  ["Portal do Kart Indoor - NKR 2022", "https://www.portaldokartindoor.com.br/ranking-do-nkr-atualizado/"],
  ["Portal do Kart Indoor - Carioca 2018", "https://www.portaldokartindoor.com.br/3a-etapa-final-do-carioca-de-kart-indoor-mihaly-hidasy-2018/"],
  ["Push to Cast - Copa KMKZY 2023", "https://pushtocast.com.br/2023/08/10/kart-rental-gauchos-levam-todos-os-titulos-da-copa-kmkzy/"],
  ["Resultados oficiais 2019", "https://brasileirodekartrental.com.br/file/arquivo/131_resultados_2019.pdf"],
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export function AndreFelisbertoShowcase() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.45], [0, -90]);
  const heroScale = useTransform(scrollYProgress, [0, 0.45], [1, 1.08]);

  return (
    <>
      <section className="andre-hero">
        <motion.div className="andre-hero-bg" style={{ y: heroY, scale: heroScale }} aria-hidden="true">
          <Image
            src="/andre/andre-felisberto-poster.png"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </motion.div>
        <div className="andre-hero-overlay" />
        <div className="container andre-hero-grid">
          <motion.div
            className="andre-hero-copy"
            variants={reveal}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="eyebrow">Dossiê de piloto</span>
            <h1>André Felisberto</h1>
            <p>
              No volante, nos boxes e no briefing: um piloto carioca de kart rental que transformou experiência, leitura técnica e consistência em assinatura de pista.
            </p>
            <div className="andre-slogan">
              <Flag size={18} />
              Velocidade · Foco · Dedicação · Superação
            </div>
            <motion.div
              className="andre-signature-lockup"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52, duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
            >
              <span>Assinatura original do pôster</span>
              <div className="andre-signature-crop" aria-label="Assinatura André Felisberto" />
            </motion.div>
          </motion.div>

          <motion.div
            className="andre-scoreboard"
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {highlights.map((item, index) => (
              <motion.div
                className="andre-score"
                key={item.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.08, duration: 0.45 }}
              >
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <small>{item.detail}</small>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section andre-profile-section">
        <div className="container andre-profile-grid">
          <motion.div className="andre-biography" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.65 }}>
            <div className="section-head">
              <h2>Biografia completa</h2>
              <div className="accent-line" />
            </div>
            <p>
              André Felisberto aparece em fontes públicas como piloto do Rio de Janeiro no kart rental brasileiro, com trajetória que atravessa campeonatos cariocas, Copa Brasil, Ranking Nacional de Kart Rental, Festival Brasileiro, Copa KMKZY e Rio Kart Cup. A leitura da carreira mostra um competidor que amadureceu em categorias de alta pressão, especialmente Sênior e Pesados, onde consistência vale tanto quanto volta rápida.
            </p>
            <p>
              O diferencial da história não está só nos pódios. Em 2018, reportagens do Portal do Kart Indoor registraram André disputando a Interclubes no Nova América e também trabalhando antes das etapas na equalização dos karts. Essa combinação de piloto e técnico explica a assinatura que a P1 Academy pode comunicar: não é apenas acelerar, é entender equipamento, pista, estratégia e comportamento de corrida.
            </p>
            <p>
              A fase recente consolida essa reputação. Em 2023, foi vice da categoria Pesados na Copa Brasil em Volta Redonda. Em 2024, fechou o ranking brasileiro Sênior 40+ como vice-campeão nacional com 3.216 pontos. Em 2025, conquistou o Rio Kart Cup Sênior depois de uma recuperação descrita como decisiva na disputa com Chico Lopes.
            </p>
          </motion.div>

          <motion.aside className="andre-profile-card" initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.1 }}>
            <div className="andre-profile-photo">
              <Image src="/andre/andre-felisberto-poster.png" alt="Pôster premium de André Felisberto com kart, capacete e assinatura" fill sizes="(max-width: 980px) 100vw, 36vw" />
            </div>
            <div className="andre-profile-body">
              <div className="andre-profile-kicker">
                <Camera size={22} />
                <span>@a_felisberto_</span>
              </div>
              <h3>Marca pessoal</h3>
              <div className="andre-signature-crop andre-signature-card-mark" aria-label="Assinatura André Felisberto" />
              <p>&quot;Viva cada dia intensamente como se fosse o último dia da sua vida. Um dia você acerta!&quot;</p>
              <dl>
                <div><dt>Posts</dt><dd>239</dd></div>
                <div><dt>Seguidores</dt><dd>2.214</dd></div>
                <div><dt>Seguindo</dt><dd>5.413</dd></div>
              </dl>
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="section carbon-section andre-timeline-section">
        <div className="container">
          <motion.div className="section-head center" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2>Trajetória por temporada</h2>
            <div className="accent-line" />
            <p>Resumo cronológico com base nos registros públicos encontrados em portais, classificações e resultados oficiais.</p>
          </motion.div>
          <div className="andre-timeline">
            {timeline.map((item, index) => (
              <motion.article
                className="andre-timeline-item"
                key={`${item.year}-${item.title}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -34 : 34 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
              >
                <span>{item.year}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section andre-manifesto-section">
        <div className="container andre-manifesto-grid">
          <motion.div className="andre-manifesto-poster" initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            <Image src="/andre/andre-felisberto-poster.png" alt="Arte de identidade visual de André Felisberto com retrato, kart e assinatura" fill sizes="(max-width: 980px) 100vw, 44vw" />
          </motion.div>
          <motion.div className="andre-manifesto-copy" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.65 }}>
            <span className="eyebrow">Manifesto de pista</span>
            <h2>Não é sorte quando a volta encaixa.</h2>
            <p>
              A assinatura de André Felisberto nasce na soma entre instinto e método: chegar cedo, observar o kart, entender onde a pista muda, controlar a pressão e atacar quando a corrida abre espaço. É uma trajetória de rental kart com cara de automobilismo: detalhe, presença e execução.
            </p>
            <div className="andre-principles">
              {racePrinciples.map(([title, text]) => (
                <article key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <motion.div className="section-head" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2>Campeonatos e experiências</h2>
            <div className="accent-line" />
            <p>Os resultados formam uma narrativa de piloto completo: sprint, ranking nacional, final de campeonato, categoria por peso, categoria por idade e bastidores técnicos de preparação.</p>
          </motion.div>

          <div className="andre-achievement-grid">
            {achievements.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  className="andre-achievement"
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.42, delay: index * 0.04 }}
                >
                  <Icon size={26} />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section tight andre-results-section">
        <div className="container andre-results-grid">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="section-head">
              <h2>Mapa de resultados</h2>
              <div className="accent-line" />
              <p>Recorte dos principais registros competitivos localizados. A página evita dados pessoais de inscrição e mantém apenas informações esportivas públicas.</p>
            </div>
            <div className="andre-fact-list">
              {profileFacts.map((fact) => (
                <span key={fact}>
                  <Sparkles size={16} />
                  {fact}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div className="andre-results-table" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            {competitions.map(([event, category, result]) => (
              <div className="andre-result-row" key={`${event}-${category}`}>
                <strong>{event}</strong>
                <span>{category}</span>
                <em>{result}</em>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section andre-sources-section">
        <div className="container">
          <motion.div className="section-head center" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2>Fontes consultadas</h2>
            <div className="accent-line" />
            <p>Levantamento feito em 16/05/2026 a partir de páginas públicas, resultados oficiais e metadados acessíveis do Instagram.</p>
          </motion.div>
          <div className="andre-source-grid">
            {sources.map(([label, href]) => (
              <motion.a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="andre-source-link"
                key={href}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.18 }}
              >
                <span>{label}</span>
                <ExternalLink size={16} />
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
