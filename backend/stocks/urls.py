from django.urls import path

from .views import FavoriteStockQuotesView


urlpatterns = [
    path(
        "quotes/",
        FavoriteStockQuotesView.as_view(),
        name="favorite-stock-quotes",
    ),
]