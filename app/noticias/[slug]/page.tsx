import { notFound } from "next/navigation";
import Link from "next/link";
import { MediaFrame } from "@/components/MediaFrame";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Motion";
import { posts } from "@/data/site";

type NewsDetailProps = {
  params: Promise<{ slug: string }>;
};

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

  return (
    <>
      <PageHero title={post.title} text={post.excerpt} image="/images/competition-corner.png" />
      <section className="section">
        <div className="container split">
          <Reveal>
            <MediaFrame label={post.category} src="/images/competition-corner.png" alt={post.title} tall />
          </Reveal>
          <Reveal className="card">
            <h3>{post.category}</h3>
            <p>
              Publicado em {post.date}. Este é um conteúdo mockado para demonstrar a página editorial da P1 Academy. A versão final pode receber texto completo, galeria, vídeo e links de inscrição.
            </p>
            <p>
              A estrutura foi pensada para transformar notícias em ativos de marca: cada publicação pode reforçar técnica, calendário, comunidade e patrocínio.
            </p>
            <Link className="btn secondary" href="/noticias">
              Voltar para notícias
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
