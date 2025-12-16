SHORTFORMS = {
    "T.": "Tablet",
    "Tab": "Tablet",
    "Cap.": "Capsule",
    "Syp.": "Syrup",
    "Inj.": "Injection",
    "SOS": "When Needed",
}

def expand_shortforms(text):
    for key, value in SHORTFORMS.items():
        text = text.replace(key, value)
    return text
