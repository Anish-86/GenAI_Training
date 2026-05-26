"""create user_feedback table

Revision ID: 20260521_0001
Revises:
Create Date: 2026-05-21

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "20260521_0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "user_feedback",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_email", sa.String(length=255), nullable=False),
        sa.Column("subject", sa.String(length=200), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("rating", sa.Integer(), nullable=True),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="open"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("(CURRENT_TIMESTAMP)"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("(CURRENT_TIMESTAMP)"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_user_feedback_user_email"), "user_feedback", ["user_email"])
    op.create_index(op.f("ix_user_feedback_status"), "user_feedback", ["status"])


def downgrade() -> None:
    op.drop_index(op.f("ix_user_feedback_status"), table_name="user_feedback")
    op.drop_index(op.f("ix_user_feedback_user_email"), table_name="user_feedback")
    op.drop_table("user_feedback")
