from rest_framework import serializers
from core.models import Account, Transactions

class QuickbooksSerializer(serializers.ModelSerializer):
    """Serializer for the quickbooks object"""

    class Meta:
        model = Account
        fields = ('id', 'is_authenticated')
        read_only_fields = ('id', 'is_authenticated')
