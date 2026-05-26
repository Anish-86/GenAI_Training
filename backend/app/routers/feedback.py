from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.crud import feedback as feedback_crud
from app.database import get_db
from app.schemas.feedback import (
    FeedbackCreate,
    FeedbackListResponse,
    FeedbackResponse,
    FeedbackStatus,
    FeedbackUpdate,
)

router = APIRouter(prefix="/api/feedback", tags=["user-feedback"])

DbSession = Annotated[Session, Depends(get_db)]


@router.post(
    "",
    response_model=FeedbackResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create user feedback",
)
def create_feedback(payload: FeedbackCreate, db: DbSession) -> FeedbackResponse:
    feedback = feedback_crud.create_feedback(db, payload)
    return FeedbackResponse.model_validate(feedback)


@router.get(
    "",
    response_model=FeedbackListResponse,
    summary="List user feedback",
)
def list_feedback(
    db: DbSession,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 50,
    status_filter: Annotated[FeedbackStatus | None, Query(alias="status")] = None,
) -> FeedbackListResponse:
    items, total = feedback_crud.list_feedback(
        db,
        skip=skip,
        limit=limit,
        status=status_filter,
    )
    return FeedbackListResponse(
        items=[FeedbackResponse.model_validate(item) for item in items],
        total=total,
    )


@router.get(
    "/{feedback_id}",
    response_model=FeedbackResponse,
    summary="Get user feedback by ID",
)
def get_feedback(feedback_id: int, db: DbSession) -> FeedbackResponse:
    feedback = feedback_crud.get_feedback(db, feedback_id)
    return FeedbackResponse.model_validate(feedback)


@router.put(
    "/{feedback_id}",
    response_model=FeedbackResponse,
    summary="Update user feedback",
)
def update_feedback(
    feedback_id: int,
    payload: FeedbackUpdate,
    db: DbSession,
) -> FeedbackResponse:
    feedback = feedback_crud.update_feedback(db, feedback_id, payload)
    return FeedbackResponse.model_validate(feedback)


@router.delete(
    "/{feedback_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete user feedback",
)
def delete_feedback(feedback_id: int, db: DbSession) -> None:
    feedback_crud.delete_feedback(db, feedback_id)
