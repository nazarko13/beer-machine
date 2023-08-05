from logging import getLogger

import requests

from settings import SHOP_NAME, TELEGRAM_BASE_URL, TELEGRAM_CHAT_ID

logger = getLogger(__name__)


def get_updates():
    resp = requests.get(f'{TELEGRAM_BASE_URL}/getUpdates')
    print(resp.json())


def http_error_handler(response):
    if response.status_code != 200:
        logger.error(f"TELEGRAM BOT. HTTP_ERROR_HANDLER. Status code: {response.status_code}. Resp:{response.json()}")


def send_message(message="hello from your telegram bot", error=False, timeout=5):
    if error:
        message = "❗️Помилка. " + message
    try:
        response = requests.get(
            url=f'{TELEGRAM_BASE_URL}/sendMessage?chat_id={TELEGRAM_CHAT_ID}&text={SHOP_NAME}. {message}',
            timeout=timeout
        )
        http_error_handler(response)
    except Exception as e:
        logger.error(f"TELEGRAM BOT. SEND MESSAGE. Could not send message due to error: {e}")
    logger.info(f"TELEGRAM BOT. SEND MESSAGE. Error: {message}")


def send_document(filename: str):
    files = {'document': open(filename, 'rb')}
    response = requests.post(f"{TELEGRAM_BASE_URL}/sendDocument?chat_id={TELEGRAM_CHAT_ID}", files=files, timeout=30)
    http_error_handler(response)


if __name__ == "__main__":
    send_message("❗️Помилка. Закінчилось пиво: Пиво світле")
    # send_document("BK_production_2022-11-13.cvs")
