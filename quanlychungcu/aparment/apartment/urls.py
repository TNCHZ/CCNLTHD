from os.path import basename

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register(r'user', views.UserViewSet)
router.register(r'resident-information', views.ResidentDetailViewSet, basename='resident-information')
router.register(r'resident-managing-fee', views.ResidentManagingFeeViewSet, basename='resident-managing-fee')
router.register(r'resident-parking-fee', views.ResidentParkingFeeViewSet, basename='resident-parking-fee')
router.register(r'resident-service-fee', views.ResidentServiceFeeViewSet, basename='resident-service-fee')
router.register(r'resident-locker', views.ResidentLockerViewSet, basename='resident-locker')
router.register(r'resident-survey', views.ResidentSurveyViewSet)
router.register(r'resident-survey-response', views.ResidentSurveyResponseViewSet)
router.register(r'address', views.AddressViewSet)
router.register(r'resident-create', views.ResidentCreateViewSet, basename='resident-create')

urlpatterns = [
    path('', include(router.urls)),
]
