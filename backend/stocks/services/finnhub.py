import requests

from django.conf import settings


FINNHUB_BASE_URL = "https://finnhub.io/api/v1"


class FinnhubService:
    def __init__(self):
        self.api_key = settings.FINNHUB_API_KEY

        if not self.api_key:
            raise ValueError("FINNHUB_API_KEY is not configured.")

    def _get(self, endpoint, params=None):
        params = params or {}

        response = requests.get(
            f"{FINNHUB_BASE_URL}/{endpoint}",
            params=params,
            headers={
                "X-Finnhub-Token": self.api_key,
            },
            timeout=10,
        )

        response.raise_for_status()

        return response.json()

    def get_quote(self, symbol):
        return self._get(
            "quote",
            {
                "symbol": symbol,
            },
        )

    def get_company_profile(self, symbol):
        return self._get(
            "stock/profile2",
            {
                "symbol": symbol,
            },
        )