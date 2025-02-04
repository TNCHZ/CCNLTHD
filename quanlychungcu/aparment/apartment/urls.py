from os.path import basename

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register(r'user', views.UserViewSet)
router.register(r'resident-information', views.ResidentDetailViewSet, basename='resident-information')
router.register(r'resident-managing-fee', views.ManagingFeeViewSet, basename='resident-managing-fee')
router.register(r'resident-parking-fee', views.ParkingFeeViewSet, basename='resident-parking-fee')
router.register(r'resident-service-fee', views.ServiceFeeViewSet, basename='resident-service-fee')
router.register(r'resident-locker', views.ResidentLockerViewSet, basename='resident-locker')
router.register(r'survey', views.SurveyViewSet)
router.register(r'resident-survey-response', views.ResidentSurveyResponseViewSet)
router.register(r'address', views.AddressViewSet)
router.register(r'resident-create', views.ResidentCreateViewSet, basename='resident-create')
router.register(r'list-user', views.ResidentViewSet, basename='list-user')
router.register(r'month-fee', views.MonthViewSet, basename='month-fee')
router.register(r'feedback', views.FeedbackViewSet)
router.register(r'locker', views.LockerViewSet)
router.register(r'item-in-locker', views.ItemInLockerViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
