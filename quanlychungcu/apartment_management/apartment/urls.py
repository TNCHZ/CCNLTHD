from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register('resident', views.ResidentViewSet, basename='resident')
router.register('managing-fees', views.ManagingFeesViewSet, basename='managing-fees')
router.register('parking-fees', views.ParkingFeesViewSet, basename='parking-fees')
router.register('service-fees', views.ServiceFeesViewSet, basename='service-fees')


urlpatterns = [
    path('', include(router.urls)),
]
