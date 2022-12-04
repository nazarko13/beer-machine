import csv
import os
from datetime import datetime, date
from logging import getLogger

from export.telegram_bot import send_document
from models.models import init_database, BeerStatistics
from settings import SHOP_NAME

logger = getLogger(__name__)


def write_to_csv(data, filename):
    with open(filename, 'w', newline='') as out:
        csv_out = csv.writer(out)
        # column headers
        headers = [x for x in BeerStatistics._meta.sorted_field_names]
        csv_out.writerow(headers)

        # write data rows
        for row in data:
            csv_out.writerow(row)


def export_beer_statistics_to_csv():
    file_name = "{}_{}.csv".format(SHOP_NAME.replace(" ", '_'), date.today())
    beer_data = BeerStatistics.select().order_by(BeerStatistics.id.desc()).where(
        BeerStatistics.pour_date.between(datetime.today().replace(day=1, hour=1), datetime.now())
    ).tuples()

    # export to csv file
    write_to_csv(beer_data, file_name)
    return file_name


def delete_file(file_name):
    if os.path.exists(file_name):
        os.remove(file_name)
        logger.info(f"CSV EXPORT. DELETE FILE. The file {file_name} successfully deleted.")
    else:
        logger.info(f"CSV EXPORT. DELETE FILE. The file {file_name} does not exist.")


def send_statistics():
    try:
        init_database()
        file_name = export_beer_statistics_to_csv()
        send_document(file_name)
        delete_file(file_name)
    except Exception as e:
        logger.error(f"CSV EXPORT. Could not send csv file. Error: {e}")


if __name__ == "__main__":
    send_statistics()
    # init_database()
    # export_beer_statistics_to_csv()
