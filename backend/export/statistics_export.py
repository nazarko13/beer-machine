import csv
import os
from datetime import date
from logging import getLogger

import xlsxwriter
from export.telegram_bot import send_document
from models.models import init_database, BeerStatistics
from settings import SHOP_NAME

logger = getLogger(__name__)


def write_to_csv(rows, headers, filename):
    filename = f'{filename}.csv'
    with open(filename, 'w', newline='', encoding='utf-8') as out:
        csv_out = csv.writer(out)
        # column headers
        csv_out.writerow(headers)
        # write data rows
        for row in rows:
            csv_out.writerow(row)


def write_to_excel(rows, headers, filename):
    filename = f'{filename}.xlsx'
    workbook = xlsxwriter.Workbook(filename)
    worksheet = workbook.add_worksheet()
    # write headers
    for idx, header in enumerate(headers):
        worksheet.write(0, idx, header)
    # write data
    for idx, beer_data in enumerate(rows, start=1):
        worksheet.write_row(idx, 0, beer_data)

    workbook.close()
    return filename


def export_beer_statistics(in_csv=False):
    file_name = "{}_{}".format(SHOP_NAME.replace(" ", '_'), date.today())
    beer_data = BeerStatistics.select().order_by(BeerStatistics.id.desc()).tuples()
    headers = BeerStatistics._meta.sorted_field_names
    # export to csv file
    if in_csv:
        return write_to_csv(beer_data, headers, file_name)
    return write_to_excel(beer_data, headers, file_name)


def delete_file(file_name):
    if os.path.exists(file_name):
        os.remove(file_name)
        logger.info(f"STATISTICS EXPORT. DELETE FILE. The file {file_name} successfully deleted.")
    else:
        logger.info(f"STATISTICS EXPORT. DELETE FILE. The file {file_name} does not exist.")


def send_statistics():
    try:
        init_database()
        file_name = export_beer_statistics()
        send_document(file_name)
        delete_file(file_name)
    except Exception as e:
        logger.error(f"CSV EXPORT. Could not send csv file. Error: {e}")


if __name__ == "__main__":
    init_database()
    send_statistics()
    export_beer_statistics(in_csv=False)
