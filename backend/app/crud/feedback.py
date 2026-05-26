from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.exceptions import FeedbackNotFoundError, FeedbackValidationError
from app.orm.feedback import UserFeedback
from app.schemas.feedback import FeedbackCreate, FeedbackStatus, FeedbackUpdate


def create_feedback(db: Session, payload: FeedbackCreate) -> UserFeedback:
    feedback = UserFeedback(
        user_email=str(payload.user_email),
        subject=payload.subject,
        message=payload.message,
        rating=payload.rating,
        status=payload.status.value,
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback


def list_feedback(
    db: Session,
    *,
    skip: int = 0,
    limit: int = 50,
    status: FeedbackStatus | None = None,
) -> tuple[list[UserFeedback], int]:
    query = select(UserFeedback)
    count_query = select(func.count()).select_from(UserFeedback)

    if status is not None:
        query = query.where(UserFeedback.status == status.value)
        count_query = count_query.where(UserFeedback.status == status.value)

    query = query.order_by(UserFeedback.created_at.desc()).offset(skip).limit(limit)
    items = list(db.scalars(query).all())
    total = db.scalar(count_query) or 0
    return items, total


def get_feedback(db: Session, feedback_id: int) -> UserFeedback:
    feedback = db.get(UserFeedback, feedback_id)
    if feedback is None:
        raise FeedbackNotFoundError(feedback_id)
    return feedback


def update_feedback(
    db: Session,
    feedback_id: int,
    payload: FeedbackUpdate,
) -> UserFeedback:
    feedback = get_feedback(db, feedback_id)
    updates = payload.model_dump(exclude_unset=True)

    if not updates:
        raise FeedbackValidationError("At least one field must be provided for update.")

    if "user_email" in updates and updates["user_email"] is not None:
        updates["user_email"] = str(updates["user_email"])
    if "status" in updates and updates["status"] is not None:
        updates["status"] = updates["status"].value

    for field, value in updates.items():
        setattr(feedback, field, value)

    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback


def delete_feedback(db: Session, feedback_id: int) -> None:
    feedback = get_feedback(db, feedback_id)
    db.delete(feedback)
    db.commit()
