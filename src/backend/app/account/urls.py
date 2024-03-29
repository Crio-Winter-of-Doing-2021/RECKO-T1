from django.urls import path
from account import views


app_name = 'account'

urlpatterns = [
    path('account/transactions', views.AccountTransactionsViewSet.as_view(), name="account_transactions"),
    path('account/charts', views.AccountChartsViewSet.as_view(), name="account_charts")
]