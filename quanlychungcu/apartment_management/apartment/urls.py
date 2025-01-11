from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register('parking-fees', views.ParkingFeeViewSet, basename='parkingfee')
router.register('managing-fee', views.ManagingFeeViewSet, basename='managingfee')
router.register('service-fee', views.ServiceFeeViewSet, basename='servicefee')


urlpatterns = [
    path('', include(router.urls)),
]
