import Link from "next/link";
import { MediaFrame } from "@/components/MediaFrame";
import { PageHero } from "@/components/PageHero";
import { Lift } from "@/components/Motion";
import { posts } from "@/data/site";

export const metadata = {
  title: "Notícias | P1 Academy",
};

export default function NoticiasPage() {
  return (
    <>
      <PageHero
        title="Notícias"
        text="Conteúdo editorial para pilotos, alunos, participantes de campeonato, patrocinadores e comunidade P1."
        image="/images/competition-corner.png"
      />
      <section className="section">
        <div className="container grid-3">
          {posts.map((post) => (
            <Lift className="article-card" key={post.slug}>
              <MediaFrame label={post.category} src="/images/competition-corner.png" alt={post.title} />
              <div className="article-body">
                <p>{post.date}</p>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <Link className="btn ghost" href={`/noticias/${post.slug}`}>
                  Ler matéria
                </Link>
              </div>
            </Lift>
          ))}
        </div>
      </section>
    </>
  );
}
