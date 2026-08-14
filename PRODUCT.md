# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pilotos, organização e público da Legends Kart Series 2026. O piloto consulta sua posição, pontuação por bateria e resultados descartados; a organização publica e confere os resultados oficiais; o público precisa entender rapidamente quem lidera e como a classificação é formada.

## Product Purpose

O P1 Academy publica o calendário, resultados de tomada de tempo, PDFs oficiais e a classificação geral da Legends Kart Series. Sucesso significa que os dados publicados são fiéis aos lançamentos oficiais e que qualquer leitor consegue auditar a pontuação sem depender de interpretação informal.

## Positioning

A classificação é calculada a partir da diferença de tempo de volta para o vencedor de cada bateria, com desempate de milésimo, limite de dez resultados regulares e descarte progressivo; não é uma tabela baseada apenas em ordem de chegada ou pontos arbitrários.

## Operating Context

Resultados são importados ou lançados pela organização no painel administrativo, publicados em Supabase e consumidos pela página pública e pelas rotas de PDF. A temporada ocorre no Kartódromo Internacional de Betim e combina baterias regulares com uma Super Final futura.

## Capabilities and Constraints

- Bateria regular: base de 10,000 pontos; Super Final: base de 5,000.
- Cada piloto pode contar no máximo dez resultados regulares; piores pontuações, ausências e desclassificações podem ser descartadas ao longo da competição.
- Diferença superior a nove segundos vale 1,000 ponto.
- Empates preservam a ordem do primeiro registro e ajustam os seguintes em milésimos.
- O desempate oficial segue vitórias, melhor pontuação abaixo das vitórias, segunda melhor pontuação abaixo das vitórias e assim sucessivamente; sorteio é o último critério.
- O PDF deve permanecer legível com dezenas de pilotos e mostrar a fonte de cada total sem truncar nomes essenciais.
- Dados não publicados, credenciais e chaves de acesso não fazem parte do produto público.

## Brand Commitments

O nome Legends Kart Series, a temporada 2026, o logotipo em `public/brand/legends-kart-series-logo.jpg` e o regulamento oficial em `public/regulamentos/regulamento-legends-kart-series-2026.pdf` são ativos vinculantes. A linguagem deve ser direta, oficial e compreensível em português brasileiro.

## Evidence on Hand

- `public/brand/legends-kart-series-logo.jpg`
- `public/regulamentos/regulamento-legends-kart-series-2026.pdf`
- Resultados publicados no Supabase para 14 baterias regulares e 61 pilotos no momento deste trabalho.
- PDF recebido para revisão: `resultado-geral-legends-kart-series (6).pdf`.
- O produto não possui ainda uma Super Final publicada nesta atualização.

## Product Principles

1. Fonte oficial antes de estética.
2. Toda pontuação precisa ser explicável por tempo, descarte ou regra de desempate.
3. A leitura do ranking deve funcionar em uma passada, sem depender de zoom extremo.
4. Estado publicado, ausência, descarte e Super Final devem ser distinguíveis.
5. Dados futuros devem entrar no mesmo modelo sem quebrar a narrativa do relatório.

## Accessibility & Inclusion

Usar contraste alto, hierarquia tipográfica clara, rótulos por extenso além de abreviações, texto extraível no PDF e não depender apenas de cor para comunicar descarte, vitória ou ausência. Nomes com acentos devem permanecer legíveis e pesquisáveis.
