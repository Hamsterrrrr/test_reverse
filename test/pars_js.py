import re

with open('main.js', 'r') as f:
    js_code = f.read()

main_pattern = re.compile(r'async function main\([\s\S]*?\}\n\}', re.MULTILINE) # kayf regularky kak ya ih lublu(net.xyz)

main_match = main_pattern.search(js_code)

main_function = main_match.group(0)
with open('payloadpy.js', 'w') as f:
    f.write(main_function)
print("vse zbs")

