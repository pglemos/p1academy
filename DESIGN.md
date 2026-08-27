---
name: P1 Academy & Legends Kart Series Design System
description: Sistema de design de alta precisão para kartismo de performance, aulas com campeão brasileiro e auditoria documental de campeonatos.
colors:
  background: "#121414"
  background-deep: "#0D0E0F"
  panel: "#1F2020"
  panel-strong: "#292A2A"
  surface-low: "#1B1C1C"
  surface-highest: "#343535"
  ink: "#E3E2E2"
  muted: "#CAC8AA"
  faint: "#939277"
  line: "#333333"
  outline: "#484831"
  p1-gold: "#EAEA00"
  p1-acid: "#FFFF00"
  tape-orange: "#ED6430"
  discard-brown: "#442C22"
  discard-text: "#F0A45D"
  alert-red: "#FFB4AB"
typography:
  display:
    fontFamily: "Anybody, Helvetica-Bold, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 5.5rem)"
    fontWeight: 900
    fontStyle: "italic"
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Anybody, Helvetica-Bold, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 3.25rem)"
    fontWeight: 800
    fontStyle: "italic"
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Geist, Helvetica, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "Geist, Helvetica, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.3
    fontVariantNumeric: "tabular-nums"
  label:
    fontFamily: "Anybody, Helvetica-Bold, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.08em"
    textTransform: "uppercase"
rounded:
  none: "0px"
  sm: "4px"
  md: "8px"
  full: "9999px"
spacing:
  container: "1440px"
  section: "clamp(88px, 9vw, 120px)"
  card-gap: "24px"
  matrix-cell: "36px"
components:
  stat-card:
    backgroundColor: "{colors.panel}"
    borderColor: "{colors.line}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "24px"
  score-cell:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    typography: "{typography.mono}"
    rounded: "{rounded.none}"
    padding: "8px 10px"
  score-cell-win:
    backgroundColor: "{colors.p1-gold}"
    textColor: "#0D0E0F"
    typography: "{typography.mono}"
    rounded: "{rounded.none}"
    fontWeight: 700
  score-cell-discard:
    backgroundColor: "{colors.discard-brown}"
    textColor: "{colors.discard-text}"
    typography: "{typography.mono}"
    rounded: "{rounded.none}"
  action-button:
    backgroundColor: "{colors.p1-gold}"
    textColor: "#0D0E0F"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "16px 28px"
---

# Design System: P1 Academy & Legends Kart Series

## Overview

**Creative North Star: "High-G Telemetry & Work-Print Precision"**

A P1 Academy traduz visualmente a intensidade, o foco e a precisão milimétrica do kartismo de competição. A interface combina a agressividade técnica de carros de fórmula e telemetria profissional com o rigor documental de auditorias oficiais de corrida. Não há ornamentação vazia: cada elemento existe para sinalizar velocidade, tempos de volta, posições e evolução do piloto.

O sistema atua em duas superfícies integradas:
1. **Plataforma Web P1 Academy:** Aplicação imersiva com fundo asfalto profundo, cortes angulares inspirados em aerodinâmica, tipografia Anybody itálica expressiva e detalhes em amarelo ouro/ácido de alta voltagem.
2. **Relatórios Oficiais e PDF da Legends Kart Series ("The Work-Print Rail"):** Estrutura plana, alto contraste, matriz cronológica inalterável, estados explícitos de vitória (`V`), descarte (`D`), ausência (`-`) e totalização isolada.

---

## Paleta de Cores

### Asfalto & Superfícies Neutras
- **Background (`--bg` - `#121414`):** O preto de pista e asfalto com textura quase imperceptível.
- **Deep Background (`--bg-2` - `#0D0E0F`):** Profundidade para hero, footers e fundos de tabelas.
- **Painéis (`--panel` - `#1F2020` / `--panel-strong` - `#292A2A`):** Cartões de telemetria, módulos de treino e formulários.
- **Linhas Estruturais (`--line` - `#333333` / `--outline` - `#484831`):** Divisórias mecânicas de 1px com precisão cirúrgica.

### Cores de Ação & Telemetria
- **P1 Gold (`--gold` - `#EAEA00`):** O amarelo primário de bandeira, vitórias, chamadas principais e estados ativos.
- **P1 Acid (`--acid` - `#FFFF00`):** Amarelo elétrico para micro-destaques e iluminação em foco.
- **Tape Orange (`--tape-orange` - `#ED6430`):** Marcador de fitas de pista, cabeçalhos de régua e identificação de Super Final.
- **Discard Brown (`--discard-brown` - `#442C22` / `--discard-text` - `#F0A45D`):** Superfície que retém visualmente o resultado descartado sem apagá-lo.

### Regras Nomeadas de Cor

- **The Telemetry-Contrast Rule:** Em superfícies escuras, qualquer informação numérica ou técnica deve manter contraste mínimo WCAG AA (4.5:1).
- **The State-Over-Color Rule:** Nenhuma cor atua sozinha para indicar estado da corrida; vitórias trazem `V`, descartes trazem `D`, desclassificações trazem `DSQ` e ausências trazem `-`.

---

## Tipografia

| Escala | Família | Peso / Estilo | Aplicação |
|---|---|---|---|
| **Display** | `Anybody` | 900 Italic | Hero titles, chamadas de impacto, títulos de seções principais |
| **Headline** | `Anybody` | 800 Italic | Subseções de impacto, títulos de cards, nomes de etapas |
| **Title** | `Geist` | 600 Normal | Nomes de pilotos, títulos de módulos didáticos |
| **Body** | `Geist` | 400 / 500 | Explicações técnicas, regras, descrições de pacotes |
| **Mono** | `JetBrains Mono` | 500 / 700 | Tempos de volta, deltas de telemetria, posições, células de pontos |
| **Label** | `Anybody` | 700 Tracked | Tags de categoria, badges de status, botões primários |

### Regras Nomeadas de Tipografia

- **The Tabular-Numeric Rule:** Todos os números de pontuação, tempos em milésimos e deltas usam fonte monoespaçada tabular (`tabular-nums`) para alinhamento vertical perfeito.
- **The Speed-Italic Rule:** O itálico é reservado à tipografia display `Anybody` para expressar dinamismo e velocidade; textos de leitura analítica e tabelas permanecem verticais para máxima legibilidade.

---

## Layout, Estrutura & Grid

- **Container Máximo:** 1440px com margem interna de segurança mínima de 20px (mobile) a 40px (desktop).
- **Ritmo Vertical:** Seções com respiro generoso (`clamp(88px, 9vw, 120px)`) para evitar sensação de compressão.
- **Matriz de Campeonato Responsiva:** No mobile, as colunas de Posição e Nome do Piloto permanecem fixadas (*sticky* à esquerda) enquanto a linha de baterias rola horizontalmente com indicador de rolagem nítido.
- **Relatório PDF:** Formato Paisagem fixo (1491pt x 1055pt) com divisão de páginas por blocos de pilotos para eliminar compressões microscópicas.

---

## Elevação, Profundidade & Formas

- **Estética Plana & Angular:** Cantos predominantemente retos (`border-radius: 0` ou `4px` sutil) e detalhes chanfrados/angulares inspirados na fibra de carbono e nas linhas dos karts de competição.
- **Camadas Tonais:** A profundidade decorre da transição de preto (`--bg`) para cinzas técnicos (`--panel`) e bordas sólidas (`--line`), dispensando sombras difusas e efeitos borrados desnecessários.
- **Microinterações Mecânicas:** Botões e cartões reagem com transições rápidas (100ms–150ms) simulando cliques táteis de volante e instrumentos de corrida.

---

## Catálogo de Componentes-Chave

1. **Site Shell & Header:** Barra superior com backdrop translúcido escuro, logotipo oficial, navegação direta e atalho de ação.
2. **PageHero:** Bloco de abertura com headline itálica imponente, badge de categoria e lead técnico.
3. **LegendsReport / Classification Matrix:** Tabela oficial com cabeçalhos cronológicos, células com tooltips táteis/clicáveis e resumo de pódio.
4. **Course & Booking Card:** Painéis com grade de benefícios, preço claro, autoridade do instrutor e CTA direto para WhatsApp/formulário.
5. **PDF Generator:** Motor de renderização gráfica em alta fidelidade com paginação inteligente, sem dados órfãos.

---

## Do's and Don'ts

### Do:
- **Do** manter a precisão de três casas decimais em pontuações e tempos (`9,845`).
- **Do** identificar explicitamente o método de cálculo de descarte e os critérios de desempate.
- **Do** usar amarelo ouro (`#EAEA00`) e ácido (`#FFFF00`) como acentos de foco e precisão.
- **Do** garantir que qualquer detalhe de célula seja acessível via toque, teclado e leitor de tela.

### Don't:
- **Don't** esconder descartes ou suprimir baterias ausentes sem rótulo claro.
- **Don't** usar gradientes multicoloridos ou sombras decorativas que poluam a leitura de telemetria.
- **Don't** comprimir dezenas de pilotos em uma única visualização ilegível no mobile.
- **Don't** inventar regras de desempate fora do regulamento oficial homologado.

