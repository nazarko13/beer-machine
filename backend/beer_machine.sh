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
python api_server
;;
"stop")
source venv/bin/activate
killall - 9 python
;;
"info")
source venv/bin/activate
python api_server
;;
"-h" | "--help")
echo "     install                  Install project requirements."
echo "     setup                    Setup project."
echo "     start                    Start project."
echo "     stop                     Stop project."
echo "     info                     Information about version and contributors."
;;
*)
  echo 'Wrong argument. Possible values: "start", "setup", "install". Have a nice day'
  exit 1
esac
