#!/usr/bin/env bash

case "$1" in
"install")
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
;;
"setup")
source venv/bin/activate
python -m setup
;;
"start")
source venv/bin/activate
python api_server.py
;;
"stop")
killall -9 python
;;
"info")
cat ../version.md
;;
"check_board")
source venv/bin/activate
python -m setup.check_board
;;
"configure_beers")
source venv/bin/activate
python -m setup.configure_beers
;;
"-h" | "--help")
echo "     install                  Install project requirements."
echo "     setup                    Setup project."
echo "     start                    Start project."
echo "     stop                     Stop project."
echo "     info                     Information about version and contributors."
echo "     check_board              Check connection to the board."
echo "     configure_beers          Configure beers."
;;
*)
  echo 'Wrong argument. Possible values: "start", "setup", "install", "stop", "check_board", "configure_beers", "info". Have a nice day!'
  exit 1
esac
