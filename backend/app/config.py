import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()

FALLBACK_MESSAGE = (
    "The assistant could not finish this response. "
    "Please try again in a moment."
)

DEFAULT_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-3-5-haiku-latest")


@lru_cache
def get_settings() -> dict[str, str | None]:
    return {
        "api_key": os.getenv("ANTHROPIC_API_KEY"),
        "model": DEFAULT_MODEL,
    }
