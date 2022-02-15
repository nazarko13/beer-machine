# -*- coding: utf8 -*-
import os
from datetime import datetime
from logging import getLogger

from reportlab.graphics.barcode import code128
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm, inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, Image
from reportlab.platypus.flowables import HRFlowable

# from devices.printing.printer import Printer
from devices.printing.rotated_text import VerticalText
from utils import read_settings

FILE_DIR = os.path.dirname(os.path.abspath(__file__))
RECEIPT_FILE_PATH = os.path.join(FILE_DIR, 'receipt.pdf')
logger = getLogger(__name__)

DESCRIPTION = 'Пиво темне. Не пастеризоване "Бургомістр Блек". Виробник: ТзОВ "Інтер Бір Трейд". Юридична адреса: 79052, м.Львів, вул.Півколо, 14. Склад: вода питна підготовлена, солод ячмінний, хміль, дріжджі пивні. Термін придатності - 5 діб. Зберігати при температурі від +2 до +5 градусів у затемненому приміщенні. Номер партії відповідає даті виготовлення. Без ГМО. Вміст спирту не менше - 5%. Масова частка сухих речовин у початковому суслі - 14,7%. Енергетична цінність в 100г продукту - 52кКал. Поживна(харчова) цінність в 100г продукту - 4,8г вуглеводів. ДСТУ 3888-99. Допускається наявність дріжджового осаду. Ліцензія N°990108201800071. Не рекомендується вживати дітям віком до 18 років, вагітним, особам, які мають медичні чи професійні протипоказання.'

SENTENCES = {
    "ua": {
        "Terminal": "ТЕРМІНАЛ",
        "Tray": "КОМІРКА",
        "One-time code": "ОДНОРАЗОВИЙ КОД",
        "Please, scan": "ЗІСКАНУЙТЕ ДЛЯ",
        "to open the tray": "ВІДКРИТТЯ КОМІРКИ",
        "Enter the code": "ВВЕДІТЬ КОД"},
    "en": {
        "Terminal": "TERMINAL",
        "Tray": "TRAY",
        "One-time code": "ONE-TIME CODE",
        "Please, scan": "PLEASE, SCAN",
        "to open the tray": "TO OPEN THE TRAY",
        "Enter the code": "ENTER THE CODE"}
}


def create_pdf(tray_id, auth_code, lang, bottling_date):
    pdf_settings = {
        'rightMargin': 0,
        'topMargin': 0,
        'bottomMargin': 0,
        'leftMargin': 0,
        'pagesize': (58 * mm, 100 * mm)
    }

    pdfmetrics.registerFont(TTFont("arialbold.ttf", os.path.join(FILE_DIR, 'arialbold.ttf')))
    pdf_report = open(RECEIPT_FILE_PATH, "wb")
    doc = SimpleDocTemplate(pdf_report, **pdf_settings)

    # styles
    styles = add_styles()

    story = receipt_body(styles, auth_code, tray_id, lang, bottling_date)
    doc.build(story)

    logger.info("Receipt has been created: Tray #{}, code - {}".format(tray_id, auth_code))
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
        alignment=1,
        fontSize=10
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


def receipt_body(styles, barcode, tray_id, lang, bottling_date):
    words = SENTENCES.get(lang) or SENTENCES["ua"]
    colwidths = [20 * mm, 15 * mm, 28]

    # Two rows with variable height
    rowheights = [.4 * inch]
    story = list()
    story.append(Paragraph("PIDARAS", styles["ItemS"]))
    # for line in chunks(DESCRIPTION, 50):
    #     story.append(Paragraph(line, styles["ItemS"]))
    barcode128 = code128.Code128(barcode, barWidth=0.5, barHeight=20, lquiet=0, rquiet=0)
    # barcode128.vAlign = 'CENTER'
    a = "Термін придатності  21/12/21-11/18/22"
    tab = Table([
        [VerticalText(bottling_date, styles["ItemS"], 5),'asdas', barcode],
        # [VerticalText("Дата розливу"), a, barcode128]
    ], colWidths=colwidths, rowHeights=rowheights)
    tab.setStyle(TableStyle([
        # ("VALIGN", (0, 0), (2, 1), "MIDDLE"),
        ("FONTSIZE", (0, 0), (2, 0), 5),
        ("FONTSTYLE", (0, 0), (2, 0), styles["ItemS"]),
    ]))
    story.append(tab)
    t = Table([["SOME STR"]])
    t.setStyle(TableStyle([('VALIGN', (-1, -1), (-1, -1), 'MIDDLE')]))
    story.append(t)
    # story.append(Paragraph("{} <font fontsize = {}>{}</font> {} {} <font fontsize = {}>{}</font>".format(
    #     words["Terminal"],
    #     14,
    #     read_settings()['COMMON']['terminal_number'],
    #     "&nbsp" * 15,
    #     words["Tray"],
    #     14,
    #     tray_id
    # ), styles["ItemM"]))
    #
    # story.append(Paragraph("", styles["BlankLine"]))
    #
    # story.append(Paragraph(words["One-time code"], styles["ItemL"]))
    #
    # story.append(Paragraph("", styles["BlankLine"]))
    #
    # barcode128 = code128.Code128(auth_code, barWidth=1.2, barHeight=50, lquiet=0, rquiet=0)
    # barcode128.vAlign = 'CENTER'
    # arrow = Image(os.path.join("printing", "arrow.png"), width=20, height=40)
    # tab = Table([[arrow, barcode128, arrow]])
    # tab.setStyle(TableStyle([
    #     ("VALIGN", (0, 0), (2, 0), "MIDDLE")
    # ]))
    # story.append(tab)
    #
    # story.append(Paragraph("", styles["BlankLineS"]))
    #
    # story.append(Paragraph(words["Please, scan"], styles["ItemM"]))
    # story.append(Paragraph(words["to open the tray"], styles["ItemM"]))
    #
    # story.append(Paragraph("", styles["BlankLine"]))
    # story.append(HRFlowable(width='60%', thickness=1, color="#000000"))
    # story.append(Paragraph("", styles["BlankLine"]))
    #
    # story.append(Paragraph(words["Enter the code"], styles["ItemS"]))
    # story.append(Paragraph("<font fontsize = {}>{}</font>".format(16, auth_code), styles["ItemM"]))
    #
    # story.append(Paragraph("", styles["BlankLine"]))
    # story.append(Paragraph("", styles["BlankLine"]))
    # story.append(Paragraph("", styles["BlankLine"]))
    #
    # story.append(Paragraph(datetime.now().strftime('%Y/%m/%d %H:%M'), styles["Date"]))
    # story.append(Paragraph(read_settings()['COMMON']['shop_name'], styles["Shop"]))

    return story


def print_receipt(tray_id, auth_code, lang):
    create_pdf(tray_id, auth_code, lang, "2022/01/17 18:32")


if __name__ == "__main__":
    print_receipt(1, 21312312312312, "ua")
