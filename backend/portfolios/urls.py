from django.urls import path

from .views import (
    FavoriteStockListCreateView,
    FavoriteStockDeleteView,
    PortfolioShareListCreateView,
    PortfolioShareDeleteView,
    SharedPortfolioListView,
    SharedPortfolioStocksView
)


urlpatterns = [
    path(
        "favorites/",
        FavoriteStockListCreateView.as_view(),
        name="favorite-stocks",
    ),

    path(
        "favorites/<int:pk>/",
        FavoriteStockDeleteView.as_view(),
        name="favorite-stock-delete",
    ),

    path(
        "shares/",
        PortfolioShareListCreateView.as_view(),
        name="portfolio-shares",
    ),

    path(
        "shares/<int:pk>/",
        PortfolioShareDeleteView.as_view(),
        name="portfolio-share-delete",
    ),

    path(
        "shared-with-me/",
        SharedPortfolioListView.as_view(),
        name="shared-with-me",
    ),

    path(
        "shared-with-me/<int:share_id>/",
        SharedPortfolioStocksView.as_view(),
        name="shared-portfolio-stocks",
    ),
]