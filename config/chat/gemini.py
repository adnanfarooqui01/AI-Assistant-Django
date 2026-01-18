from google import genai
from django.conf import settings
import time

client = genai.Client(api_key=settings.GEMINI_API_KEY)

def get_ai_response(message: str) -> str:
    retries = 3

    for attempt in range(retries):
        try:
            response = client.models.generate_content(
                model="gemini-3-flash-preview",
                contents=message
            )
            return response.text

        except Exception as e:
            error_msg = str(e)

            # If model is overloaded, retry
            if "503" in error_msg or "overloaded" in error_msg:
                print(f"⚠️ Gemini overloaded, retry {attempt + 1}/{retries}")
                time.sleep(2)  # backoff
                continue

            # Other Gemini errors
            print("🔥 GEMINI ERROR:", e)
            return "AI service is temporarily unavailable. Please try again."

    return "AI is currently busy. Please try again after some time."



