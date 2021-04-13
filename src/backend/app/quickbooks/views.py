from rest_framework import viewsets, status, mixins
from rest_framework.decorators import action
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework import views

from django.conf import settings

from datetime import datetime, timezone, timedelta

from core.models import Account, Integration, Transactions
from quickbooks import serializers

from intuitlib.client import AuthClient
from intuitlib.enums import Scopes
from intuitlib.exceptions import AuthClientError

import requests


quickbooks_account_type = "sandbox"
quickbooks_sandbox_url = "https://sandbox-quickbooks.api.intuit.com"
quickbooks_production_url = "https://quickbooks.api.intuit.com"
default_scopes = 'com.intuit.quickbooks.accounting'
# quickbooks_account_type = "production"
integration_id = 2

class QuickbooksViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """ Manage quickbooks account in database """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = Account.objects.all()
    serializer_class = serializers.QuickbooksSerializer

    def get_queryset(self):
        """Return objects for the current authenticated users only and for quickbooks integration only"""
        return self.queryset.filter(user=self.request.user, integration=integration_id)

class QuickbooksAuthResponseView(views.APIView):
    """Custom viewset for quickbooks auth response"""

    permission_classes = []
    
    def get(self, request, *args, **kwargs):
        """Custome GET Endpoint to receive the authorization code"""

        state = request.query_params['state']
        authorization_code = request.query_params['code']
        realm_id = request.query_params['realmId']

        # Can be merged to access_token store db call
        # Identifying  user based on state
        Account.objects.filter(pk=state).update(authorization_code=authorization_code, realm_id=realm_id)

        quickbook_account = Account.objects.filter(pk=state).first()
        quickbook_integration = Integration.objects.filter(id=integration_id).first()

        if not quickbook_account:
            return Response('No matching associated state found.', status=status.HTTP_400_BAD_REQUEST)


        # Creating auth_client object
        redirect_uri = settings.APPLICATION_URL+'/api/quickbooks/auth/response'
        auth_client = AuthClient(quickbook_integration.client_id, quickbook_integration.client_secret, redirect_uri, quickbooks_account_type, state)
        # Generating access token
        try:
            auth_client.get_bearer_token(authorization_code, realm_id=realm_id)
            
            access_token = auth_client.access_token
            expires_in = auth_client.expires_in
            refresh_token = auth_client.refresh_token
            x_refresh_token_expires_in = auth_client.x_refresh_token_expires_in
            id_token = auth_client.id_token

            Account.objects.filter(pk=state).update(access_token=access_token, expires_in=expires_in, 
                                                refresh_token=refresh_token, x_refresh_token_expires_in=x_refresh_token_expires_in,
                                                id_token=id_token, is_authenticated=True)

        except AuthClientError as e:
            error = 'status_code='+str(e.status_code)+', error='+str(e.content)
            error_at = datetime.now()
            Account.objects.filter(pk=state).update(error_desc=error, error_at=error_at)

        # Redirect to frontend page after successfull generation of access token
        from django.shortcuts import redirect
        return redirect(settings.FRONTEND_SERVICE_URL)
        # return Response(auth_client.access_token)

class QuickbooksAuthRequestView(views.APIView):
    """Custom viewset for quickbooks auth response"""

    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_quickbook_scopes(self, scope):
        """Used to return scopes in ENUM format provided by quickbooks SDK"""
        switcher = {
            'com.intuit.quickbooks.accounting': Scopes.ACCOUNTING,
            'com.intuit.quickbooks.payment': Scopes.PAYMENT,
            'com.intuit.quickbooks.payroll': Scopes.PAYROLL,
            'com.intuit.quickbooks.payroll.timetracking': Scopes.PAYROLL_TIMETRACKING,
            'com.intuit.quickbooks.payroll.benefits': Scopes.PAYROLL_BENEFITS,
        }
        return switcher.get(scope, None)
    
    def get(self, request, *args, **kwargs):
        """Custome GET Endpoint to request the authorization URL"""
        user = self.request.user

        # Creating quickbooks account in recko app, if it's exists ignore it
        quickbooks_account_object = Account(user=user, integration = Integration.objects.get(pk=integration_id), scopes=default_scopes)
        Account.objects.bulk_create([quickbooks_account_object], ignore_conflicts=True)

        quickbook_account = Account.objects.filter(user=user, integration=integration_id).first()
        quickbook_integration = Integration.objects.filter(id=integration_id).first()

        # Creating quickbooks client to generate the authentication url
        # auth_client = AuthClient( client_id, client_secret, redirect_uri, environment )
        # environmen could be sandbox or production
        redirect_uri = settings.APPLICATION_URL+'/api/quickbooks/auth/response'
        auth_client = AuthClient( quickbook_integration.client_id, quickbook_integration.client_secret, redirect_uri, quickbooks_account_type, quickbook_account.id)


        scopes = []
        if not quickbook_account.scopes:
            scopes.append(Scopes.ACCOUNTING)
        else:
            for scope in [x.strip() for x in quickbook_account.scopes.split(' ')]:
                current_scope = self.get_quickbook_scopes(scope)
                if current_scope:
                    scopes.append(current_scope)
            if not scopes:
                scopes.append(Scopes.ACCOUNTING)

        auth_url = auth_client.get_authorization_url(scopes)

        return Response(auth_url)

class QuickbooksAuthSyncDataView(views.APIView):
    """Custom viewset for quickbooks data sync"""

    permission_classes = []
    
    def get(self, request, *args, **kwargs):
        """Custome GET Endpoint to sync quickbooks data"""

        accounts = Account.objects.filter(integration=integration_id).filter(is_authenticated=True)
        quickbook_integration = Integration.objects.filter(id=integration_id).first()
        redirect_uri = settings.APPLICATION_URL+'/api/quickbooks/auth/response'

        if quickbooks_account_type == "sandbox":
            quickbooks_api_base_url = quickbooks_sandbox_url
        else:
            quickbooks_api_base_url = quickbooks_production_url

        for account in accounts:
            try:
                # Generating access token from refresh token and updating the new refresh_token
                auth_client = AuthClient( quickbook_integration.client_id, quickbook_integration.client_secret, redirect_uri, quickbooks_account_type, account.id)
                auth_client.refresh(refresh_token=account.refresh_token)

                access_token = auth_client.access_token
                expires_in = auth_client.expires_in
                refresh_token = auth_client.refresh_token
                x_refresh_token_expires_in = auth_client.x_refresh_token_expires_in

                Account.objects.filter(pk=account.id).update(access_token=access_token, expires_in=expires_in, 
                                                refresh_token=refresh_token, x_refresh_token_expires_in=x_refresh_token_expires_in,
                                                is_authenticated=True)

                # Calling quickbooks API to retrieve data
                previous_day_utc_date = (datetime.now(timezone.utc) - timedelta(days=1)).strftime("%Y-%m-%d")
                if account.quickbooks_last_sync_date == None:
                    quickbooks_where = f" WHERE TxnDate <= '{previous_day_utc_date}'"
                else:
                    quickbooks_where = f" WHERE TxnDate > '{account.quickbooks_last_sync_date}' AND TxnDate <= '{previous_day_utc_date}'"
                # return Response(quickbooks_where)
                # previous_day_utc_date = (datetime.now(timezone.utc) - timedelta(days=1)).strftime("%Y-%m-%d")
                url = quickbooks_api_base_url+"/v3/company/"+str(account.realm_id)+"/query?query=SELECT * FROM JournalEntry"+quickbooks_where
                header = {"Content-type": "application/json", "Accept": "application/json",
                    "Authorization": "Bearer "+str(access_token)}

                response = requests.get(url, data={}, headers=header)
                if response.status_code != 200:
                    error = "Error while fetching quickbooks data received status code:"+str(response.status_code)
                    error_at = datetime.now()
                    Account.objects.filter(pk=account.id).update(error_desc=error, error_at=error_at, is_authenticated=False)
                else:    
                    response = response.json()
                    data_to_be_insert = []
                    # return Response(bool(response.get('QueryResponse')))
                    if bool(response['QueryResponse']) == False:
                        continue
                    journal_entries = response['QueryResponse']['JournalEntry']
                    try:
                        for journal_entry in journal_entries:
                            for data in journal_entry['Line']:
                                account_name = data['JournalEntryLineDetail']['AccountRef']['name']
                                account_id = data['JournalEntryLineDetail']['AccountRef']['value']
                                amount = float(data['Amount'])
                                date = journal_entry['TxnDate']
                                type = 'DE' if data['JournalEntryLineDetail']['PostingType'] == 'Debit' else 'CR'
                                core_account = account
                                data_to_be_insert.append(Transactions(account_name=account_name, account_id=account_id, 
                                                        amount=amount, date=date, type=type, core_account=core_account))
                    
                        Transactions.objects.bulk_create(data_to_be_insert)
                        Account.objects.filter(pk=account.id).update(quickbooks_last_sync_date=previous_day_utc_date)
                    except:
                        pass
            except AuthClientError as e:
                error = 'status_code='+str(e.status_code)+', error='+str(e.content)
                error_at = datetime.now()
                Account.objects.filter(pk=account.id).update(error_desc=error, error_at=error_at, is_authenticated=False)

        return Response("success")
