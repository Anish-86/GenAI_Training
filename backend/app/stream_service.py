import asyncio
from collections.abc import AsyncIterator
from typing import Any

from anthropic import APIConnectionError, APIStatusError, AsyncAnthropic

from app.config import FALLBACK_MESSAGE, get_settings
from app.models import SimulateMode
from app.sse import format_sse_event

LATENCY_DELAY_SECONDS = 0.35
MID_STREAM_ERROR_AFTER_TOKENS = 8


async def stream_chat_completion(
    prompt: str,
    simulate: SimulateMode = SimulateMode.NONE,
) -> AsyncIterator[str]:
    settings = get_settings()
    api_key = settings["api_key"]
    model = settings["model"] or "claude-3-5-haiku-latest"

    if not api_key:
        yield format_sse_event(
            {
                "type": "error",
                "message": "ANTHROPIC_API_KEY is not configured.",
                "fallback": FALLBACK_MESSAGE,
            }
        )
        yield format_sse_event({"type": "done", "partial": False})
        return

    if simulate == SimulateMode.LATENCY:
        async for event in _stream_with_latency(prompt, model, api_key):
            yield event
        return

    if simulate == SimulateMode.MID_STREAM_ERROR:
        async for event in _stream_with_mid_stream_error(prompt):
            yield event
        return

    async for event in _stream_from_claude(prompt, model, api_key):
        yield event


async def _stream_from_claude(
    prompt: str,
    model: str,
    api_key: str,
) -> AsyncIterator[str]:
    client = AsyncAnthropic(api_key=api_key)
    token_count = 0

    try:
        async with client.messages.stream(
            max_tokens=512,
            model=model,
            messages=[{"role": "user", "content": prompt}],
        ) as stream:
            async for text in stream.text_stream:
                token_count += 1
                yield format_sse_event({"type": "token", "content": text})

        yield format_sse_event({"type": "done", "partial": False, "token_count": token_count})
    except APIStatusError as exc:
        yield format_sse_event(_error_payload(str(exc), partial=token_count > 0))
        yield format_sse_event({"type": "done", "partial": token_count > 0})
    except APIConnectionError as exc:
        yield format_sse_event(_error_payload(str(exc), partial=token_count > 0))
        yield format_sse_event({"type": "done", "partial": token_count > 0})
    except Exception as exc:  # noqa: BLE001 - surface unexpected failures to client
        yield format_sse_event(_error_payload(str(exc), partial=token_count > 0))
        yield format_sse_event({"type": "done", "partial": token_count > 0})


async def _stream_with_latency(
    prompt: str,
    model: str,
    api_key: str,
) -> AsyncIterator[str]:
    """Simulates high latency by delaying each token."""
    client = AsyncAnthropic(api_key=api_key)
    token_count = 0

    try:
        async with client.messages.stream(
            max_tokens=256,
            model=model,
            messages=[{"role": "user", "content": prompt}],
        ) as stream:
            async for text in stream.text_stream:
                await asyncio.sleep(LATENCY_DELAY_SECONDS)
                token_count += 1
                yield format_sse_event(
                    {
                        "type": "token",
                        "content": text,
                        "meta": {"simulated_latency_ms": int(LATENCY_DELAY_SECONDS * 1000)},
                    }
                )

        yield format_sse_event(
            {
                "type": "done",
                "partial": False,
                "token_count": token_count,
                "meta": {"simulation": "latency"},
            }
        )
    except Exception as exc:  # noqa: BLE001
        yield format_sse_event(_error_payload(str(exc), partial=token_count > 0))
        yield format_sse_event({"type": "done", "partial": token_count > 0})


async def _stream_with_mid_stream_error(prompt: str) -> AsyncIterator[str]:
    """Simulates API failure after several tokens (no external API call)."""
    fake_tokens = [
        "Streaming ",
        "can ",
        "fail ",
        "mid-way. ",
        "You ",
        "should ",
        "still ",
        "see ",
        "partial ",
        "output ",
        "here...",
    ]

    for index, token in enumerate(fake_tokens):
        if index >= MID_STREAM_ERROR_AFTER_TOKENS:
            yield format_sse_event(
                _error_payload(
                    "Simulated upstream error: connection reset mid-stream.",
                    partial=True,
                )
            )
            yield format_sse_event(
                {
                    "type": "done",
                    "partial": True,
                    "token_count": index,
                    "meta": {"simulation": "mid_stream_error"},
                }
            )
            return

        await asyncio.sleep(0.08)
        yield format_sse_event({"type": "token", "content": token})

    yield format_sse_event(
        {
            "type": "done",
            "partial": False,
            "token_count": len(fake_tokens),
            "meta": {"simulation": "mid_stream_error", "note": "unexpected clean finish"},
        }
    )


def _error_payload(message: str, *, partial: bool) -> dict[str, Any]:
    return {
        "type": "error",
        "message": message,
        "fallback": FALLBACK_MESSAGE,
        "partial": partial,
    }
