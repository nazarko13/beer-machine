To configure the software correctly, follow the steps below.
1. Stop application ALS.
2. Create folder .environment in ALS root folder.
3. Copy settings.ini from environment_example into .environment.
4. Change settings according to the hardware. For example, if you want to change boards follow this:
    BEFORE
        [CONTROL_BOARD]
        boards = 109, 22

    AFTER
        [CONTROL_BOARD]
        boards = 13, 45

5. Start application ALS.
6. Have a nice day.