import Image from "next/image";
import Link from "next/link";
import { Award, CalendarDays, Download, Flag, Gauge, MapPin, ShieldCheck, Trophy } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Motion";
import {
  legendsAchievements,
  legendsCompetition,
  legendsCurrentEdition,
  legendsLevels,
  legendsPdf,
  legendsPhotoSets,
  legendsRankingPreview,
  legendsResultsPreview,
  legendsSections,
  legendsSponsors,
  legendsStageInfo,
  legendsStats,
  legendsStory,
  legendsSummary,
} from "@/data/legends";

export const metadata = {
  title: "Legends Kart Series | P1 Academy",
};

export default function CompeticoesPage() {
  return (
    <>
      <PageHero
        title="Legends Kart Series"
        text="1ª edição oficial do campeonato semestral de rental kart da P1 Academy. Categoria única, tomada de tempo, lastro-base de 100 kg e sede oficial no Kartódromo Internacional de Betim."
        image="/images/competition-corner.png"
      />

      <section className="section tight">
        <div className="container legends-shell">
          <Reveal className="legends-status">
            <div>
              <span className="eyebrow">{legendsCompetition.status}</span>
              <h2>{legendsCompetition.edition}</h2>
              <p>
                Campeonato e grupo de treinos em formato semestral, com baterias avulsas ao longo da temporada. O piloto participa das corridas que quiser, conforme disponibilidade de vaga e aceite da organização.
              </p>
            </div>
            <div className="button-row">
              <Link className="btn primary" href="/contato">
                Quero participar
              </Link>
              <a className="btn secondary" href={legendsPdf} target="_blank" rel="noreferrer">
                <Download size={18} /> Regulamento
              </a>
            </div>
          </Reveal>

          <nav className="legends-tabs" aria-label="Abas da Legends Kart Series">
            {legendsSections.map((section) => (
              <a href={section.href} key={section.href}>
                {section.label}
              </a>
            ))}
          </nav>

          <div className="legends-metrics">
            {legendsStats.map((stat) => (
              <div className="metric-card" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section carbon-section">
        <div className="container grid-2 align-start">
          <Reveal className="section-head">
            <h2>Sobre a Legends</h2>
            <div className="accent-line" />
            <p>{legendsStory[0]}</p>
            <p>{legendsStory[1]}</p>
          </Reveal>
          <div className="grid-1">
            {legendsSummary.map((item) => (
              <Reveal className="card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container grid-2 align-start">
          <Reveal className="section-head">
            <h2>História</h2>
            <div className="accent-line" />
            {legendsStory.slice(2).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
          <Reveal className="legends-panel">
            <MapPin size={28} color="var(--acid)" />
            <h3>Sede oficial</h3>
            <p>{legendsCompetition.venue}</p>
            <p>{legendsCompetition.address}</p>
            <p>
              Organização geral: {legendsCompetition.organizer} - WhatsApp {legendsCompetition.whatsapp}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <Reveal className="section-head center">
            <h2>Edição atual</h2>
            <div className="accent-line" />
          </Reveal>
          <div className="details-grid">
            {legendsCurrentEdition.map(([label, value]) => (
              <div className="detail-row" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section carbon-section" id="classificacao">
        <div className="container split">
          <Reveal className="section-head">
            <Trophy size={30} color="var(--acid)" />
            <h2>Classificação geral</h2>
            <div className="accent-line" />
            <p>Ranking dos pilotos com base nas melhores pontuações válidas ao longo da temporada. Cada piloto terá considerados seus melhores resultados, com limite de 10 corridas válidas para pontuação regular.</p>
          </Reveal>
          <div className="table-like">
            {legendsRankingPreview.map((item) => (
              <Reveal className="row" key={`${item.position}-${item.driver}`}>
                <strong>{item.position} {item.driver}</strong>
                <span>{item.level}</span>
                <span>{item.points} pontos</span>
                <span>{item.valid}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight" id="resultados">
        <div className="container split">
          <Reveal className="section-head">
            <Gauge size={30} color="var(--acid)" />
            <h2>Resultados das etapas</h2>
            <div className="accent-line" />
            <p>Registro dos tempos, pontuações e desempenho de cada bateria realizada. O vencedor soma 10,000 pontos, e a diferença de tempo reduz a pontuação dos demais pilotos.</p>
          </Reveal>
          <div className="table-like">
            {legendsResultsPreview.map((item) => (
              <Reveal className="row" key={item.heat}>
                <strong>{item.heat}</strong>
                <span>{item.date}</span>
                <span>{item.winner}</span>
                <span>{item.bestLap}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight" id="etapas">
        <div className="container grid-2 align-start">
          <Reveal className="section-head">
            <CalendarDays size={30} color="var(--acid)" />
            <h2>Informações das etapas</h2>
            <div className="accent-line" />
            <p>Datas, horários, valores, briefing e comunicados oficiais serão publicados nos canais da organização antes do início da competição.</p>
          </Reveal>
          <div className="grid-1">
            {legendsStageInfo.map((item) => (
              <Reveal className="card" key={item.label}>
                <h3>{item.label}</h3>
                <p>{item.value}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section carbon-section" id="regulamento">
        <div className="container split">
          <Reveal className="section-head">
            <ShieldCheck size={30} color="var(--acid)" />
            <h2>Regulamento oficial</h2>
            <div className="accent-line" />
            <p>{legendsCompetition.version}, publicado em {legendsCompetition.versionDate}. Documento oficial com regras esportivas, critérios de pontuação, conduta, penalidades, premiação e controle de versões.</p>
            <a className="btn primary" href={legendsPdf} target="_blank" rel="noreferrer">
              <Download size={18} /> Baixar PDF oficial
            </a>
          </Reveal>
          <Reveal className="legends-panel">
            <h3>Regras-chave</h3>
            <p>{legendsCompetition.kartFleet}</p>
            <p>Troca de kart permitida a critério do piloto, limitada a uma troca por corrida, com voltas anteriores desconsideradas salvo problema mecânico comprovado.</p>
            <p>Premiação com troféus para os 10 melhores pilotos do campeonato e troféu especial para o vencedor da Super Final.</p>
          </Reveal>
        </div>
      </section>

      <section className="section tight" id="niveis">
        <div className="container">
          <Reveal className="section-head center">
            <Flag size={30} color="var(--acid)" />
            <h2>Divisão de níveis dos pilotos</h2>
            <div className="accent-line" />
            <p>Classificação por histórico de desempenho, vitórias, pódios e diferença de tempo para o vencedor. A divisão orienta corridas para perfis específicos, mas a disputa geral é em categoria única.</p>
          </Reveal>
          <div className="levels-grid">
            {legendsLevels.map((item) => (
              <Reveal className="level-card" key={item.level}>
                <strong>{item.level}</strong>
                <span>{item.criteria}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section carbon-section" id="conquistas">
        <div className="container">
          <Reveal className="section-head center">
            <Award size={30} color="var(--acid)" />
            <h2>Conquistas</h2>
            <div className="accent-line" />
            <p>Feitos especiais para reconhecer evolução, consistência, superação e momentos marcantes além da classificação geral.</p>
          </Reveal>
          <div className="grid-3">
            {legendsAchievements.map((item) => (
              <Reveal className="card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight" id="fotos">
        <div className="container">
          <Reveal className="section-head center">
            <h2>Fotos</h2>
            <div className="accent-line" />
            <p>Galeria oficial para etapas, pilotos, bastidores, pódios e confraternização de encerramento.</p>
          </Reveal>
          <div className="grid-3">
            {legendsPhotoSets.map((item) => (
              <Reveal className="photo-card" key={item.title}>
                <Image src={item.image} alt={item.title} fill sizes="(max-width: 900px) 100vw, 33vw" />
                <span>{item.title}</span>
                <strong>{item.text}</strong>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight" id="patrocinadores">
        <div className="container">
          <Reveal className="section-head center">
            <h2>Patrocinadores</h2>
            <div className="accent-line" />
            <p>Marcas parceiras, apoiadores e empresas patrocinadoras da Legends Kart Series.</p>
          </Reveal>
          <div className="sponsors-grid">
            {legendsSponsors.map((sponsor) => (
              <Reveal className="sponsor-card" key={sponsor.instagram}>
                <a href={sponsor.instagram} target="_blank" rel="noreferrer" aria-label={`Abrir Instagram ${sponsor.name}`}>
                  <span className="sponsor-logo">
                    <Image src={sponsor.logo} alt={`Logo ${sponsor.name}`} fill sizes="(max-width: 760px) 100vw, 25vw" />
                  </span>
                  <span className="sponsor-meta">
                    <span>{sponsor.segment}</span>
                    <strong>{sponsor.name}</strong>
                    <span className="sponsor-handle">{sponsor.handle}</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
