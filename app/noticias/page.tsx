"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Clock,
  ExternalLink,
  Filter,
  Newspaper,
  Search,
  Sparkles,
  Tag,
} from "lucide-react";
import { MediaFrame } from "@/components/MediaFrame";
import { PageHero } from "@/components/PageHero";
import { Lift, Reveal } from "@/components/Motion";
import { posts } from "@/data/news";

export default function NoticiasPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(posts.map((p) => p.category)))];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesQuery =
      !query.trim() ||
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      post.category.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <>
      <PageHero
        title="Notícias & Coberturas"
        text="Coberturas editoriais da P1 Academy baseadas em fontes oficiais da CBA, kartódromos nacionais e bastidores da Legends Kart Series."
        image="/images/competition-corner.png"
      />

      <section className="section tight">
        <div className="container">
          <div className="report-table-tools mb-32">
            <label htmlFor="news-search">Buscar notícias</label>
            <div className="report-search-control">
              <input
                id="news-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar por campeonato, piloto ou tema..."
                autoComplete="off"
              />
              {query ? <button type="button" onClick={() => setQuery("")} aria-label="Limpar busca">✕</button> : null}
            </div>

            <div className="report-filter-chips" role="group" aria-label="Filtro de categorias de notícias">
              {categories.slice(0, 6).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  className={`report-chip ${selectedCategory === cat ? "is-active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === "all" ? `Todas (${posts.length})` : cat}
                </button>
              ))}
            </div>

            <span className="report-search-status" aria-live="polite">
              {filteredPosts.length} {filteredPosts.length === 1 ? "artigo encontrado" : "artigos encontrados"}
            </span>
          </div>

          <div className="grid-3 gap-24">
            {filteredPosts.map((post) => {
              const readingTime = Math.max(1, Math.ceil(post.content.join(" ").split(" ").length / 180));
              return (
                <Lift className="article-card" key={post.slug}>
                  <MediaFrame label={post.source} src={post.image} alt={post.title} />
                  <div className="article-body">
                    <div className="news-meta-bar">
                      <span className="news-date">
                        <Calendar size={13} /> {post.date}
                      </span>
                      <span className="news-read-time">
                        <Clock size={13} /> {readingTime} min
                      </span>
                      <span className="news-category-pill">{post.category}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <Link className="btn ghost news-read-btn" href={`/noticias/${post.slug}`}>
                      Ler matéria completa <ArrowRight size={16} />
                    </Link>
                  </div>
                </Lift>
              );
            })}
          </div>

          {!filteredPosts.length ? (
            <div className="report-table-no-results text-center p-32">
              <p>Nenhuma matéria corresponde aos filtros aplicados.</p>
              <button
                type="button"
                className="btn secondary mt-12"
                onClick={() => {
                  setQuery("");
                  setSelectedCategory("all");
                }}
              >
                Limpar filtros de busca
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
