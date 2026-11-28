import os
from pathlib import Path
from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR.parent / ".env")
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")
if not SECRET_KEY:
    raise ImproperlyConfigured("DJANGO_SECRET_KEY must be set in the environment")
DEBUG = os.getenv("DJANGO_DEBUG", "false").lower() == "true"
ALLOWED_HOSTS = [item.strip() for item in os.getenv("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",") if item.strip()]
INSTALLED_APPS = ["django.contrib.contenttypes", "django.contrib.auth", "rest_framework", "corsheaders", "core", "conversions", "media_processing"]
MIDDLEWARE = ["django.middleware.security.SecurityMiddleware", "corsheaders.middleware.CorsMiddleware", "django.middleware.common.CommonMiddleware"]
ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"
if os.getenv("POSTGRES_HOST"):
    DATABASES = {"default": {"ENGINE": "django.db.backends.postgresql", "NAME": os.getenv("POSTGRES_DB", "gif2sticker"), "USER": os.getenv("POSTGRES_USER", "gif2sticker"), "PASSWORD": os.getenv("POSTGRES_PASSWORD", ""), "HOST": os.getenv("POSTGRES_HOST"), "PORT": os.getenv("POSTGRES_PORT", "5432"), "CONN_MAX_AGE": 60}}
else:
    # A lightweight local default; Docker Compose always sets POSTGRES_HOST.
    DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": BASE_DIR / "local.sqlite3"}}
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "EXCEPTION_HANDLER": "core.exceptions.api_exception_handler",
    "DEFAULT_THROTTLE_CLASSES": ["rest_framework.throttling.AnonRateThrottle"],
    "DEFAULT_THROTTLE_RATES": {"anon": "20/hour"},
}
DATA_UPLOAD_MAX_MEMORY_SIZE = 105 * 1024 * 1024
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024
CORS_ALLOWED_ORIGINS = [item.strip() for item in os.getenv("FRONTEND_ORIGIN", "http://localhost:3000,http://127.0.0.1:3000").split(",") if item.strip()]
CORS_ALLOW_CREDENTIALS = False
CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", os.getenv("REDIS_URL", "redis://localhost:6379/1"))
CELERY_RESULT_BACKEND = os.getenv("REDIS_URL", "redis://localhost:6379/0")
CELERY_TASK_SERIALIZER = "json"
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_RESULT_SERIALIZER = "json"
LOGGING = {"version": 1, "disable_existing_loggers": False, "formatters": {"structured": {"format": "%(asctime)s %(levelname)s %(name)s %(message)s"}}, "handlers": {"console": {"class": "logging.StreamHandler", "formatter": "structured"}}, "root": {"handlers": ["console"], "level": os.getenv("LOG_LEVEL", "INFO")}}
