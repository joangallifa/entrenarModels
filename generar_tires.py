"""Genera plantilla-tires-5x1-A4.pdf: full A4 vertical amb 8 tires (1 columna x 8 files)
de 5 x 1 caselles de 2 x 2 cm. Cada tira es retalla i es dona a una persona. Imprimir al 100 %."""
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm
from reportlab.lib.pagesizes import A4

W, H = A4
COLS, FILES, TIRES_X = 5, 8, 1
CASELLA = 2 * cm
GAP = 1.5 * cm  # espai entre tires per poder tallar
tira_w = COLS * CASELLA
bloc_w = TIRES_X * tira_w + (TIRES_X - 1) * GAP
bloc_h = FILES * CASELLA + (FILES - 1) * GAP
x0 = (W - bloc_w) / 2
y0 = (H - bloc_h) / 2

c = canvas.Canvas("plantilla-tires-5x1-A4.pdf", pagesize=(W, H))
c.setLineWidth(1.2)
for f in range(FILES):
    y = y0 + (FILES - 1 - f) * (CASELLA + GAP)
    for tx in range(TIRES_X):
        xt = x0 + tx * (tira_w + GAP)
        for i in range(COLS):
            c.rect(xt + i * CASELLA, y, CASELLA, CASELLA)
# marques de tall discontínues
c.setDash(3, 3); c.setLineWidth(0.4)
for f in range(FILES - 1):
    yt = y0 + (FILES - 1 - f) * (CASELLA + GAP) - GAP / 2
    c.line(1 * cm, yt, W - 1 * cm, yt)
c.save()
