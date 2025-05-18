#
# lets find all translations that are missing in the locales files
#

# all code is in src/
# all locales are in locales/en

egrep  -roh '\{t\(.*\)\}' ../src/* | egrep -v ':.*:' | python3 missing_literals.py

