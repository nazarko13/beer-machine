import os

from settings import AUTOSTART_FILE_PATH


def main():
    os.system('git config core.fileMode false')
    username = input("Enter username for this device: ")
    path = AUTOSTART_FILE_PATH.format(username)
    run_command = 'bash /home/{username}/ALS/run.sh &\n'.format(username=username)
    with open(path, 'r') as f:
        lines = f.readlines()
    if run_command not in lines:
        lines.insert(1, run_command + '\n')
        with open(path, 'w') as f:
            f.writelines(lines)
    if input('Reboot system (y/N): ') == 'y':
        os.system('sleep 0.2 && sudo reboot')
