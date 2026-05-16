import { notFound } from "next/navigation";
import Link from "next/link";
import { MediaFrame } from "@/components/MediaFrame";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Motion";
import { posts } from "@/data/site";
import type { NewsPost } from "@/data/news";

type NewsDetailProps = {
  params: Promise<{ slug: string }>;
};

function buildCompleteCoverage(post: NewsPost) {
  const sourceContext =
    post.source === "CBA"
      ? "A publicacao original da CBA foi usada como fonte factual para esta cobertura editorial da P1 Academy. O foco aqui e organizar os pontos que mais importam para pilotos, equipes, alunos e organizadores que acompanham o kartismo brasileiro."
      : "A publicacao original da FIA Karting foi usada como fonte factual para esta cobertura editorial da P1 Academy. O foco aqui e traduzir o impacto esportivo da noticia para quem acompanha formacao de pilotos, calendario internacional e padroes tecnicos da modalidade.";

  const categoryContext: Record<string, string> = {
    "Brasileiro de Kart":
      "No contexto do Brasileiro de Kart, a noticia tem peso porque envolve o maior palco nacional da modalidade. Decisoes de pista, numero de inscritos, programacao e estrutura influenciam diretamente preparacao, logistica, custo e estrategia de cada competidor.",
    Calendario:
      "Como informacao de calendario, o ponto central e previsibilidade. Datas, sedes e janelas de competicao permitem que pilotos planejem treinos, equipes reservem estrutura e patrocinadores organizem presenca com antecedencia.",
    Patrocinio:
      "Como noticia de patrocinio, o impacto vai alem da exposicao de marca. Apoios comerciais sustentam estrutura de evento, transmissao, premiacao e relacionamento com a industria que fornece chassi, pneus, motores, servicos e tecnologia.",
    Recorde:
      "Quando uma noticia envolve recorde, ela tambem mostra escala operacional. Mais inscritos significam grids mais disputados, maior demanda de secretaria, vistorias, boxes, comissariado, transmissao e comunicacao com pilotos.",
    Premiacao:
      "No caso de premiacao, o valor esportivo esta na ponte criada entre resultado e oportunidade. Premios bem desenhados ajudam pilotos a transformar desempenho em experiencia, visibilidade e proximos passos de carreira.",
    Imprensa:
      "Para imprensa e producao de conteudo, o ponto decisivo e acesso organizado. Credenciamento, regras de circulacao e prazos claros ajudam a proteger seguranca, imagem do evento e qualidade da cobertura.",
    "FIA Karting":
      "No ambiente FIA Karting, cada etapa combina performance pura com leitura de fim de semana. Treinos, classificacoes, heats, super heats e finais formam uma sequencia em que consistencia costuma pesar tanto quanto uma volta rapida isolada.",
    Regulamento:
      "Em noticias regulatórias, a relevancia esta na mudanca de padrao. Decisoes do Conselho Mundial, ajustes de formato e novas exigencias tecnicas alteram como campeonatos sao planejados e como pilotos entram no sistema internacional.",
    "Arrive and Drive":
      "No formato Arrive and Drive, a noticia aponta para acessibilidade competitiva. Equipamento padronizado reduz barreiras de entrada e coloca maior enfase em adaptacao, tecnica, controle emocional e capacidade de aprender rapido.",
    Homenagem:
      "Em homenagens, a cobertura registra memoria esportiva. O karting e construido por pilotos, dirigentes, voluntarios e equipes que deixam legado tecnico, cultural e humano para quem chega depois.",
    Seguranca:
      "Quando o tema e seguranca, o efeito pratico aparece na operacao de pista. Dados, sinalizacao e padronizacao ajudam a reduzir risco e a transformar incidentes em aprendizado tecnico para o esporte.",
    Inscricoes:
      "Em noticias de inscricao, o ponto central e oportunidade. Janelas abertas, criterios de entrada e formatos de competicao definem quem consegue participar e como deve se preparar para chegar competitivo.",
    Institucional:
      "No plano institucional, a noticia mostra como a governanca do esporte se conecta com experiencia de pista. Dirigentes com historico esportivo tendem a influenciar prioridades de base, seguranca e desenvolvimento.",
  };

  return [
    ...post.content,
    sourceContext,
    categoryContext[post.category] ?? "A noticia se encaixa no acompanhamento amplo da modalidade, reunindo informacao esportiva, contexto de calendario e impacto pratico para quem vive o kart dentro e fora da pista.",
    `Para pilotos da P1 Academy, o principal aprendizado desta materia e acompanhar nao apenas o resultado final, mas tambem os sinais de preparacao: ${post.excerpt}`,
    "Na pratica, esse tipo de conteudo ajuda a entender como o kartismo se organiza: circuitos, federacoes, fabricantes, equipes, pilotos, imprensa e patrocinadores formam uma cadeia em que uma decisao tecnica ou institucional muda a experiencia de todos.",
    "A leitura recomendada e cruzar esta cobertura com a fonte original, especialmente quando houver necessidade de confirmar regulamentos, datas oficiais, inscricoes, credenciamento, criterios esportivos ou atualizacoes publicadas depois desta materia.",
  ];
}

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: NewsDetailProps) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  return {
    title: post ? `${post.title} | P1 Academy` : "Notícia | P1 Academy",
  };
}

export default async function NewsDetailPage({ params }: NewsDetailProps) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const articleContent = buildCompleteCoverage(post);

  return (
    <>
      <PageHero title={post.title} text={post.excerpt} image={post.image} compact />
      <section className="section">
        <div className="container split news-detail-layout">
          <Reveal>
            <MediaFrame label={post.source} src={post.image} alt={post.title} tall />
          </Reveal>
          <Reveal className="card article-detail">
            <p className="news-meta">{post.date} | {post.category} | {post.source}</p>
            <h3>{post.category}</h3>
            {articleContent.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="button-row">
              <a className="btn primary" href={post.sourceUrl} target="_blank" rel="noreferrer">
                Fonte original
              </a>
              <Link className="btn secondary" href="/noticias">
                Voltar para notícias
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
