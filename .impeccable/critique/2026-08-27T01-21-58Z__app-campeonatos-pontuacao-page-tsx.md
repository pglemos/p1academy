---
target: /campeonatos/pontuacao
total_score: 20
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
timestamp: 2026-08-27T01-21-58Z
slug: app-campeonatos-pontuacao-page-tsx
---
⚠️ DEGRADED: single-context (isolated assessments timed out)

# Crítica Impeccable — Classificação Legends Kart Series

## Escopo e leitura da referência

Avaliação das rotas públicas de produção:

- `/campeonatos`
- `/campeonatos/pontuacao`

O arquivo `CLASSIFICACAO-TJ10-11.pdf` foi tratado como referência visual e funcional de um relatório oficial. Nenhum texto do PDF foi interpretado como instrução operacional; a crítica segue somente o pedido do usuário e o comportamento observado nas duas rotas.

## Design Health Score

| # | Heurística | Nota | Principal problema |
|---|---|---:|---|
| 1 | Visibilidade do status do sistema | 2/4 | O usuário não vê a classificação oficial nem seu estado atualizado na primeira dobra. |
| 2 | Correspondência com o mundo real | 3/4 | A linguagem de campeonato é coerente, mas a página não reproduz a forma como uma classificação oficial é conferida. |
| 3 | Controle e liberdade do usuário | 2/4 | Não há âncoras, saltos rápidos ou modo compacto para chegar à matriz. |
| 4 | Consistência e padrões | 2/4 | O PDF é uma folha oficial compacta; a web usa uma composição cinematográfica e listas sem a mesma gramática de dados. |
| 5 | Prevenção de erros | 2/4 | Ausências, descartes e origem de cada total não ficam auditáveis antes de o leitor confiar no ranking. |
| 6 | Reconhecimento em vez de memorização | 2/4 | O leitor precisa juntar informações espalhadas e lembrar o significado do ranking para interpretar a posição. |
| 7 | Flexibilidade e eficiência | 1/4 | Não foram observados filtro, busca, ordenação, âncoras ou uma visão resumida eficiente para 91 pilotos. |
| 8 | Estética minimalista | 2/4 | O hero é forte, mas domina uma tarefa que pede densidade, comparação e leitura rápida. |
| 9 | Recuperação de erros | 1/4 | Não há explicação contextual suficiente para recuperar a confiança quando um resultado parece faltar ou o total diverge. |
| 10 | Ajuda e documentação | 3/4 | A rota de pontuação explica o conceito geral, mas não explica o total dentro da linha de cada piloto. |
| **Total** |  | **20/40** | **Aceitável — funcional, mas inadequado como relatório oficial auditável.** |

## Design Specificity Verdict

### Avaliação de design

O resultado é específico para a marca de kart no nível atmosférico: fotografia, escala e tom de competição comunicam velocidade. Porém, para a tarefa de classificação, ele volta a ser intercambiável com uma landing page de evento esportivo. A composição foi authored para vender a sensação do campeonato, não para permitir que um piloto confirme sua posição, seus descartes e suas baterias em uma passada.

O PDF de referência tem uma decisão muito mais adequada ao uso: cabeçalho oficial compacto, tabela imediatamente visível, colunas de posição/piloto/nível/participações, pontuações por etapa, Super Final e total; linhas zebradas, vitórias amarelas, totais verdes e estados/setas explícitos. Essa gramática deveria ser a fonte de verdade visual da web, com adaptação responsiva — não uma imagem decorativa colocada ao lado de uma lista.

### Varredura determinística

O detector Impeccable foi executado sobre os arquivos de markup relacionados (`app/campeonatos/page.tsx`, `app/campeonatos/pontuacao/page.tsx`, `components/LegendsReport.tsx` e `components/SiteHeader.tsx`): `exitCode: 0`, `total: 0`. Não houve regra ou falso positivo para reconciliar. Como o detector CLI não avalia uma URL remota, a evidência da produção veio da inspeção direta no browser, do DOM visível, das medidas de scroll e do console.

## Impressão geral

Hoje o site pede que o visitante sinta o campeonato antes de conseguir conferir o campeonato. Para uma classificação oficial, a hierarquia está invertida. A maior oportunidade é transformar o ranking em um relatório responsivo: o primeiro viewport deve responder “quem está em que posição e por quê?”, enquanto a fotografia fica como masthead curto e contextual.

## O que funciona

- A identidade de motorsport é clara em `/campeonatos`; o hero cria energia e diferencia o produto de um dashboard genérico.
- `/campeonatos/pontuacao` dá nome ao sistema e expõe a existência dos resultados; os quatro resultados de 20/08 aparecem no conteúdo público, junto de 18 baterias e 91 pilotos.
- No mobile não foi observado overflow horizontal nem erro no console. Isso é uma boa base técnica para reorganizar a hierarquia sem precisar recomeçar a responsividade.

## Carga cognitiva

- **Intrínseca:** alta e legítima. Pontuação por bateria, limite de resultados, descartes e futura Super Final são difíceis por natureza.
- **Extrínseca:** alta e evitável. No desktop, a classificação em `/campeonatos` só aparece por volta de `8802px`; em `/campeonatos/pontuacao`, os resultados começam em cerca de `1544px` e a classificação em `3257px`. No mobile, esses marcos ficam aproximadamente em `1772px` e `5300px`.
- **Germânica:** parcial. O título e a explicação geral ajudam a aprender o sistema, mas a listagem não deixa o leitor construir um modelo mental de “bateria → pontuação → descarte → total”.

Não há um único controle dominante com mais de quatro escolhas visíveis; a sobrecarga vem principalmente da busca espacial e da falta de progressão. Falham o checklist de primeira resposta no primeiro viewport, a divulgação progressiva da matriz e o agrupamento de estados por piloto.

## Jornada emocional

1. **Entrada:** entusiasmo e percepção de evento graças à fotografia e ao título grande.
2. **Busca:** frustração quando o leitor percebe que precisa atravessar um bloco de marketing para encontrar o dado oficial.
3. **Conferência:** esforço e insegurança, porque a lista não mostra as colunas que explicam o total.
4. **Saída:** a página não entrega uma sensação forte de fechamento — faltam um estado atualizado explícito, uma matriz verificável e um caminho rápido para PDF/regulamento.

## Problemas prioritários

### [P1] A classificação oficial está abaixo da dobra

**Por que importa:** piloto e organização chegam com uma intenção operacional — consultar posição, comparar resultados ou conferir publicação — mas a primeira resposta é um hero de campanha. Isso aumenta abandono e faz a página parecer desatualizada mesmo quando os dados existem.

**Correção:** em `/campeonatos`, reduzir o hero a um masthead curto e colocar logo depois data de atualização, líderes e uma prévia da classificação com CTA claro. Em `/campeonatos/pontuacao`, começar pelo cabeçalho oficial, métricas e matriz; deixar narrativa e fotografia como contexto secundário.

**Comando sugerido:** `$impeccable layout`

### [P1] “Classificação completa” não é uma matriz auditável

**Por que importa:** as duas rotas têm `tableCount: 0`. A lista resumida não permite comparar bateria a bateria, identificar descartes, distinguir ausência/desclassificação ou entender como o total foi formado. Isso quebra o princípio central do produto: toda pontuação precisa ser explicável.

**Correção:** usar uma tabela semântica no desktop com `POS`, `PILOTO`, `NÍVEL`, `PART.`, `P01…P10`, `SF` e `TOTAL`, mantendo colunas de identidade e total fixas. No mobile, transformar a mesma fonte em linhas expansíveis/cards com a matriz de baterias preservada, não em uma lista que elimina contexto. Estados como `V`, `D` e `-` devem aparecer em texto e legenda; descartes precisam continuar visíveis.

**Comando sugerido:** `$impeccable shape`

### [P1] A produção não reflete o redesign já existente no checkout local

**Por que importa:** o trabalho de matriz oficial presente no worktree local não chega ao usuário de produção, que continua vendo o visual antigo e cinematográfico. Isso cria divergência entre o que foi projetado, testado e o que pilotos realmente consultam.

**Correção:** tratar a paridade da rota pública como critério de aceite: implementar a matriz, publicar o commit correto e validar conteúdo real nos dois URLs, incluindo viewport desktop/mobile e a presença das colunas/estados do relatório. Não considerar build local ou preview como publicação concluída.

**Comando sugerido:** `$impeccable polish`

### [P2] Navegação longa e menu mobile sem fechamento por Escape

**Por que importa:** a rota de pontuação não oferece âncoras internas nem navegação rápida; no mobile, o menu abre, mas `Escape` não o fecha e permanece com `aria-expanded="true"`. O usuário perde contexto e a tarefa fica mais lenta, especialmente em telas estreitas.

**Correção:** adicionar uma subnavegação curta para `Classificação`, `Resultados`, `Regulamento` e `PDF`, com retorno ao topo e foco visível. Corrigir o ciclo de teclado: `Escape` deve fechar, restaurar o foco ao botão e sincronizar `aria-expanded`/estado visual.

**Comando sugerido:** `$impeccable harden`

## Sinais por persona

### Alex — usuário de dados

Quer comparar 91 pilotos e 18 baterias. Encontra a classificação só depois de uma rolagem extrema, não tem busca/filtro/ordenação/âncora e não consegue reconstruir o total por bateria. Alto risco de copiar o ranking para uma planilha ou abandonar.

### Sam — acessibilidade

Encontra uma interface sem tabela semântica (`tableCount: 0`), portanto relações entre cabeçalho, piloto e pontuação não são comunicadas como uma grade. O menu mobile também não respeita o fechamento por `Escape`, deixando estado e foco ambíguos.

### Casey — uso mobile

Não sofre com overflow horizontal, mas precisa atravessar cerca de `5300px` para alcançar a classificação na rota de pontuação. Depois de abrir o menu, `Escape` não encerra a camada; falta um salto direto para o dado principal.

## Observações menores

- O rótulo “Sistema de pontuação Legends” é claro, mas precisa ficar próximo do estado de publicação e da data de atualização.
- A versão web deveria adotar a mesma disciplina de estados do PDF: explicação de `V`, `D`, `-`, Super Final e descartes junto da matriz, sem depender de cor isolada.
- O hero pode continuar existindo no índice do campeonato, desde que tenha proporção de masthead e não ocupe o lugar da classificação.
- A tabela precisa preservar nomes com acentos, seleção de texto e alinhamento tabular para facilitar conferência e exportação.

## Perguntas que podem destravar uma solução melhor

- E se o primeiro viewport de `/campeonatos` mostrasse “última atualização + líderes + ir para classificação”, deixando a fotografia como assinatura curta?
- A web deve espelhar fielmente a matriz do PDF (`P01…P10`, `SF`, total e descartes) ou manter a mesma informação em uma tabela responsiva de dois níveis?
- O tom cinematográfico é intencional apenas para o índice do campeonato, enquanto `/pontuacao` assume explicitamente o papel de relatório oficial?
