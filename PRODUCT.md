# Product

<!-- impeccable:product-schema 1 -->

## Platform

web (Next.js 15 App Router, React 19, TypeScript, Supabase, Tailwind/Custom CSS, PDFKit/Canvas)

## Users

1. **Pilotos em Desenvolvimento e Competitivos:** Buscam evolução técnica, agendamento de aulas com André Felisberto (Campeão Brasileiro), dicas de pilotagem e análise de traçados.
2. **Pilotos da Legends Kart Series:** Consultam pontuação, tempos de volta, posições gerais, baterias publicadas e descartes calculados.
3. **Organização e Comissários:** Lançam tempos oficiais, homologam baterias, conferem desempates milimétricos e publicam relatórios em PDF.
4. **Público Geral e Patrocinadores:** Acompanham o calendário da temporada, transmissões/vídeos, notícias e classificação do automobilismo regional/nacional.

## Product Purpose

A P1 Academy é a plataforma central de alta performance no kartismo ("Drive to Perfection"), unindo a formação de pilotos à gestão e auditoria oficial da Legends Kart Series. Sucesso significa entregar dados de telemetria e classificação com 100% de precisão documental, agendamento ágil de aulas e uma experiência digital imersiva no ecossistema de Betim e do kartismo brasileiro.

## Positioning

- **Drive to Perfection:** Autoridade de pista e metodologia comprovada com o campeão brasileiro André Felisberto.
- **Rigor Documental e Telemetria:** Classificação baseada em deltas de tempo reais, desempate por milésimos, regra oficial de descartes e relatórios auditáveis sem distorções estéticas.

## Operating Context

- Aplicação web moderna hospedada na Vercel com persistência no Supabase (PostgreSQL).
- Pista-base: Kartódromo Internacional de Betim (MG).
- Geração server-side de relatórios e certidões oficiais em PDF em alta resolução com texto extraível.

## Capabilities and Constraints

- **Academia de Kart:** Agendamento de aulas (Iniciante, Intermediário, Avançado), integração via formulário e WhatsApp, módulos didáticos e telemetria.
- **Legends Kart Series:** 
  - Pontuação com base 10.000 (baterias regulares) e 5.000 (Super Final).
  - Descarte progressivo dos piores resultados (máximo de 10 baterias válidas contadas para a pontuação final).
  - Critérios de desempate sequenciais: vitórias, maiores pontuações secundárias, desempate milimétrico de tempos e sorteio em última instância.
- **Relatórios Oficiais em PDF:** Geração server-side em orientação paisagem com grade de alta densidade, marcadores `V` (vitória), `D` (descarte), `-` (ausência) e `DSQ` (desclassificação).
- **Responsividade e Ergonomia:** Suporte completo de 360px a 4K, colunas fixas (*sticky*) para leitura de tabelas densas e atalhos de busca/filtro por piloto.

## Brand Commitments

- **P1 Academy:** "Drive to Perfection" — estética de automobilismo de precisão com fundo asfalto/carbono (`#121414`, `#0D0E0F`), destaque em amarelo ouro e ácido (`#EAEA00`, `#FFFF00`), tipografia Anybody (agressividade itálica) + Geist (clareza) + JetBrains Mono (telemetria).
- **Legends Kart Series:** Marca oficial, regulamento 2026 homologado e compromisso com transparência e rastreabilidade total.

## Evidence on Hand

- Logotipo oficial Legends: `public/brand/legends-kart-series-logo.jpg`.
- Regulamento oficial da temporada: `public/regulamentos/regulamento-legends-kart-series-2026.pdf`.
- Base de dados Supabase ativa com 18+ baterias e 90+ pilotos cadastrados.
- Módulos de cálculo de pontuação e PDF: `lib/legendsScoring.ts`, `lib/legendsOverallPdf.ts`, `lib/legendsResultPdf.ts`.

## Product Principles

1. **Rigor Técnico e Auditoria:** Toda pontuação deve ser demonstrável pela fórmula, cronologia de voltas e descartes oficiais.
2. **Leitura Instantânea em Condições de Pista:** Interfaces escuras de alto contraste, legíveis em telas móveis sob luz solar ou no box.
3. **Comunicação Multimodal:** Estados (vitória, descarte, ausência, DSQ) utilizam texto explícito além de cores dedicadas.
4. **Agilidade no Fluxo do Piloto:** Do agendamento da primeira aula à conferência do campeonato em menos de três cliques.
5. **Estética Funcional ("Motorsport Precision"):** Cada linha, grid e gradiente serve para orientar o olhar e organizar dados técnicos.

## Accessibility & Inclusion

- Contraste elevado em conformidade com WCAG AA em todas as tabelas e elementos interativos.
- Suporte integral a navegação por teclado e leitores de tela com nomes acessíveis contextuais.
- Células interativas com acionamento por clique/toque (sem dependência exclusiva de hover).
- Texto em PDF totalmente selecionável, pesquisável e extraível.
