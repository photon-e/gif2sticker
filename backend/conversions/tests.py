import subprocess
import tempfile
from pathlib import Path

import imageio_ffmpeg
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import SimpleTestCase
from rest_framework.test import APIClient

from .processing import download_x_post
from django.core.exceptions import ValidationError


class ConversionTests(SimpleTestCase):
    def test_uploaded_gif_returns_animated_webp(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            gif_path = Path(temp_dir) / "sample.gif"
            subprocess.run(
                [
                    imageio_ffmpeg.get_ffmpeg_exe(), "-hide_banner", "-loglevel", "error", "-y",
                    "-f", "lavfi", "-i", "testsrc=size=64x64:rate=6:duration=1", str(gif_path),
                ],
                check=True,
                timeout=20,
            )
            upload = SimpleUploadedFile("sample.gif", gif_path.read_bytes(), content_type="image/gif")
            response = APIClient().post("/api/conversions/", {"file": upload}, format="multipart")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "image/webp")
        self.assertEqual(response["X-Sticker-Width"], "512")
        output = b"".join(response.streaming_content)
        self.assertTrue(output.startswith(b"RIFF"))
        self.assertEqual(output[8:12], b"WEBP")
        self.assertIn(b"ANIM", output)
        self.assertIn(b"ANMF", output)
        self.assertLessEqual(len(output), 500 * 1024)

    def test_x_post_urls_are_restricted_to_public_status_links(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            for url in (
                "https://example.com/name/status/123",
                "https://x.com.evil.test/name/status/123",
                "http://x.com/name/status/123",
                "https://x.com/name/status/not-a-number",
            ):
                with self.subTest(url=url), self.assertRaises(ValidationError):
                    download_x_post(url, Path(temp_dir))
