---
name: Legends Kart Series Official Reports
description: Relatórios oficiais de kart desenhados para leitura rápida e auditoria de pontuação.
colors:
  background: "#090B0B"
  header: "#101414"
  surface: "#151A19"
  surface-alt: "#1A201E"
  ink: "#F2F0E7"
  muted: "#B7B8AE"
  faint: "#858A80"
  line: "#4B5147"
  legends-gold: "#F2B51B"
  tape-orange: "#ED6430"
  discard-brown: "#442C22"
  discard-text: "#F0A45D"
  dark-ink: "#171A16"
typography:
  display:
    fontFamily: "Helvetica-Bold, Arial, sans-serif"
    fontSize: "34pt"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.45pt"
  title:
    fontFamily: "Helvetica-Bold, Arial, sans-serif"
    fontSize: "18pt"
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "Helvetica, Arial, sans-serif"
    fontSize: "9.5pt"
    fontWeight: 400
    lineHeight: 1.35
  label:
    fontFamily: "Helvetica-Bold, Arial, sans-serif"
    fontSize: "8.5pt"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "1.4pt"
rounded:
  none: "0pt"
spacing:
  page-edge: "42pt"
  section: "18pt"
  frame-gap: "9pt"
  matrix-row: "35pt"
components:
  score-cell:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 8pt"
  score-cell-win:
    backgroundColor: "{colors.legends-gold}"
    textColor: "{colors.dark-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 8pt"
  score-cell-discard:
    backgroundColor: "{colors.discard-brown}"
    textColor: "{colors.discard-text}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 8pt"
  report-frame:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "14pt 22pt"
---

# Design System: Legends Kart Series Official Reports

## Overview

**Creative North Star: "The Work-Print Rail"**

The official report treats the championship as a film cutting bench: each published heat is a frame on a chronological rail, the score is the working print, and a discarded result remains visible as retained material rather than disappearing. This gives a data-heavy document a recognizable motorsport grammar without turning the information into decoration.

The system is deliberately flat and high-contrast. True black, work-print white, Legends gold and tape orange establish hierarchy; perforation marks and thin rules create structure, while numbers and names remain the visual focus. This system applies to the official PDF report surface; the public website retains its separate navigation and page-shell language.

**Key Characteristics:**

- Chronology is a visible rail, not an implicit column order.
- `V`, `D` and `-` make states readable without relying on color alone.
- Totals are isolated at the far right and use tabular visual weight.
- Rules and tie-break criteria appear before the audit matrix.

## Colors

The palette is restrained: near-black working surfaces, warm paper-like text, one brand metallic and one marking-tape accent. Discards use a dark brown surface with orange text so they remain legible but visibly outside the counted score.

### Primary

- **Legends gold:** brand emphasis, winner cells, totals and season metadata.
- **Tape orange:** section labels, rails, top marks and the Super Final key.

### Neutral

- **True black:** page field and unoccupied space.
- **Work surface:** table and explanation panels.
- **Work-print white:** names, formulas and primary data.
- **Muted and faint ink:** secondary explanations, dates and unavailable states.
- **Structural line:** thin separators between frames and matrix columns.

### Named Rules

**The Marking-Tape Rule.** Orange marks state and wayfinding; it never replaces the data itself.

**The Work-Print Rule.** A retained result stays visible and labeled even when it does not enter the total.

## Typography

**Display Font:** Helvetica-Bold (with Arial sans-serif fallback)
**Body Font:** Helvetica (with Arial sans-serif fallback)
**Label/Mono Font:** Tabular numeric treatment in the PDF's workhorse sans; no decorative typeface is introduced.

**Character:** The built-in PDF sans is compact, neutral and highly extractable. Large display type establishes the report title; the matrix stays smaller but receives stronger alignment, spacing and color contrast than surrounding metadata.

### Hierarchy

- **Display** (bold, 34pt, 1 line): report title on every page.
- **Headline** (bold, 25pt, 1 line): leader totals and primary overview numbers.
- **Title** (bold, 16-18pt, 1.1): pilot names and rule lead-ins.
- **Body** (regular, 8.3-14pt, 1.35): formulas, explanatory rules and score cells.
- **Label** (bold, 7.2-10pt, tracked uppercase): section labels, column names and status keys.

### Named Rules

**The Data-First Rule.** Display scale belongs to the title, leaders and totals; the matrix never sacrifices a score to create a dramatic headline.

## Layout

The report uses a fixed landscape page of 1491 by 1055 points with a 42-point edge field. Page one follows the reader's sequence: identity and update, summary metrics, leaders, chronological rail, formula and regulation. Ranking pages repeat a compact header and use a single wide matrix with fixed identity columns at left, chronological score columns in the middle and total at right.

Rows are grouped into readable page ranges instead of forcing the entire championship into one microscopic table. If future published heats exceed the matrix width, the score columns continue on additional matrix pages while the pilot range remains stable. The chronology is sorted by date and title, and regular results precede a possible Super Final column.

## Elevation & Depth

The report is flat by default. Depth comes from tonal layering between the black page, dark work surfaces and header bands, plus thin structural rules. There are no shadows, glows or blur effects in the PDF; every mark either separates information or identifies state.

### Named Rules

**The Flat-By-Default Rule.** Do not add a shadow or decorative texture where a tonal surface or a 1-point rule already explains the hierarchy.

## Shapes

All primary containers and score cells use square corners. Rectangular frames echo film strips and keep dense columns aligned. Perforation marks are small geometric rectangles on the rail and frame headers; they are structural motifs, not decoration layered over unrelated surfaces.

## Components

### Report Header

The logo, series name, report title, season and update time form a stable top band. A thin orange rule separates the header from the document body.

### Metric Rail

Four equal-width fields show pilots, published heats, regular results and the `10 + SF` validity limit. Dividers are thin and values are larger than their notes.

### Leader Strip

Three flat frames show position, pilot, total and victories. Gold, neutral metal and orange identify the podium order, while the rank number and label keep the meaning explicit.

### Score Cell

The default cell shows a three-decimal score. A winner adds `V` and a gold field; a retained result adds `D`, an orange top mark and a dark brown field; a missing result shows `-` in faint ink. The state is therefore available in text and tone.

### Ranking Matrix

The matrix fixes `POS`, `PILOTO`, `VÁLIDAS`, `RET.` and `VIT.` before the chronological `P01`, `P02` ... columns. `TOTAL` is a separated right-hand field. Every value remains selectable text in the PDF.

## Do's and Don'ts

### Do:

- **Do** keep the regulation summary before the first ranking matrix.
- **Do** label chronology, victory, retained discard, absence and Super Final in words or abbreviations explained on page one.
- **Do** preserve three decimal places and the exact driver spelling from published data.
- **Do** split long rankings across pages before reducing body text below comfortable reading size.

### Don't:

- **Don't** compress all pilots into a single page or make the matrix depend on extreme zoom.
- **Don't** use an accent color without a textual state marker where the state affects the total.
- **Don't** hide discarded results, replace them with blank cells or fold them into an unexplained total.
- **Don't** invent a Super Final result or a tie-break lottery outcome before it is officially published.
