from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "regulamentos" / "calendario-legends-kart-series-2026.pdf"
BACKGROUND = ROOT / "public" / "images" / "competition-corner.png"
MARK = ROOT / "public" / "brand" / "p1-mark-yellow.png"

W, H = A4
ACID = colors.HexColor("#f0f000")
WHITE = colors.HexColor("#f5f5ef")
MUTED = colors.HexColor("#c9c9bd")
BLACK = colors.HexColor("#050606")
PANEL = colors.HexColor("#101211")
LINE = colors.HexColor("#f0f000")

CALENDAR = [
    ("Julho", "JUL", [
        (1, "01/07", "QUARTA", "20:30"),
        (2, "01/07", "QUARTA", "21:05"),
        (3, "04/07", "SABADO", "09:00"),
        (4, "04/07", "SABADO", "09:30"),
        (5, "15/07", "QUARTA", "20:30"),
        (6, "15/07", "QUARTA", "21:05"),
        (7, "18/07", "SABADO", "09:00"),
        (8, "18/07", "SABADO", "09:30"),
        (9, "29/07", "QUARTA", "20:30"),
        (10, "29/07", "QUARTA", "20:30"),
    ]),
    ("Agosto", "AGO", [
        (1, "01/08", "SABADO", "09:00"),
        (2, "01/08", "SABADO", "09:30"),
        (3, "12/08", "QUARTA", "20:30"),
        (4, "12/08", "QUARTA", "21:05"),
        (5, "15/08", "SABADO", "09:00"),
        (6, "15/08", "SABADO", "09:30"),
        (7, "26/08", "QUARTA", "20:30"),
        (8, "26/08", "QUARTA", "21:05"),
        (9, "29/08", "SABADO", "09:00"),
        (10, "29/08", "SABADO", "09:30"),
    ]),
    ("Setembro", "SET", [
        (1, "02/09", "QUARTA", "20:30"),
        (2, "02/09", "QUARTA", "21:05"),
        (3, "05/09", "SABADO", "09:00"),
        (4, "05/09", "SABADO", "09:30"),
        (5, "16/09", "QUARTA", "20:30"),
        (6, "16/09", "QUARTA", "21:05"),
        (7, "19/09", "SABADO", "09:00"),
        (8, "19/09", "SABADO", "09:30"),
        (9, "30/09", "QUARTA", "20:30"),
        (10, "30/09", "QUARTA", "21:05"),
    ]),
    ("Outubro", "OUT", [
        (1, "03/10", "SABADO", "09:00"),
        (2, "03/10", "SABADO", "09:30"),
        (3, "14/10", "QUARTA", "20:30"),
        (4, "14/10", "QUARTA", "21:05"),
        (5, "17/10", "SABADO", "09:00"),
        (6, "17/10", "SABADO", "09:30"),
        (7, "28/10", "QUARTA", "20:30"),
        (8, "28/10", "QUARTA", "21:05"),
        (9, "31/10", "SABADO", "09:00"),
        (10, "31/10", "SABADO", "09:30"),
    ]),
    ("Novembro", "NOV", [
        (1, "04/11", "QUARTA", "20:30"),
        (2, "04/11", "QUARTA", "21:05"),
        (3, "07/11", "SABADO", "09:00"),
        (4, "07/11", "SABADO", "09:30"),
        (5, "18/11", "QUARTA", "20:30"),
        (6, "18/11", "QUARTA", "21:05"),
        (7, "21/11", "SABADO", "09:00"),
        (8, "21/11", "SABADO", "09:30"),
    ]),
    ("Dezembro", "DEZ", [
        (1, "02/12", "QUARTA", "20:30"),
        (2, "02/12", "QUARTA", "21:05"),
        (3, "05/12", "SABADO", "09:00"),
        (4, "05/12", "SABADO", "09:30"),
        (5, "16/12", "QUARTA", "20:30"),
        (6, "16/12", "QUARTA", "21:05"),
        (7, "19/12", "SABADO", "09:00"),
        (8, "19/12", "SABADO", "09:30"),
    ]),
]


def draw_bg(c):
    c.setFillColor(BLACK)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    if BACKGROUND.exists():
        image = ImageReader(str(BACKGROUND))
        iw, ih = image.getSize()
        scale = max(W / iw, H / ih)
        dw, dh = iw * scale, ih * scale
        c.drawImage(image, (W - dw) / 2, (H - dh) / 2, dw, dh, mask="auto")
    c.saveState()
    c.setFillColor(BLACK)
    c.setFillAlpha(0.72)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(ACID)
    c.setFillAlpha(0.12)
    c.rotate(7)
    c.rect(-70, H * 0.57, W + 170, 48, fill=1, stroke=0)
    c.restoreState()


def header(c, section, page):
    x, y, w, h = 34, H - 77, W - 68, 42
    c.setStrokeColor(ACID)
    c.setLineWidth(1.4)
    c.roundRect(x, y, w, h, 21, stroke=1, fill=0)
    if MARK.exists():
        c.drawImage(str(MARK), x + 14, y + 10, 22, 22, mask="auto")
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(WHITE)
    c.drawString(x + 45, y + 18, "LEGENDS")
    c.setFillColor(ACID)
    c.drawString(x + 103, y + 18, "KART SERIES")
    c.setFont("Helvetica-Bold", 10)
    c.drawRightString(x + w - 16, y + 24, "1a EDICAO - 2026")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7.5)
    c.drawRightString(x + w - 16, y + 10, section)
    c.setStrokeColor(ACID)
    c.setLineWidth(0.5)
    c.line(42, 28, W - 42, 28)
    c.setFillColor(ACID)
    c.setFont("Helvetica-Bold", 7.8)
    c.drawRightString(W - 42, 13, f"P1 ACADEMY - LEGENDS KART SERIES | {page:02d}")


def text(c, x, y, value, size=12, color=WHITE, font="Helvetica"):
    c.setFont(font, size)
    c.setFillColor(color)
    c.drawString(x, y, value)


def centered(c, x, y, w, value, size=12, color=WHITE, font="Helvetica"):
    c.setFont(font, size)
    c.setFillColor(color)
    c.drawCentredString(x + w / 2, y, value)


def centered_fit(c, x, y, w, value, max_size, min_size, color=WHITE, font="Helvetica-Bold"):
    size = max_size
    while size > min_size and stringWidth(value, font, size) > w - 6:
        size -= 0.5
    centered(c, x, y, w, value, size, color, font)


def card(c, x, y, w, h, stroke=LINE, fill=PANEL, alpha=0.78):
    c.saveState()
    c.setFillColor(fill)
    c.setFillAlpha(alpha)
    c.setStrokeColor(stroke)
    c.setStrokeAlpha(0.85)
    c.setLineWidth(1.0)
    c.roundRect(x, y, w, h, 13, stroke=1, fill=1)
    c.restoreState()


def fit_text(c, x, y, w, value, max_size, min_size, color=WHITE, font="Helvetica-Bold"):
    size = max_size
    while size > min_size and stringWidth(value, font, size) > w:
        size -= 0.5
    text(c, x, y, value, size, color, font)


def draw_cover(c):
    draw_bg(c)
    header(c, "CALENDARIO OFICIAL", 1)
    card(c, 43, 284, W - 86, 180, alpha=0.86)
    text(c, 60, 410, "LEGENDS", 41, WHITE, "Helvetica-Bold")
    text(c, 60, 360, "KART SERIES", 42, ACID, "Helvetica-Bold")
    c.setStrokeColor(ACID)
    c.setLineWidth(1.2)
    c.line(60, 343, 330, 343)
    text(c, 60, 308, "CALENDARIO OFICIAL", 19, WHITE, "Helvetica-Bold")
    text(c, 60, 285, "Temporada 2026 - Legends Heat - Kartodromo Internacional de Betim", 9.5, MUTED)
    if MARK.exists():
        c.drawImage(str(MARK), W - 108, 354, 44, 44, mask="auto")
    stats = [
        ("56", "corridas"),
        ("JUL-DEZ", "periodo"),
        ("LH", "codigo oficial"),
        ("20:30 / 21:05", "quartas"),
        ("09:00 / 09:30", "sabados"),
    ]
    card(c, 52, 219, W - 104, 64, alpha=0.82)
    col_w = (W - 104) / len(stats)
    for idx, (value, label) in enumerate(stats):
        x = 52 + idx * col_w
        if idx:
            c.setStrokeColor(colors.HexColor("#4b4e3b"))
            c.line(x, 232, x, 268)
        centered_fit(c, x, 250, col_w, value, 19 if idx < 3 else 13, 9, ACID, "Helvetica-Bold")
        centered(c, x, 235, col_w, label, 7.5, MUTED)
    card(c, 52, 87, W - 104, 82, alpha=0.82)
    text(c, 72, 141, "LOCAL OFICIAL", 8, ACID, "Helvetica-Bold")
    text(c, 72, 117, "Kartodromo Internacional de Betim", 19, WHITE, "Helvetica-Bold")
    text(c, 72, 96, "Av. Adutora Varzea das Flores, 477 - Itacolomi, Betim - MG, 32672-586", 8.8, MUTED)
    text(c, 72, 72, "ORGANIZACAO", 8, ACID, "Helvetica-Bold")
    text(c, 154, 72, "Andre Felisberto - WhatsApp: (21) 99596-0077", 8.8, WHITE, "Helvetica-Bold")


def draw_summary(c):
    draw_bg(c)
    header(c, "RESUMO DA TEMPORADA", 2)
    text(c, 42, H - 142, "TEMPORADA EM UMA PAGINA", 25, WHITE, "Helvetica-Bold")
    text(c, 42, H - 163, "Janelas oficiais, volume por mes e regras rapidas de leitura do calendario.", 10.5, MUTED)
    x0, y0, gap = 66, H - 252, 88
    c.setStrokeColor(ACID)
    c.setLineWidth(1.2)
    c.line(x0 + 10, y0, x0 + gap * 5 + 10, y0)
    for idx, (month, code, races) in enumerate(CALENDAR):
        x = x0 + idx * gap
        c.setFillColor(ACID)
        c.circle(x + 10, y0, 5, fill=1, stroke=0)
        centered(c, x - 18, y0 + 20, 56, code, 9, ACID, "Helvetica-Bold")
        centered(c, x - 18, y0 - 24, 56, str(len(races)), 18, WHITE, "Helvetica-Bold")
        centered(c, x - 18, y0 - 39, 56, "LH", 8, MUTED, "Helvetica-Bold")
    cards = [
        ("QUARTAS", "20:30 e 21:05", "Duas janelas noturnas nas semanas oficiais."),
        ("SABADOS", "09:00 e 09:30", "Duas baterias pela manha nos fins de semana previstos."),
        ("FORMATO", "Rental kart", "Categoria unica, tomada de tempo e lastro-base de 100 kg."),
        ("CODIFICACAO", "LH-XX", "Cada corrida do calendario aparece como Legends Heat."),
    ]
    for idx, (title, value, desc) in enumerate(cards):
        x = 42 + (idx % 2) * 264
        y = H - 409 - (idx // 2) * 112
        card(c, x, y, 246, 88, alpha=0.72)
        text(c, x + 16, y + 63, title, 8.5, ACID, "Helvetica-Bold")
        fit_text(c, x + 16, y + 38, 210, value, 19, 12, WHITE)
        text(c, x + 16, y + 20, desc, 8.4, MUTED)
    card(c, 42, 72, W - 84, 160, alpha=0.80)
    text(c, 62, 201, "DISTRIBUICAO OFICIAL", 8.5, ACID, "Helvetica-Bold")
    text(c, 62, 178, "56 corridas entre 01/07/2026 e 19/12/2026", 18, WHITE, "Helvetica-Bold")
    box_w = 132
    for idx, (month, code, races) in enumerate(CALENDAR):
        x = 62 + (idx % 3) * 160
        y = 138 - (idx // 3) * 48
        c.saveState()
        c.setFillColor(colors.HexColor("#1b1d18"))
        c.setFillAlpha(0.9)
        c.roundRect(x, y, box_w, 36, 8, fill=1, stroke=0)
        c.restoreState()
        text(c, x + 12, y + 22, month, 10, WHITE, "Helvetica-Bold")
        text(c, x + 12, y + 9, f"{len(races)} corridas", 7.6, MUTED)
        text(c, x + box_w - 45, y + 12, code, 15, ACID, "Helvetica-Bold")


def draw_month_table(c, x, top_y, w, month, code, rows):
    text(c, x, top_y, month.upper(), 18, WHITE, "Helvetica-Bold")
    text(c, x, top_y - 18, f"{len(rows)} corridas oficiais", 8.5, MUTED)
    text(c, x + w - 34, top_y - 9, code, 16, ACID, "Helvetica-Bold")
    row_h = 21
    header_h = 22
    table_y = top_y - 38 - (header_h + row_h * len(rows))
    c.setFillColor(BLACK)
    c.setStrokeColor(colors.HexColor("#2b2f23"))
    c.roundRect(x, table_y, w, header_h + row_h * len(rows), 7, fill=1, stroke=1)
    c.setFillColor(ACID)
    c.setFillAlpha(0.95)
    c.rect(x, table_y + row_h * len(rows), w, header_h, fill=1, stroke=0)
    c.setFillAlpha(1)
    headers = [("HEAT", 0.18), ("DATA", 0.24), ("DIA", 0.30), ("HORA", 0.28)]
    cx = x
    for label, frac in headers:
        cw = w * frac
        centered(c, cx, table_y + row_h * len(rows) + 7, cw, label, 7.2, BLACK, "Helvetica-Bold")
        cx += cw
    for idx, (race, date, day, hour) in enumerate(rows):
        yy = table_y + row_h * (len(rows) - idx - 1)
        if idx % 2:
            c.setFillColor(colors.HexColor("#151715"))
            c.rect(x, yy, w, row_h, fill=1, stroke=0)
        c.setStrokeColor(colors.HexColor("#2b2f23"))
        c.line(x, yy, x + w, yy)
        values = [f"LH-{global_heat_number(month, race):02d}", date, day.title(), hour]
        cx = x
        for (label, frac), value in zip(headers, values):
            cw = w * frac
            centered(c, cx, yy + 7, cw, value, 7.7 if len(value) < 8 else 7.2, WHITE if label != "HORA" else ACID, "Helvetica-Bold")
            cx += cw


def global_heat_number(month, race):
    total = 0
    for current_month, _, rows in CALENDAR:
        if current_month == month:
            return total + race
        total += len(rows)
    return race


def draw_calendar_page(c, section, page, months):
    draw_bg(c)
    header(c, section, page)
    text(c, 42, H - 132, section, 24, WHITE, "Helvetica-Bold")
    text(c, 42, H - 153, "Kartodromo Internacional de Betim", 9.8, MUTED)
    text(c, W - 225, H - 153, "Calendario oficial Legends Heat 2026", 9.8, MUTED)
    y = H - 200
    for idx, item in enumerate(months):
        x = 42 + idx * 264
        draw_month_table(c, x, y, 238, *item)
    text(c, 42, 46, "Observacao: alteracoes operacionais serao comunicadas pelos canais oficiais da organizacao.", 7.4, MUTED)


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=A4)
    c.setTitle("Calendario Oficial Legends Kart Series 2026")
    c.setAuthor("P1 Academy")
    c.setSubject("Calendario oficial da Legends Kart Series 2026")
    draw_cover(c)
    c.showPage()
    draw_summary(c)
    c.showPage()
    draw_calendar_page(c, "JULHO E AGOSTO", 3, CALENDAR[0:2])
    c.showPage()
    draw_calendar_page(c, "SETEMBRO E OUTUBRO", 4, CALENDAR[2:4])
    c.showPage()
    draw_calendar_page(c, "NOVEMBRO E DEZEMBRO", 5, CALENDAR[4:6])
    c.showPage()
    c.save()
    print(OUTPUT)


if __name__ == "__main__":
    main()
