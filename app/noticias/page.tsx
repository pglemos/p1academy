import Link from "next/link";
import { MediaFrame } from "@/components/MediaFrame";
import { PageHero } from "@/components/PageHero";
import { Lift } from "@/components/Motion";
import { latestPosts } from "@/data/site";

export const metadata = {
  title: "Notícias | P1 Academy",
};

export default function NoticiasPage() {
  return (
    <>
      <PageHero
        title="Notícias"
        text="Coberturas editoriais da P1 Academy baseadas em fontes oficiais, com imagens, contexto e link direto para a publicação original."
        image="/images/competition-corner.png"
      />
      <section className="section">
        <div className="container grid-3">
          {latestPosts.map((post) => (
            <Lift className="article-card" key={post.slug}>
              <MediaFrame label={post.source} src={post.image} alt={post.title} />
              <div className="article-body">
                <p className="news-meta">{post.date} | {post.category}</p>
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
