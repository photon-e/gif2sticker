from django.urls import path

from .views import ConversionView

urlpatterns = [path("", ConversionView.as_view(), name="conversion-create")]
