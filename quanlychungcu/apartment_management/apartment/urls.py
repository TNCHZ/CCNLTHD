from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register('managing-fees', views.ManagingFeesViewSet, basename='managingfees')
router.register('parking-fees', views.ParkingFeesViewSet, basename='parkingfees')
router.register('service-fees', views.ServiceFeesViewSet, basename='servicefees')


urlpatterns = [
    path('', include(router.urls)),
]
