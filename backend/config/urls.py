from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("admin/", admin.site.urls),

    path(
        "api/auth/",
        include("accounts.urls"),
    ),

    path(
        "api/portfolio/",
        include("portfolios.urls"),
    ),

    path(
        "api/stocks/",
        include("stocks.urls"),
    ),
]