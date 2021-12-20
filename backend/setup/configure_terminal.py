from utils import read_settings, write_settings


def main():
    try:
        settings = read_settings()
        settings['COMMON']['terminal_number'] = str(int(input("Enter terminal number: ")))
        write_settings(settings)
    except ValueError:
        print("Terminal number must be a digit")
        main()
