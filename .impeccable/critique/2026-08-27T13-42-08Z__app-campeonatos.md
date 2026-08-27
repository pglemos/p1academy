---
target: $impeccable critique app/campeonatos and app/campeonatos/pontuacao
total_score: 26
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
timestamp: 2026-08-27T13-42-08Z
slug: app-campeonatos
---
Method: dual-agent (A: 01a0436c-4cec-7f92-95d4-1d2f558524a4 · B: 01a0436c-4c1d-7863-a732-e3c508e6e1f5)

# Crítica Impeccable — Campeonato e classificação

Alvos avaliados:
- https://p1academy.vercel.app/campeonatos
- https://p1academy.vercel.app/campeonatos/pontuacao

## Escopo e evidência

A revisão foi feita em produção, em abas independentes, nos viewports desktop (1710×802 e 1440×900) e mobile (390×844). Foram observados 18 baterias completas, 91 pilotos e a atualização exibida como 27/08/2026, 01:32. Nenhum formulário foi enviado, nenhum PDF foi baixado e nenhum arquivo foi alterado.

## Design Health Score

| # | Heurístico | Score | Questão principal |
|---|---|---:|---|
| 1 | Visibilidade do estado do sistema | 3/4 | Timestamp, Dados publicados e contagens são claros; a Super Final não publicada não é explicitada. |
| 2 | Correspondência com o mundo real | 3/4 | Bateria, vitória, descarte e regulamento fazem sentido; Part., Ret., S/T, DSQ e SF exigem decodificação. |
| 3 | Controle e liberdade do usuário | 3/4 | Âncoras, navegação e scroll funcionam; falta busca ou atalho para um piloto. |
| 4 | Consistência e padrões | 3/4 | As rotas compartilham o mesmo sistema; Abrir, Ver e Baixar variam para ações próximas. |
| 5 | Prevenção de erros | 2/4 | Estados existem, mas faltam avisos proeminentes para dado parcial, desatualizado ou Super Final ausente. |
| 6 | Reconhecimento em vez de memorização | 2/4 | Legendas ajudam, porém headers estreitos, abreviações e nomes truncados exigem esforço contínuo. |
| 7 | Flexibilidade e eficiência | 2/4 | A leitura linear funciona; consultas recorrentes não têm busca, filtro ou comparação. |
| 8 | Estética e design minimalista | 3/4 | A linguagem editorial é coerente; masthead, ações, subnav e matriz pesam no mobile. |
| 9 | Reconhecer, diagnosticar e recuperar erros | 2/4 | DSQ, S/T e D são compreensíveis; a dica de hover não tem equivalente por toque/foco. |
| 10 | Ajuda e documentação | 3/4 | Fórmula, legenda e regulamento ajudam; falta exemplo concreto de cálculo, descarte e desempate. |
| **Total** |  | **26/40** | **Aceitável — melhorias significativas necessárias** |

## Design Specificity Verdict

**LLM assessment: 3/4 — específico para a Legends Kart Series, mas ainda mais “folha oficial digital” do que ferramenta de consulta recorrente.**

O masthead, a cronologia, a matriz, os marcadores V/D/-, os totais, a fórmula e os PDFs criam uma linguagem própria de relatório oficial. A separação entre hub e classificação completa também é coerente. O próximo salto de especificidade não é adicionar decoração: é fazer a identidade oficial funcionar melhor para a tarefa real de localizar, conferir e revisitar um piloto.

**Deterministic scan:** o detector foi executado uma vez sobre app/campeonatos/page.tsx, app/campeonatos/pontuacao/page.tsx, components/LegendsReport.tsx e components/ChampionshipRegistrationForm.tsx. Exit code 0, resultado [], 0 findings, sem regras ou localizações e sem falsos positivos. Isso confirma que não há padrões mecânicos detectáveis nesses componentes; não invalida os problemas de densidade e interação observados visualmente.

**Evidência visual:** nenhuma sobreposição Impeccable ficou disponível. O fluxo foi somente de inspeção em produção; não houve servidor local, injeção ou mutação. As páginas não apresentaram overflow horizontal externo: o scroll ficou contido nas matrizes/registros, e as colunas Pos. e Piloto permaneceram sticky no mobile. Console sem warnings/errors nas duas rotas.

## Overall Impression

A primeira impressão é de um relatório oficial confiável e bem estruturado. O maior desperdício aparece depois da confiança inicial: para encontrar uma posição, conferir uma célula ou abrir um PDF específico, o usuário precisa atravessar um preâmbulo grande, ler colunas estreitas e lembrar abreviações. A oportunidade principal é transformar a folha em uma consulta rápida sem perder o caráter documental.

## What's Working

1. O masthead, o timestamp, a fonte publicada e a temporada comunicam autenticidade rapidamente.
2. V, D, -, DSQ, S/T e SF traduzem estados de pontuação com texto e cor, evitando depender apenas de cor.
3. Hub e matriz completa têm papéis distintos e complementares, com acesso ao método e aos documentos oficiais.
4. A estrutura semântica, o foco visível, as captions e o scroll interno evitam problemas básicos de navegação e overflow.

## Priority Issues

### [P1] A liderança fica abaixo da primeira tela no mobile

**Evidência:** em 390×844, a primeira linha de piloto começa aproximadamente em y=759–766 nas duas rotas, depois de masthead, título, ações e subnav.

**Por que importa:** o público mobile que entra para saber “quem está liderando?” vê contagens e cabeçalhos antes de ver qualquer piloto. A promessa principal da classificação fica atrasada.

**Correção:** inserir um resumo compacto do líder e do total antes da matriz, ou reduzir o preâmbulo específico do relatório no mobile. Manter a navegação global intacta.

**Suggested command:** $impeccable layout

### [P1] A matriz comprime dados essenciais demais

**Evidência:** em uma largura interna de 364px, a tabela chega a 1320px e as células de pontuação ficam visualmente estreitas; valores como 10,000V perdem conforto e nomes longos aparecem truncados, por exemplo ARTHUR FERREIRA DU....

**Por que importa:** a tabela é o artefato principal, mas requer zoom mental e deslocamento horizontal constante. O usuário pode confundir valores, perder o nome completo ou não perceber o estado da célula.

**Correção:** criar uma leitura mobile condensada por piloto/bateria ou preservar larguras mínimas maiores, com nome completo acessível e números sem compressão. Se a matriz continuar horizontal, comunicar claramente o scroll do registro e manter a posição do piloto sempre contextualizada.

**Suggested command:** $impeccable adapt

### [P1] A auditoria depende de hover

**Evidência:** o texto em components/LegendsReport.tsx orienta “Passe o cursor sobre uma pontuação”; cada célula é um td com title/aria-label, sem foco ou seleção própria.

**Por que importa:** toque não tem hover confiável, e title não é uma interface de auditoria. Sam não consegue abrir um detalhe contextual de forma previsível; Casey recebe uma instrução impossível.

**Correção:** tornar a célula selecionável por teclado e toque, exibindo o detalhe da bateria em painel/linha contextual acessível. Trocar a instrução para “selecione uma pontuação” e manter o nome completo da bateria, data, estado e origem.

**Suggested command:** $impeccable harden

### [P2] Os 18 links de PDF são indistinguíveis

**Evidência:** o registro repete “Abrir PDF” em todas as linhas; o contexto fica apenas na mesma linha visual e o nome acessível da ação não diferencia as baterias.

**Por que importa:** para um piloto, organização ou auditoria, a lista de links não é reconhecível por leitor de tela nem eficiente por teclado. Em uma lista de links, 18 “Abrir PDF” iguais exigem voltar ao contexto da linha.

**Correção:** usar nomes acessíveis como “Abrir PDF da Bateria 09 - Legends IX” e manter uma ação visual curta apenas se o contexto estiver anunciado corretamente.

**Suggested command:** $impeccable clarify

### [P2] “18 + SF” comunica um estado ambíguo

**Evidência:** a rota de pontuação mostra “18 + SF”, enquanto a matriz não tem coluna de Super Final e o texto explica apenas que ela soma quando existir.

**Por que importa:** “+ SF” pode ser lido como uma etapa já contabilizada, não como uma etapa futura ainda sem publicação. Isso enfraquece a confiança no total.

**Correção:** exibir “18 baterias regulares · Super Final não publicada” e, quando aplicável, adicionar uma coluna SF explicitamente marcada como futura/sem resultado.

**Suggested command:** $impeccable clarify

## Cognitive Load Assessment

| Item | Estado | Evidência |
|---|---|---|
| Foco único | Parcial | A página tem uma promessa clara, mas ações, subnav, legenda e matriz competem antes do ranking no mobile. |
| Chunking | Falha no mobile | Seis estados da legenda, metadados e até 18 colunas são apresentados próximos sem uma camada de resumo. |
| Agrupamento | Atende | Masthead, título, matriz, método e registro estão em blocos reconhecíveis. |
| Hierarquia visual | Falha no mobile | O líder não aparece na primeira viewport. |
| Uma decisão por vez | Parcial | O leitor precisa orientar-se, entender a legenda e deslocar a matriz antes de consultar. |
| Escolhas mínimas | Falha leve | O subnav e a faixa de ações expõem mais de quatro caminhos em sequência no mobile. |
| Memória de trabalho | Falha | Abreviações, headers estreitos, nomes truncados e repetição de Pos. exigem retenção contextual. |
| Divulgação progressiva | Falha leve | O detalhamento completo está presente, mas não há resumo de primeiro nível para a pergunta “quem lidera?”. |

**Resultado:** carga moderada no desktop e alta no primeiro viewport mobile, com quatro falhas claras no mobile. O problema não é a quantidade de dados oficiais; é a falta de uma camada de consulta rápida antes da matriz.

## Emotional Journey

| Etapa | Sensação provável | Evidência |
|---|---|---|
| Entrada | Confiança | Logo, masthead, timestamp e Dados publicados. |
| Orientação | Clareza inicial | 18 baterias e 91 pilotos são identificáveis. |
| Busca pela liderança | Fricção no mobile | A primeira viewport mostra contagens e headers, não o primeiro piloto. |
| Auditoria | Confiança parcial | Legenda, fórmula e estados são bons, mas células estreitas e hover dificultam a conferência. |
| Abertura de documentos | Intenção clara, execução pouco contextual | Todos os links dizem Abrir PDF. |
| Retorno recorrente | Esforço acumulado | Sem busca/filtro/perfil, a consulta depende de scroll e memória visual. |

## Persona Red Flags

**Alex — piloto recorrente/power user**
- Não consegue ir direto ao próprio nome ou posição; precisa procurar manualmente na matriz horizontal.
- A falta de busca, filtro ou comparação torna consultas repetidas lentas.
- As células sem foco/seleção e a dica de hover impedem um caminho de auditoria rápido por teclado.

**Sam — organização/auditoria**
- A estrutura oficial é boa, mas a origem de cada pontuação não abre em uma interação contextual previsível.
- Nomes longos truncados e abreviações atrasam a validação dos dados.
- 18 links visualmente iguais aumentam o risco de abrir o documento errado.

**Casey — público mobile distraído**
- A primeira tela não responde imediatamente quem lidera.
- O subnav é maior que a largura disponível (aprox. 509–565px de conteúdo para cerca de 368px), sem indicador forte de continuidade.
- “Passe o cursor” não se aplica ao toque; o scroll da matriz e do registro requer instrução mais explícita.

## Minor Observations

- No mobile, “Classificação oficial” some do masthead e sobra apenas “Dados publicados”.
- Nível, Part. e Ret. consomem largura significativa, enquanto os primeiros níveis observados aparecem como “A definir”.
- A repetição de “Pos.” nas duas extremidades é funcional para o scroll, mas pode confundir na primeira leitura.
- Caixa alta e monoespaçada reforçam o caráter oficial, porém reduzem o conforto do público geral.
- O registro de PDFs também tem scroll interno, mas não possui uma dica própria de deslocamento horizontal.
- A fórmula explica a regra, mas ganharia compreensão com um exemplo numérico de uma bateria e um exemplo de descarte/desempate.

## Questions to Consider

1. Se a primeira viewport mobile não mostra nenhum piloto, qual resposta a rota promete entregar primeiro?
2. A matriz completa é o melhor ponto de entrada para Sam, ou deve existir uma consulta por piloto sem abandonar o documento oficial?
3. “18 + SF” é compreensível para alguém que não leu a fórmula?
4. Um dado auditável pode depender de uma interação que não existe no toque?
5. O visual de folha oficial está priorizando confiança ou sacrificando a leitura rápida do ranking?
