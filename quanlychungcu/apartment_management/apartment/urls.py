from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register(r'resident', views.ResidentViewSet, basename='resident')
router.register(r'managing-fees', views.ManagingFeesViewSet, basename='managing-fees')
router.register(r'parking-fees', views.ParkingFeesViewSet, basename='parking-fees')
router.register(r'service-fees', views.ServiceFeesViewSet, basename='service-fees')
router.register(r'locker', views.LockerViewSet, basename='locker')


urlpatterns = [
    path('', include(router.urls)),
]
