import { ArrowRight, CalendarCheck, Flag, Play, Timer, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BookingForm } from "@/components/BookingForm";
import { MediaFrame } from "@/components/MediaFrame";
import { Lift, Reveal } from "@/components/Motion";
import { quickAccess, programs, competitions, posts, sponsors } from "@/data/site";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <Reveal>
            <h1>P1 Academy</h1>
            <p>
              Escola de kart e plataforma de corrida para transformar freada, tangência, ultrapassagem e consistência em experiência de grid profissional.
            </p>
            <div className="race-signals" aria-label="Pilares de pilotagem P1">
              <span>Freada</span>
              <span>Apex</span>
              <span>Racecraft</span>
            </div>
            <div className="button-row">
              <Link className="btn primary" href="/contato">
                <CalendarCheck size={18} /> Agendar aula
              </Link>
              <Link className="btn secondary" href="/competicoes">
                <Trophy size={18} /> Entrar em campeonato
              </Link>
            </div>
          </Reveal>

          <Reveal className="hero-panel" aria-label="Vídeo placeholder premium de kart">
            <Image
              className="hero-photo"
              src="/images/hero-kart-night.png"
              alt="Kart em pista noturna com luzes de largada"
              fill
              priority
              sizes="(max-width: 980px) 100vw, 44vw"
            />
            <div className="pilot-card">
              <strong>Onboard de pista</strong>
              <div className="telemetry">
                <span>
                  Melhor volta <b>48.2</b>
                </span>
                <span>
                  Setores <b>S1 S2 S3</b>
                </span>
                <span>
                  Pressão <b>Grid</b>
                </span>
              </div>
              <Link className="btn ghost" href="/videos">
                <Play size={18} /> Ver vídeos
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <Reveal className="section-head center">
            <h2>Portal completo para pilotos</h2>
            <div className="accent-line" />
            <p>As áreas essenciais do kart amador em uma experiência mais clara, visual e orientada à conversão.</p>
          </Reveal>
          <div className="grid-3">
            {quickAccess.map((item) => {
              const Icon = item.icon;
              return (
                <Lift className="feature-card" key={item.href}>
                  <MediaFrame label={item.label} src={item.image} alt={item.title} />
                  <div className="feature-body">
                    <Icon size={24} color="var(--cyan)" />
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    <Link className="btn ghost" href={item.href}>
                      Acessar <ArrowRight size={16} />
                    </Link>
                  </div>
                </Lift>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <Reveal className="section-head">
            <h2>Treino com leitura de corrida</h2>
            <div className="accent-line" />
            <p>
              Do primeiro contato com o kart à preparação para campeonato, a P1 organiza cada experiência como um box de performance: briefing, aquecimento, volta lançada, análise e próximos passos.
            </p>
            <div className="button-row">
              <Link className="btn primary" href="/aulas">
                Conhecer aulas
              </Link>
              <Link className="btn secondary" href="/sobre">
                Ver método
              </Link>
            </div>
          </Reveal>
          <div className="grid-1">
            {programs.map((program) => (
              <Reveal className="card" key={program.title}>
                <h3>{program.title}</h3>
                <p>{program.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <Reveal className="section-head">
            <h2>Grid em formação</h2>
            <div className="accent-line" />
          </Reveal>
          <div className="table-like">
            {competitions.map((item) => (
              <Reveal className="row" key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.category}</span>
                <span>{item.date}</span>
                <Link className="btn ghost" href="/competicoes">
                  {item.status}
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <Reveal>
            <div className="section-head">
              <h2>Agende sua próxima bateria</h2>
              <div className="accent-line" />
              <p>O formulário funciona como pré-briefing: interesse, experiência, janela de horário e observações já chegam organizados para a equipe.</p>
            </div>
            <div className="stat-strip">
              <div className="stat">
                <strong>Q1</strong>
                <span>Briefing</span>
              </div>
              <div className="stat">
                <strong>PIT</strong>
                <span>Confirmação</span>
              </div>
              <div className="stat">
                <strong>RACE</strong>
                <span>Na pista</span>
              </div>
              <div className="stat">
                <strong><Timer size={34} /></strong>
                <span>Cronômetro</span>
              </div>
            </div>
          </Reveal>
          <BookingForm />
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <Reveal className="section-head center">
            <h2>Últimas notícias</h2>
            <div className="accent-line" />
          </Reveal>
          <div className="grid-4">
            {posts.map((post) => (
              <Lift className="article-card" key={post.slug}>
                <MediaFrame label={post.category} src="/images/competition-corner.png" alt={post.title} />
                <div className="article-body">
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <Link className="btn ghost" href={`/noticias/${post.slug}`}>
                    Ler notícia
                  </Link>
                </div>
              </Lift>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container split">
          <Reveal className="section-head">
            <h2>Marcas no grid</h2>
            <div className="accent-line" />
            <p>Patrocínio com presença em eventos, peças digitais, ranking, conteúdo editorial e experiências de relacionamento.</p>
            <Link className="btn primary" href="/patrocinadores">
              <Flag size={18} /> Seja patrocinador
            </Link>
          </Reveal>
          <div className="grid-2">
            {sponsors.slice(0, 4).map((sponsor) => (
              <Reveal className="card" key={sponsor}>
                <h3>{sponsor}</h3>
                <p>Logo placeholder premium para substituição por parceiro oficial.</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
