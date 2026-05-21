from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from app.config import get_settings
from app.models import ChatStreamRequest, HealthResponse, SimulateMode
from app.stream_service import stream_chat_completion

app = FastAPI(title="GenAI Streaming Lab", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(status="ok", model=settings["model"] or "claude-3-5-haiku-latest")


@app.post("/api/chat/stream")
async def chat_stream(request: ChatStreamRequest) -> StreamingResponse:
    async def event_generator():
        async for event in stream_chat_completion(
            prompt=request.prompt,
            simulate=request.simulate,
        ):
            yield event

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.get("/api/chat/stream")
async def chat_stream_get(
    prompt: str,
    simulate: SimulateMode = SimulateMode.NONE,
) -> StreamingResponse:
    """GET variant for quick manual testing with curl or EventSource."""
    request = ChatStreamRequest(prompt=prompt, simulate=simulate)
    return await chat_stream(request)
