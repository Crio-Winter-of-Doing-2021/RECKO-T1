from rest_framework import serializers
from core.models import Account, Transactions, Integration

# class TransactionsSerializer(serializers.ModelSerializer):
#     """Serializer for the transactions"""

#     class Meta:
#         model = Transactions
#         fields = ['id', 'account_name', 'account_id', 'amount', 'date', 'type', 'core_account_id']

class AccountSerializer(serializers.ModelSerializer):
    """Serializer for the account"""

    # transactions = TransactionsSerializer(many=True, read_only=True)
    class Meta:
        model = Account
        fields = ['id', 'authorization_code']
        depth = 2

class TransactionsSerializer(serializers.Serializer):
    """Serializer for the transactions"""

    id = serializers.IntegerField(required=True)
    account_name = serializers.CharField(max_length=128, required=True)
    account_id = serializers.IntegerField(required=True)
    amount = serializers.FloatField(required=True)
    date = serializers.DateField(required=True)
    type = serializers.CharField(max_length=2, required=True)
    integration_id = serializers.IntegerField(required=True)
    integration_name = serializers.CharField(max_length=128, required=True)

    class Meta:
        fields = ['id', 'account_name', 'account_id', 'amount', 'date', 'type', 'integration_id', 'integration_name']

class ChartSerializer(serializers.Serializer):
    """Serializer for the transactions charts"""

    date = serializers.DateField(required=False)
    total_amount = serializers.FloatField(required=False)
    total_deposits = serializers.FloatField(required=False)
    account_name = serializers.CharField(required=False)
    integration_name = serializers.CharField(required=False)
    credit = serializers.FloatField(required=False)
    debit = serializers.FloatField(required=False)