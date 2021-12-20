<h1 align="center">👽</h1>
<p>
<img src="https://img.shields.io/badge/version-1.2.1-blue.svg?cacheSeconds=2592000" />
</p>

# Preparing software
Ensure that `python3.6` and `virtualenv` is already installed. If the project is already cloned into proper location execute following:
```sh
sudo apt install npm python3-pip
cd /ALS/ALS
bash als.sh install
cd ALS/als-ui
npm run build
```

# Configuring autostart
1. Ensure that project is placed in ~/ALS directory: there should be ALS
and als-ui directories
2. Open ~/.config/openbox/autostart file
3. After the screen configuring lines add following:
```sh
bash /home/<username>/ALS/ALS/als.sh start &
bash /home/<username>/ALS/als-ui/run.sh &
```
4. Reboot the system and ensure that the software has started

# Setup
To setup the ALS execute following:
```sh
cd ~/ALS/ALS
bash als.sh setup
```
This will start a script that will ask you simple questions. First of all
enter the terminal number, trays numbering start and locks type. Then it will
ask you to close tray by tray in their numbers order. When you close the tray
simply press enter on keyboard. After you set up the last tray enter any symbol
before pressing enter. This will finish trays setup. In the end the setup
script you add super admin cards numbers.

# Settings
## How does it work
To configure the software correctly, follow the steps below.
1. Stop application ALS.
2. Create folder .environment in ALS root folder.
3. Copy settings.ini from environment\_example into .environment.
4. Change settings according to the hardware. For example, if you want to
change boards follow this:
```
    BEFORE
        [CONTROL_BOARD]
        boards = 109, 22

    AFTER
        [CONTROL_BOARD]
        boards = 13, 45
```
5. Start application ALS.
6. Have a nice day.
## Parameters
### Section [CONTROL\_BOARD]
In this section there are placed settings regarding locks control board.

| Parameter | Description |
| ------ | ------ |
| port | Serial port to which the board is connected |
| board | Numbers of the control boards. Integer values separated by comma |
| lock\_type | All the locks types have related to them number. Choose one in range 1-4 |
| inverse\_locks | Do the locks have inverted signals. Yes = 1, No = 0 |

### Section [COMMON]
Common parameters of the ALS terminal which are not related to the hardware.

| Parameter | Description |
| ------ | ------ |
| shop\_name | Name of the shop to display in the software |
| terminal\_number | Number of the terminal. If a shop has more than one terminal they should have serial number. This number is printed on the receipt and is used to identify the terminals where the receipt was printed when the barcode is scanned |
| recipient_email | Email for receiving paper status on ALS|
