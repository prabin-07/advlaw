from groq import Groq
from config import GROQ_API_KEY, MODEL_NAME

client = Groq(api_key=GROQ_API_KEY)

def analyse_case(case_text, retrieved_sections):
    prompt = f"""
    you are an expert Indian Legal assistant.
    relevant Law sections:
    {retrieved_sections}

    Analyse the case and return ONLY valid JSON:

    {{
        "summary":"",
        "applicable_sections": [],
        "legal_issues": [],
        "loopholes": [],
        "recommended_actions": []
    }}

    case:
    {case_text}
    """
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": "respond only in JSON,"},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2
    )

    return response.choices[0].message.content