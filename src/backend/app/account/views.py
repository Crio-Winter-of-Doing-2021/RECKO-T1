from rest_framework import status
from rest_framework import views
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models import Account, Integration, Transactions

from account import serializers

from rest_framework.renderers import JSONRenderer

class AccountTransactionsViewSet(views.APIView):
    """To list quickbooks transactions"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    
    def get(self, request, *args, **kwargs):
        """Custom GET endpoint to return transactions data"""
        # account = Account.objects.all()
        # serializer = serializers.AccountSerializer(instance = account, many=True)
        # return Response(serializer.data)
        query_filters = []
        query_filters_data = []

        # filter for current logged in user
        query_filters.append(f"ca.user_id = %s")
        query_filters_data.append(self.request.user.id)

        # filtering integration_id if exists in request parameter
        if 'integration_id' in request.query_params:
            query_filters.append(f"ci.id = %s")
            query_filters_data.append(request.query_params['integration_id'])
        if 'fromDate' in request.query_params:
            query_filters.append(f"ct.date >= %s")
            query_filters_data.append(request.query_params['fromDate'])
        if 'toDate' in request.query_params:
            query_filters.append(f"ct.date <= %s")
            query_filters_data.append(request.query_params['toDate'])
        if 'date' in request.query_params:
            query_filters.append(f"ct.date = %s")
            query_filters_data.append(request.query_params['date'])
        if 'type' in request.query_params:
            query_filters.append(f"ct.type = %s")
            query_filters_data.append(request.query_params['type'])
        

        sql = f"""SELECT ct.id, ct.account_name, ct.account_id, ct.amount, ct.date, ct."type", ci.id AS integration_id, ci.name AS integration_name,
                COUNT(*) over() AS total_count
                FROM core_transactions ct
                INNER JOIN core_account ca ON ct.core_account_id = ca.id
                INNER JOIN core_integration ci ON ca.integration_id = ci.id
                WHERE {' AND '.join(query_filters)}
                ORDER BY 1 DESC"""
        total_records = 0
        queryset = Account.objects.raw(sql, query_filters_data)

        serializer = serializers.TransactionsSerializer(list(queryset), many=True)
        return Response(serializer.data)
        