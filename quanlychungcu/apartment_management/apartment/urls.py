from django.urls import path, include
from rest_framework.routers import DefaultRouter
import views

router = DefaultRouter()
router.register(r'parking-fees', views.ParkingFeeViewSet, basename='parkingfee')



urlpatterns = [
    path('', include(router.urls)),
]
