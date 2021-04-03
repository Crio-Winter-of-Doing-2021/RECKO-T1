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
        query_filters = []
        query_filters_data = []

        # Filtering objects
        # filter for current logged in user
        query_filters.append(f"ca.user_id = %s")
        query_filters_data.append(self.request.user.id)

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
        
        
        # Applying orders
        order = {
            'account_name': 'ct.account_name',
            'account_id': 'ct.account_id',
            'amount': 'ct.amount',
            'date': 'ct.date',
            'type': 'ct.type',
            'integration_id': 'ci.id',
            'integration_name': 'ci.name',
        }
        order_by = order[request.query_params['order_by']] if 'order_by' in request.query_params and order.get(request.query_params['order_by']) is not None else 'ct.date'
        order_direction = request.query_params['order_direction'].upper() if 'order_direction' in request.query_params and request.query_params['order_direction'].upper() in ['ASC', 'DESC'] else 'DESC'

        # Applying pagination
        page = 1 if 'page' not in request.query_params or int(request.query_params['page']) <= 0 else int(request.query_params['page'])
        per_page = 15 if 'per_page' not in request.query_params or int(request.query_params['per_page']) <= 0 else int(request.query_params['per_page'])
        
        # Preparing SQL to get total records
        queryset = Account.objects.raw(f"""SELECT COUNT(*) AS id
                                                FROM core_transactions ct
                                                INNER JOIN core_account ca ON ct.core_account_id = ca.id
                                                INNER JOIN core_integration ci ON ca.integration_id = ci.id
                                                WHERE {' AND '.join(query_filters)}""", query_filters_data)
        total_records = queryset[0].__dict__['id']

        # Preparing SQL to get records
        sql = f"""SELECT ct.id, ct.account_name, ct.account_id, ct.amount, ct.date, ct."type", ci.id AS integration_id, ci.name AS integration_name,
                COUNT(*) over() AS total_count
                FROM core_transactions ct
                INNER JOIN core_account ca ON ct.core_account_id = ca.id
                INNER JOIN core_integration ci ON ca.integration_id = ci.id
                WHERE {' AND '.join(query_filters)}
                ORDER BY {order_by} {order_direction} LIMIT {int(per_page)} OFFSET {(int(page)-1)*int(per_page)}"""
        queryset = Account.objects.raw(sql, query_filters_data)

        serializer = serializers.TransactionsSerializer(list(queryset), many=True)
        data = {}
        data['total'] = total_records
        data['page'] = page
        data['per_page'] = per_page
        import math
        data['total_page'] = math.ceil(total_records/per_page)
        data['data'] = serializer.data


        return Response(data)
        