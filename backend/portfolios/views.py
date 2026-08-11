from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import FavoriteStock, PortfolioShare
from .serializers import (
    FavoriteStockSerializer,
    PortfolioShareSerializer,
    CreatePortfolioShareSerializer,
    ReceivedPortfolioShareSerializer
)


class FavoriteStockListCreateView(generics.ListCreateAPIView):
    serializer_class = FavoriteStockSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FavoriteStock.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save()


class FavoriteStockDeleteView(generics.DestroyAPIView):
    serializer_class = FavoriteStockSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FavoriteStock.objects.filter(
            user=self.request.user
        )


class PortfolioShareListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PortfolioShare.objects.filter(
            owner=self.request.user
        )

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreatePortfolioShareSerializer

        return PortfolioShareSerializer

    def perform_create(self, serializer):
        serializer.save()


class PortfolioShareDeleteView(generics.DestroyAPIView):
    serializer_class = PortfolioShareSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PortfolioShare.objects.filter(
            owner=self.request.user
        )

class SharedPortfolioListView(generics.ListAPIView):
    serializer_class = ReceivedPortfolioShareSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PortfolioShare.objects.filter(
            shared_with=self.request.user
        )

class SharedPortfolioStocksView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        share = generics.get_object_or_404(
            PortfolioShare,
            id=kwargs["share_id"],
            shared_with=request.user,
        )

        stocks = FavoriteStock.objects.filter(
            user=share.owner
        )

        serializer = FavoriteStockSerializer(
            stocks,
            many=True,
        )

        return Response({
            "owner": share.owner.username,
            "stocks": serializer.data,
        })
