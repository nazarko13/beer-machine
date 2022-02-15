import subprocess
from logging import getLogger

from escpos import printer
from usb import core, util

from settings import PRINTER_NAME
from utils import Singleton

logger = getLogger(__name__)


class Printer(metaclass=Singleton):

    def __init__(self):
        self.printer = self.find_available_printer()

    @staticmethod
    def find_available_printer():
        printers = {
            "Custom_TG2480-H": {
                'vendor_id': 0xdd4,
                'command': '\x10\x04\x14',
                'statuses': {0: "ok", 1: "lack", 4: "few", 5: "lack"},
                'conversion': lambda x: x[2] & 0b101
            },
            "Masung_EP802-TU": {
                'vendor_id': 0x519,
                'command': '\x10\x04\x04',
                'statuses': {0: "ok", 96: "lack", 12: "few", 108: "lack"},
                'conversion': lambda x: x[0] & 0b1101100
            }
        }

        available_devices = [(cfg.idVendor, cfg.idProduct) for cfg in core.find(find_all=True)]
        for model in printers:
            for device in available_devices:
                if printers[model]['vendor_id'] == device[0]:
                    printers[model]['product_id'] = device[1]

                    usb_printer = printer.Usb(device[0], device[1])
                    out_ep, in_ep = usb_printer.device.configurations()[0].interfaces()[0].endpoints()
                    if util.endpoint_direction(out_ep.bEndpointAddress) == util.ENDPOINT_IN:
                        out_ep, in_ep = in_ep, out_ep
                    usb_printer.close()

                    printers[model]['out_ep'] = out_ep
                    printers[model]['in_ep'] = in_ep
                    return printers[model]

    def get_paper_status(self):
        ignored_errnos = [16, 19]  # Printer error numbers that are not critical
        printer_info = {}
        printer_description = "Ok"
        printer_timeout = 5000

        if not self.printer:
            return None, 'Printer is not connected'

        try:
            usb_printer = printer.Usb(self.printer['vendor_id'], self.printer['product_id'])
            usb_printer.device.write(self.printer['out_ep'], self.printer['command'], printer_timeout)
            response = usb_printer.device.read(self.printer['in_ep'], printer_timeout)
            usb_printer.close()

            status_code = self.printer['conversion'](response)

            printer_info['paper_status'] = self.printer['statuses'][status_code]
            logger.info("Received status from printer: {}".format(printer_info['paper_status']))
        except Exception as e:
            printer_info = None
            printer_description = str(e)

            logger_function = logger.error
            for errno in ignored_errnos:
                if "[Errno {}]".format(errno) in printer_description:
                    logger_function = logger.info
                    break
            logger_function("Printer error: " + printer_description)

        return printer_info, printer_description

    @staticmethod
    def print(pdf_path):
        try:
            subprocess.run(["lp", "-d", PRINTER_NAME, pdf_path])
            logger.info("Receipt has been printed")
        except:
            logger.error("Receipt has not been printed")

