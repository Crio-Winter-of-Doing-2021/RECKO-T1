from rest_framework import viewsets, status, mixins
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import views

from django.conf import settings
from datetime import datetime

import urllib, requests, base64

from core.models import Account, Integration, Transactions
from xero import serializers

xero_base_url = 'https://login.xero.com/identity/connect/authorize?'
xero_token_url = "https://identity.xero.com/connect/token"
xero_connection_url = "https://api.xero.com/connections"
xero_journal_url = "https://api.xero.com/api.xro/2.0/Journals"
default_scopes = 'accounting.journals.read'
integration_id = 1

class XeroViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """ Manage xero account in database """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = Account.objects.all()
    serializer_class = serializers.XeroSerializer

    def get_queryset(self):
        """Return objects for the current authenticated users only and for xero integration only"""
        return self.queryset.filter(user=self.request.user, integration=integration_id)

class XeroAuthResponseView(views.APIView):
    """Custom viewset for xero auth response"""

    permission_classes = []
    
    def get(self, request, *args, **kwargs):
        """Custome GET Endpoint to receive the authorization code"""

        authorization_code = request.query_params['code']
        state = request.query_params['state']

        # Can be merged to access_token store db call
        # state filter is used to  cross verify the request that request is initiated by our server only from XeroAuthRequestView
        Account.objects.filter(pk=state).update(authorization_code=authorization_code)

        xero_account = Account.objects.filter(pk=state).first()
        xero_integration = Integration.objects.filter(id=integration_id).first()

        if not xero_account:
            return Response('No matching associated state found.', status=status.HTTP_400_BAD_REQUEST)

        # Generating token from the code
        authorization = base64.b64encode((xero_integration.client_id+':'+xero_integration.client_secret).encode('utf-8'))
        redirect_uri = settings.APPLICATION_URL+'/api/xero/auth/response'

        # Making post request to xero to generate the access token
        payload = {"grant_type": "authorization_code", 
                    "code": xero_account.authorization_code, 
                    "redirect_uri": redirect_uri}
        header = {"Content-type": "application/x-www-form-urlencoded",
                    "authorization": "Basic "+str(authorization, "utf-8")}

        response = requests.post(xero_token_url, data=payload, headers=header)
        if response.status_code != 200:
            return Response(response.json(), response.status_code)    
        response = response.json()

        Account.objects.filter(pk=state).update(access_token=response['access_token'], expires_in=response['expires_in'], 
                                                refresh_token=response['refresh_token'], is_authenticated=True)        
        from django.shortcuts import redirect
        return redirect(settings.FRONTEND_SERVICE_URL)
        # return Response(response['access_token'])


class XeroAuthRequestView(views.APIView):
    """Custom viewset for xero auth response"""

    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    
    def get(self, request, *args, **kwargs):
        """Custome GET Endpoint to request the authorization URL"""
        user = self.request.user

        # Creating xero account in recko app, if it's exists ignore it
        xero_account_object = Account(user=self.request.user, integration = Integration.objects.get(pk=integration_id), scopes=default_scopes)
        Account.objects.bulk_create([xero_account_object], ignore_conflicts=True)

        xero_account = Account.objects.filter(user=user, integration=integration_id).first()
        xero_integration = Integration.objects.filter(id=integration_id).first()

        redirect_uri = settings.APPLICATION_URL+'/api/xero/auth/response'

        xero_url_params = (('response_type', 'code'), ('client_id', xero_integration.client_id), ('redirect_uri', redirect_uri),
                            ('scope', xero_account.scopes), ('state', xero_account.id))

        # return Response(redirect_uri)
        return Response(xero_base_url+urllib.parse.urlencode(xero_url_params))
    

class XeroAuthSyncDataView(views.APIView):
    """Custom viewset for xero data sync"""

    permission_classes = []
    
    def get(self, request, *args, **kwargs):
        """Custome GET Endpoint to sync xero data"""
        accounts = Account.objects.filter(integration=integration_id).filter(is_authenticated=True)
        xero_integration = Integration.objects.filter(id=integration_id).first()
        authorization = base64.b64encode((xero_integration.client_id+':'+xero_integration.client_secret).encode('utf-8'))

        for account in accounts:
            # Generating access token from refresh token
            # Making post request to xero to generate the access token
            payload = {"grant_type": "refresh_token", 
                        "refresh_token": account.refresh_token}

            header = {"Content-type": "application/x-www-form-urlencoded",
                        "authorization": "Basic "+str(authorization, "utf-8")}

            response = requests.post(xero_token_url, data=payload, headers=header)

            # If error occured while generating access token updating is_authenticated as False in Account
            if response.status_code != 200:
                error = 'status_code='+str(response.status_code)
                error_at = datetime.now()
                Account.objects.filter(pk=account.id).update(error_desc=error, error_at=error_at, is_authenticated=False)
            else:  
                response = response.json()
                access_token = response['access_token']
                expires_in = response['expires_in']
                refresh_token = response['refresh_token']

                Account.objects.filter(pk=account.id).update(access_token=access_token, expires_in=expires_in, 
                                                refresh_token=refresh_token, is_authenticated=True)
            
                # Getting xero tenants
                header = {"Content-type": "application/json", "Accept": "application/json",
                    "Authorization": "Bearer "+str(access_token)}
                response = requests.get(xero_connection_url, data={}, headers=header)
                if response.status_code != 200:
                    continue
                xero_tenants = response.json()

                for xero_tenant in xero_tenants:
                    xero_tenant_id = xero_tenant['tenantId']

                    # Getting xero Journal data for each tenant
                    header = {"Authorization": "Bearer "+str(access_token), "Xero-Tenant-Id": xero_tenant_id,
                            "Content-Type": "application/json", "Accept": "application/json"}

                    max_journal_number = account.xero_last_journal_number
                    response = requests.get(xero_journal_url+"?offset="+str(max_journal_number), data={}, headers=header)
                    if response.status_code != 200:
                        continue
                    xero_journals = response.json()['Journals']
                    while xero_journals:
                        data_to_be_insert = []
                        for xero_journal in xero_journals:
                            # E.g Converting "/Date(1607904000000+0000)/" to 2020-12-14
                            max_journal_number = max(max_journal_number, int(xero_journal['JournalNumber']))
                            date = datetime.utcfromtimestamp(int(xero_journal['JournalDate'][6:16])).strftime("%Y-%m-%d")
                            for xero_journal_line in xero_journal['JournalLines']:
                                account_name = xero_journal_line['AccountName']
                                account_id = xero_journal_line['AccountCode']
                                amount = float(xero_journal_line['GrossAmount'])
                                type = 'DE' if amount < 0 else 'CR'
                                core_account = account
                                data_to_be_insert.append(Transactions(account_name=account_name, account_id=account_id, 
                                                        amount=amount, date=date, type=type, core_account=core_account))
                        # try:
                        Transactions.objects.bulk_create(data_to_be_insert, ignore_conflicts=True)
                        Account.objects.filter(pk=account.id).update(xero_last_journal_number=max_journal_number)
                        # except:
                        #     pass
                        # Fetching next set of data based on offset (journal_number)
                        response = requests.get(xero_journal_url+"?offset="+str(max_journal_number), data={}, headers=header)
                        if response.status_code != 200:
                            xero_journals = []
                            continue
                        xero_journals = response.json()['Journals']
        return Response("success")


