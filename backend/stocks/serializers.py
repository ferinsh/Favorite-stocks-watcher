from rest_framework import serializers


class StockQuoteSerializer(serializers.Serializer):
    symbol = serializers.CharField()
    name = serializers.CharField(allow_blank=True)
    price = serializers.FloatField(allow_null=True)
    change = serializers.FloatField(allow_null=True)
    change_percent = serializers.FloatField(allow_null=True)
    previous_close = serializers.FloatField(allow_null=True)