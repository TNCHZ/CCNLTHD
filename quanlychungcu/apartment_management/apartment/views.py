from rest_framework import viewsets, generics
from .models import ParkingFee, ManagingFee, ServiceFee
from . import serializers, pagination


class ManagingFeeViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ManagingFee.objects.all()
    serializer_class = serializers.ManagingFeeSerializer
    pagination_class = pagination.ManagingFeePagination


class ParkingFeeViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ParkingFee.objects.all()
    serializer_class = serializers.ParkingFeeSerializer
    pagination_class = pagination.ParkingFeePagination


class ServiceFeeViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ServiceFee.objects.all()
    serializer_class = serializers.ServiceFeeSerializer
    pagination_class = pagination.ServiceFeePagination


