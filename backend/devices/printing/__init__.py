# -*- coding: utf8 -*-
import os
from datetime import datetime
from logging import getLogger

from reportlab.graphics.barcode import createBarcodeDrawing
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle

from devices.printing.printer import Printer

FILE_DIR = os.path.dirname(os.path.abspath(__file__))
RECEIPT_FILE_PATH = os.path.join(FILE_DIR, 'receipt.pdf')
logger = getLogger(__name__)

DESCRIPTION = 'Пиво темне. Не пастеризоване "Бургомістр Блек". Виробник: ТзОВ "Інтер Бір Трейд". Юридична адреса: 79052, м.Львів, вул.Півколо, 14. Склад: вода питна підготовлена, солод ячмінний, хміль, дріжджі пивні. Термін придатності - 5 діб. Зберігати при температурі від +2 до +5 градусів у затемненому приміщенні. Номер партії відповідає даті виготовлення. Без ГМО. Вміст спирту не менше - 5%. Масова частка сухих речовин у початковому суслі - 14,7%. Енергетична цінність в 100г продукту - 52кКал. Поживна(харчова) цінність в 100г продукту - 4,8г вуглеводів. ДСТУ 3888-99. Допускається наявність дріжджового осаду. Ліцензія N°990108201800071. Не рекомендується вживати дітям віком до 18 років, вагітним, особам, які мають медичні чи професійні протипоказання.'
DESCRIPTION_LIGHT_BEER = 'Пиво світле. Не пастеризоване "Бургомістр Пілснер". Виробник: ТзОВ "Інтер Бір Трейд". Юридична адреса: 79052, м.Львів, вул.Півколо, 14. Склад: вода питна підготовлена, солод ячмінний, хміль, дріжджі пивні. Термін придатності - 5 діб. Зберігати при температурі від +2 до +5 градусів у затемненому приміщенні. Номер партії відповідає даті виготовлення. Без ГМО. Вміст спирту не менше - 4,2%. Масова частка сухих речовин у початковому суслі - 12%. Енергетична цінність в 100г продукту - 48кКал. Поживна(харчова) цінність в 100г продукту - 4,6г вуглеводів. ДСТУ 3888-99. Допускається наявність дріжджового осаду. Ліцензія N°990108201800071. Не рекомендується вживати дітям віком до 18 років, вагітним, особам, які мають медичні чи професійні протипоказання.'


def create_pdf(barcode, description):
    pdf_settings = {
        'rightMargin': 0,
        'topMargin': 0,
        'bottomMargin': 0,
        'leftMargin': 0,
        'pagesize': (90 * mm, 58 * mm)
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

    styles.add(ParagraphStyle(
        name='ItemS',
        fontName='arialbold.ttf',
        alignment=0,
        fontSize=6
    ))

    styles.add(ParagraphStyle(
        name='Right7SpaceBefore5',
        fontName='arialbold.ttf',
        alignment=TA_LEFT,
        fontSize=7
    ))

    return styles


def receipt_body(styles, barcode, description=DESCRIPTION):
    story = list()

    _barcode = createBarcodeDrawing('EAN13', value=barcode, height=7 * mm, barWidth=0.5 * mm, humanReadable=False,
                                    lquiet=True, rquiet=True)
    print_date = datetime.today().strftime('%Y/%m/%d')
    tab = Table([
        [_barcode, Paragraph(f"Дата розливу: {print_date}  Обєм 1000ml", styles["Right7SpaceBefore5"])]

    ], colWidths=[50 * mm, 40 * mm], rowHeights=[10 * mm])
    tab.setStyle(TableStyle([
        ("HALIGN", (0, 0), (0, 0), "LEFT"),
        ("VALIGN", (0, 0), (1, 0), "TOP"),
    ]))
    story.append(tab)
    story.append(Paragraph(description, styles["ItemS"]))
    return story


def print_receipt(barcode, description):
    Printer.print(create_pdf(barcode, description))


if __name__ == "__main__":
    print_receipt(21312312312312, DESCRIPTION)
