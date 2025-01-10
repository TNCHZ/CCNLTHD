from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ParkingFeeViewSet

router = DefaultRouter()
router.register(r'parking-fees', ParkingFeeViewSet, basename='parkingfee')



urlpatterns = [
    path('', include(router.urls)),
]
