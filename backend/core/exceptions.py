import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
logger = logging.getLogger(__name__)
def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        logger.exception("Unhandled API exception", exc_info=exc)
        return Response({"error": {"detail": "An unexpected error occurred.", "status": 500}}, status=500)
    response.data = {"error": {"detail": response.data, "status": response.status_code}}
    return response
