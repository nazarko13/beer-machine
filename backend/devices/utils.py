from export.telegram_bot import send_message
from models.models import BeerStatistics

EXCEPTION_ACTIONS_TO_SENT_NOTIFICATION = {
    "take_air_pressure_into_system": "Закінчився балон",
    "intake_air": "Закінчилось пиво: "
}
EXCEPTION_ACTIONS_TO_SAVE_IN_STATISTICS = {
    "close_door_check_sensor": "Перешкода на шторці",
    "press_bottle": "Не вставлена пляшка",
    "take_air_pressure_into_system": "Закінчився балон",
    "intake_air": "Закінчилось пиво"
}


def handle_board_error_action(action: str, beer_statistics: BeerStatistics):
    statistics_msg = EXCEPTION_ACTIONS_TO_SAVE_IN_STATISTICS.get(action)
    notification_msg = EXCEPTION_ACTIONS_TO_SENT_NOTIFICATION.get(action)
    if notification_msg:
        if action == 'intake_air':
            send_message(notification_msg + beer_statistics.beer_name, error=True)
        else:
            send_message(notification_msg, error=True)
    if statistics_msg:
        BeerStatistics.update({
            BeerStatistics.status: "Error",
            BeerStatistics.error_message: statistics_msg,
            BeerStatistics.remains: beer_statistics.remains + 1
        }).where(BeerStatistics.id == beer_statistics.id).execute()
