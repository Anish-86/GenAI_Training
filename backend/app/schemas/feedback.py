from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class FeedbackStatus(str, Enum):
    OPEN = "open"
    IN_REVIEW = "in_review"
    RESOLVED = "resolved"
    CLOSED = "closed"


class FeedbackCreate(BaseModel):
    user_email: EmailStr
    subject: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1, max_length=5000)
    rating: int | None = Field(default=None, ge=1, le=5)
    status: FeedbackStatus = FeedbackStatus.OPEN


class FeedbackUpdate(BaseModel):
    user_email: EmailStr | None = None
    subject: str | None = Field(default=None, min_length=1, max_length=200)
    message: str | None = Field(default=None, min_length=1, max_length=5000)
    rating: int | None = Field(default=None, ge=1, le=5)
    status: FeedbackStatus | None = None


class FeedbackResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_email: EmailStr
    subject: str
    message: str
    rating: int | None
    status: FeedbackStatus
    created_at: datetime
    updated_at: datetime


class FeedbackListResponse(BaseModel):
    items: list[FeedbackResponse]
    total: int
