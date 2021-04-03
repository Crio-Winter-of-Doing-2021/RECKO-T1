from django.urls import path, include
from rest_framework.routers import DefaultRouter

from xero import views

router = DefaultRouter(trailing_slash=False)
router.register('xero', views.XeroViewSet)

app_name = 'xero'

urlpatterns = [
    path('', include(router.urls)),
    path('xero/auth/response', views.XeroAuthResponseView.as_view(), name="xero_auth_response"),
    path('xero/auth/request', views.XeroAuthRequestView.as_view(), name="xero_auth_request"),
    path('xero/sync/data', views.XeroAuthSyncDataView.as_view(), name="xero_sync_data")
]