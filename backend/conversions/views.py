import tempfile
from pathlib import Path

from django.core.exceptions import ValidationError
from django.http import FileResponse
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_413_REQUEST_ENTITY_TOO_LARGE, HTTP_422_UNPROCESSABLE_ENTITY
from rest_framework.views import APIView

from .processing import MAX_INPUT_BYTES, convert_to_sticker, download_x_post


class ConversionView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        uploaded = request.FILES.get("file")
        url = (request.data.get("url") or "").strip()
        if bool(uploaded) == bool(url):
            return Response({"error": "Provide exactly one GIF/video file or public X post URL."}, status=400)
        if uploaded and uploaded.size > MAX_INPUT_BYTES:
            return Response({"error": "Choose media smaller than 100 MB."}, status=HTTP_413_REQUEST_ENTITY_TOO_LARGE)

        try:
            with tempfile.TemporaryDirectory(prefix="gif2sticker-") as workdir:
                directory = Path(workdir)
                if uploaded:
                    source = directory / (Path(uploaded.name).name or "upload")
                    with source.open("wb") as stream:
                        for chunk in uploaded.chunks():
                            stream.write(chunk)
                else:
                    source = download_x_post(url, directory)
                sticker = convert_to_sticker(source, directory / "sticker.webp")
                response = FileResponse(sticker.open("rb"), content_type="image/webp", filename="whatsapp-sticker.webp")
                response["X-Sticker-Width"] = "512"
                response["X-Sticker-Height"] = "512"
                response["X-Sticker-Duration-Limit"] = "10"
                return response
        except ValidationError as exc:
            return Response({"error": exc.messages[0]}, status=HTTP_422_UNPROCESSABLE_ENTITY)
