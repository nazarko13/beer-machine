To configure the software correctly, follow the steps below.
1. Stop application beer-machine.
2. Create folder .environment in beer-machine/backend folder.
3. Copy settings.ini from environment_example into .environment.
4. Change settings according to the hardware. For example, if you want to change boards follow this:
    BEFORE
        [CONTROL_BOARD]
        port = dev/tty0

    AFTER
        [CONTROL_BOARD]
        port = COM17

5. Start application beer-machine.
6. Have a nice day.