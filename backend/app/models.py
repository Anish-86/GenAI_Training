from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field


class SimulateMode(str, Enum):
    NONE = "none"
    LATENCY = "latency"
    MID_STREAM_ERROR = "mid_stream_error"


class ChatStreamRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=4000)
    simulate: SimulateMode = SimulateMode.NONE


class HealthResponse(BaseModel):
    status: Literal["ok"] = "ok"
    model: str
