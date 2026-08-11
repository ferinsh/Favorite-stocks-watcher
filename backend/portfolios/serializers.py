from django.contrib.auth.models import User
from rest_framework import serializers

from .models import FavoriteStock, PortfolioShare

class FavoriteStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteStock
        fields = ["id", "symbol", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_symbol(self, value):
        symbol = value.strip().upper()

        if not symbol.isalpha():
            raise serializers.ValidationError(
                "Stock symbol must contain only letters."
            )

        if len(symbol) > 10:
            raise serializers.ValidationError(
                "Stock symbol is too long."
            )

        return symbol

    def create(self, validated_data):
        user = self.context["request"].user

        return FavoriteStock.objects.create(
            user=user,
            **validated_data,
        )

class PortfolioShareSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="shared_with.username",
        read_only=True,
    )

    class Meta:
        model = PortfolioShare
        fields = [
            "id",
            "username",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "username",
            "created_at",
        ]


class CreatePortfolioShareSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)

    def validate_username(self, value):
        try:
            user = User.objects.get(
                username__iexact=value
            )
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "User does not exist."
            )

        if user == self.context["request"].user:
            raise serializers.ValidationError(
                "You cannot share your portfolio with yourself."
            )

        return user.username

    def create(self, validated_data):
        owner = self.context["request"].user

        shared_with = User.objects.get(
            username__iexact=validated_data["username"]
        )

        share, created = PortfolioShare.objects.get_or_create(
            owner=owner,
            shared_with=shared_with,
        )

        return share

class ReceivedPortfolioShareSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(
        source="owner.username",
        read_only=True,
    )

    class Meta:
        model = PortfolioShare
        fields = [
            "id",
            "owner_username",
            "created_at",
        ]