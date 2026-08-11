from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from portfolios.models import FavoriteStock

from .serializers import StockQuoteSerializer
from .services.finnhub import FinnhubService


class FavoriteStockQuotesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        favorite_stocks = FavoriteStock.objects.filter(
            user=request.user
        )

        finnhub = FinnhubService()

        results = []

        for stock in favorite_stocks:
            try:
                quote = finnhub.get_quote(stock.symbol)
                profile = finnhub.get_company_profile(stock.symbol)

                results.append({
                    "symbol": stock.symbol,
                    "name": profile.get("name", ""),
                    "price": quote.get("c"),
                    "change": quote.get("d"),
                    "change_percent": quote.get("dp"),
                    "previous_close": quote.get("pc"),
                })

            except Exception:
                results.append({
                    "symbol": stock.symbol,
                    "name": "",
                    "price": None,
                    "change": None,
                    "change_percent": None,
                    "previous_close": None,
                })

        serializer = StockQuoteSerializer(
            results,
            many=True,
        )

        return Response(serializer.data)