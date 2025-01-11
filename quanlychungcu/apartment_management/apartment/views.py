from rest_framework import viewsets, generics
from .models import ParkingFees, ManagingFees, ServiceFees
from . import serializers, pagination


class ManagingFeeViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ManagingFees.objects.all()
    serializer_class = serializers.ManagingFeeSerializer
    pagination_class = pagination.ManagingFeePagination


class ParkingFeeViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ParkingFees.objects.all()
    serializer_class = serializers.ParkingFeeSerializer
    pagination_class = pagination.ParkingFeePagination


class ServiceFeeViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ServiceFees.objects.all()
    serializer_class = serializers.ServiceFeeSerializer
    pagination_class = pagination.ServiceFeePagination


