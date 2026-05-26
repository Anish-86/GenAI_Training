from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


class FeedbackNotFoundError(HTTPException):
    def __init__(self, feedback_id: int) -> None:
        super().__init__(
            status_code=404,
            detail=f"User feedback with id {feedback_id} was not found.",
        )


class FeedbackValidationError(HTTPException):
    def __init__(self, message: str) -> None:
        super().__init__(status_code=400, detail=message)


async def unhandled_exception_handler(
    _request: Request,
    exc: Exception,
) -> JSONResponse:
    if isinstance(exc, (HTTPException, StarletteHTTPException)):
        raise exc

    return JSONResponse(
        status_code=500,
        content={
            "detail": "An unexpected server error occurred.",
            "error_type": exc.__class__.__name__,
        },
    )
