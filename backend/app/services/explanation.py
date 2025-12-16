EXPLANATIONS = {
    "fever": "Your body temperature is higher than normal.",
    "cough": "Irritation in the throat or lungs causing coughing.",
    "infection": "Your body is fighting harmful germs."
}

def generate_explanation(text):
    result = []
    for word in text.lower().split():
        if word in EXPLANATIONS:
            result.append(f"{word.capitalize()}: {EXPLANATIONS[word]}")
    return "\n".join(result)
