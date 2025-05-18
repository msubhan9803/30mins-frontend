import re
import sys
import os
import json
import time
import argparse
from urllib import request, parse

DEEPL_API_ENDPOINT = 'https://api-free.deepl.com/v2/translate'
SLEEP_BETWEEN_API_CALLS = 0.2 # Seconds
INDENTATION_DEFAULT = 2

def translate_string(text, target_locale):
    """
    test with curl:
    $ curl https://api-free.deepl.com/v2/translate -d auth_key=YOUR-API-KEY-HERE -d "text=Hello, world!" -d "target_lang=ES"
    """
    if type(text) != type(str()):
        return text

    data = parse.urlencode({
        'target_lang' : target_locale,  
        'auth_key' : os.environ.get('DEEPL_AUTH_KEY'),
        'text': text,
    }).encode()
    req = request.Request(DEEPL_API_ENDPOINT, data=data)
    response = request.urlopen(req)

    if response.status != 200:
        print(f'{text}  ->  ERROR (response status {response.status})')
        return text

    response_data = json.loads(response.read())

    if not 'translations' in response_data:
        print(f'{text}  ->  ERROR (response empty {response_data})')
        return text

    print(text, ' -> ', response_data['translations'][0]['text'])

    if len(response_data['translations']) > 1:
        print(f"({text}) More than 1 translation: {response_data['translations']}")
    
    return decode_text(response_data['translations'][0]['text'])

def decode_text(text):
    return str(text)

def save_results_file(data, output_file, indent):
    """
    Write output file
    """
    with open(output_file, 'w') as file:
        json.dump(data, file, indent=indent)
    
    print(f"Results saved on {output_file}")


#
# we will load all files in es
#
# we will check if all keys exist in other languages
#
#

groups = ["common.json", "setting.json" , "page.json", "profile.json" , "meeting.json", "event.json"]

if __name__ == "__main__":

# 
# load all literals in stdin in a list
#
    pattern1 = r"'(.*?)'"
    pattern2 = r"`(.*?)`"
    i18n_literals = []
    for line in sys.stdin:
        m = re.search(pattern1, line)
        if (m != None):
            i18n_literals.append(m.group(1))
        else:
            m2 = re.search(pattern2, line)
            if (m2 != None):
                i18n_literals.append(m2.group(1))
            
    #print (i18n_literals)

# 
# load all english data
#
    en_data = {}
    missing_literals = []
    for group in groups:
        full_file_path = "../locales/" + "en" + "/" + group
        # full_file_path = "en" + "/" + group
        with open(full_file_path) as json_file:
            en_data[group] = json.load(json_file)

    for group in groups:
        for keypair in i18n_literals:
            values = keypair.split(":")
            if (len(values) == 2):
                group = values[0] + ".json"
                key = values[1]
            else:
                group = "common.json"
                key = values[0]
            #print("key is: ", key)
            #print("group is: ", group)
            if not key in en_data[group]:
                if key not in missing_literals:
                    missing_literals.append(key)

    print("Missing Literals:" )
    for literal in missing_literals:
        print(literal)
