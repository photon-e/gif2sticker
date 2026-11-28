import re
import subprocess
from pathlib import Path
from urllib.parse import urlparse

import imageio_ffmpeg
import yt_dlp
from django.core.exceptions import ValidationError

MAX_INPUT_BYTES = 100 * 1024 * 1024
MAX_STICKER_BYTES = 500 * 1024
MAX_DURATION_SECONDS = 10
X_POST_PATH = re.compile(r"^/[^/]+/status/\d+/?$")


def download_x_post(url: str, directory: Path) -> Path:
    """Download the video from a public X/Twitter post to a private temp folder."""
    parsed = urlparse(url)
    host = (parsed.hostname or "").lower()
    if (
        parsed.scheme != "https"
        or host not in {"x.com", "www.x.com", "twitter.com", "www.twitter.com"}
        or not X_POST_PATH.fullmatch(parsed.path)
        or parsed.username
        or parsed.password
    ):
        raise ValidationError("Enter a public X post URL, such as https://x.com/name/status/123.")

    output_template = str(directory / "source.%(ext)s")
    options = {
        "format": "best[ext=mp4]/best",
        "outtmpl": output_template,
        "noplaylist": True,
        "quiet": True,
        "no_warnings": True,
        "socket_timeout": 20,
        "max_filesize": MAX_INPUT_BYTES,
        "restrictfilenames": True,
    }
    try:
        with yt_dlp.YoutubeDL(options) as downloader:
            info = downloader.extract_info(url, download=True)
            downloaded = Path(downloader.prepare_filename(info))
    except Exception as exc:
        raise ValidationError("Could not fetch that X post. It may be private, unavailable, or contain no video.") from exc

    if not downloaded.is_file():
        candidates = list(directory.glob("source.*"))
        if not candidates:
            raise ValidationError("The X post did not provide a downloadable video.")
        downloaded = candidates[0]
    if downloaded.stat().st_size > MAX_INPUT_BYTES:
        raise ValidationError("Choose media smaller than 100 MB.")
    return downloaded


def convert_to_sticker(source: Path, destination: Path) -> Path:
    """Encode a 512px animated WebP under WhatsApp's size and duration limits."""
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    last_output = ""
    for fps in (12, 10, 8, 6):
        for quality in (72, 60, 48, 38):
            destination.unlink(missing_ok=True)
            filter_graph = (
                f"fps={fps},scale=512:512:force_original_aspect_ratio=decrease:flags=lanczos,"
                "pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000,format=yuva420p"
            )
            command = [
                ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
                "-map", "0:v:0", "-an", "-t", str(MAX_DURATION_SECONDS), "-vf", filter_graph,
                "-c:v", "libwebp_anim", "-lossless", "0", "-q:v", str(quality),
                "-compression_level", "6", "-loop", "0", "-threads", "1", str(destination),
            ]
            try:
                result = subprocess.run(command, capture_output=True, text=True, timeout=25, check=False)
            except subprocess.TimeoutExpired as exc:
                last_output = "Conversion took too long. Try a shorter or smaller file."
                continue
            if result.returncode != 0:
                last_output = result.stderr[-1000:]
                continue
            if destination.is_file() and destination.stat().st_size <= MAX_STICKER_BYTES:
                return destination

    if last_output:
        raise ValidationError("Could not convert this media. Try another GIF or video.")
    raise ValidationError("This media is too detailed to fit WhatsApp's 500 KB sticker limit.")
