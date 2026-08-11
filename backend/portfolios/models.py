from django.contrib.auth.models import User
from django.db import models


class FavoriteStock(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="favorite_stocks",
    )

    symbol = models.CharField(max_length=10)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "symbol"],
                name="unique_user_stock",
            )
        ]
        ordering = ["symbol"]

    def __str__(self):
        return f"{self.user.username} - {self.symbol}"

class PortfolioShare(models.Model):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="portfolio_shares",
    )

    shared_with = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="shared_portfolios",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["owner", "shared_with"],
                name="unique_portfolio_share",
            )
        ]

    def __str__(self):
        return (
            f"{self.owner.username} → "
            f"{self.shared_with.username}"
        )