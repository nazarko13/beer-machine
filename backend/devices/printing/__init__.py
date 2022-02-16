# -*- coding: utf8 -*-
import os
from logging import getLogger

from reportlab.graphics.barcode import code128
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm, inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle

from devices.printing.printer import Printer
from devices.printing.rotated_text import VerticalText

FILE_DIR = os.path.dirname(os.path.abspath(__file__))
RECEIPT_FILE_PATH = os.path.join(FILE_DIR, 'receipt.pdf')
logger = getLogger(__name__)

DESCRIPTION = 'Пиво темне. Не пастеризоване "Бургомістр Блек". Виробник: ТзОВ "Інтер Бір Трейд". Юридична адреса: 79052, м.Львів, вул.Півколо, 14. Склад: вода питна підготовлена, солод ячмінний, хміль, дріжджі пивні. Термін придатності - 5 діб. Зберігати при температурі від +2 до +5 градусів у затемненому приміщенні. Номер партії відповідає даті виготовлення. Без ГМО. Вміст спирту не менше - 5%. Масова частка сухих речовин у початковому суслі - 14,7%. Енергетична цінність в 100г продукту - 52кКал. Поживна(харчова) цінність в 100г продукту - 4,8г вуглеводів. ДСТУ 3888-99. Допускається наявність дріжджового осаду. Ліцензія N°990108201800071. Не рекомендується вживати дітям віком до 18 років, вагітним, особам, які мають медичні чи професійні протипоказання.'


def create_pdf(barcode, description):
    pdf_settings = {
        'rightMargin': 0,
        'topMargin': 0,
        'bottomMargin': 0,
        'leftMargin': 0,
        'pagesize': (95 * mm, 58 * mm)
    }

    pdfmetrics.registerFont(TTFont("arialbold.ttf", os.path.join(FILE_DIR, 'arialbold.ttf')))
    pdf_report = open(RECEIPT_FILE_PATH, "wb")
    doc = SimpleDocTemplate(pdf_report, **pdf_settings)

    # styles
    styles = add_styles()

    story = receipt_body(styles, barcode, description)
    doc.build(story)

    logger.info("Receipt has been created: Barcode #{}.".format(barcode))
    return RECEIPT_FILE_PATH


def add_styles():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='SomeTest',
                              fontName='arialbold.ttf',
                              fontSize=6,
                              leading=12,
                              spaceBefore=6)
               )

    styles.add(ParagraphStyle(
        name='BlankLine',
        spaceAfter=10
    ))

    styles.add(ParagraphStyle(
        name='BlankLineS',
        spaceAfter=5
    ))

    styles.add(ParagraphStyle(
        name='ItemS',
        fontName='arialbold.ttf',
        alignment=0,
        fontSize=4
    ))

    styles.add(ParagraphStyle(
        name='ItemM',
        fontName='arialbold.ttf',
        alignment=0,
        fontSize=4
    ))

    styles.add(ParagraphStyle(
        name='ItemL',
        fontName='arialbold.ttf',
        alignment=1,
        fontSize=14
    ))

    styles.add(ParagraphStyle(
        name='Date',
        fontName='arialbold.ttf',
        alignment=0,
        leftIndent=15,
        spaceBefore=5,
        leading=0,
        fontSize=8
    ))

    styles.add(ParagraphStyle(
        name='Shop',
        fontName='arialbold.ttf',
        alignment=2,
        rightIndent=15,
        fontSize=8
    ))

    return styles


def chunks(s, n):
    """Produce `n`-character chunks from `s`."""
    for start in range(0, len(s), n):
        yield s[start:start + n]


def receipt_body(styles, barcode, description):
    # Two rows with variable height
    rowheights_inner = [.1 * inch, .1 * inch, .1 * inch]
    rowheights = [.5 * inch, .2 * inch]
    story = list()

    barcode128 = code128.Code128(barcode, barWidth=0.9, barHeight=20, lquiet=0, rquiet=0)
    inner_tab = Table([
        [Paragraph("Термін придатності:", styles["ItemM"])],
        [Paragraph("вжити до 2022/02/22", styles["ItemM"])],
        [Paragraph("Обєм 1000ml", styles["ItemM"])],

    ], rowHeights=rowheights_inner)
    inner_tab.setStyle(TableStyle([
        ("ALIGN", (0, 0), (0, 1), "LEFT"),
        ("FONTSIZE", (0, 0), (0, 1), 4),

    ]))
    tab = Table([
        [barcode128, inner_tab],
        [barcode]

    ], rowHeights=rowheights)
    tab.setStyle(TableStyle([
        ("ALIGN", (0, 0), (0, 1), "CENTER"),
        ("FONTSIZE", (0, 0), (1, 1), 4),
    ]))
    story.append(tab)
    for line in chunks(DESCRIPTION, 120):
        story.append(Paragraph(line, styles["ItemS"]))

    return story


def print_receipt(barcode, description):
    Printer.print(create_pdf(barcode, description))


if __name__ == "__main__":
    print_receipt(21312312312312, "TETSSTSTSTS")
