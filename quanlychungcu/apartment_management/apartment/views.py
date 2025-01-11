from rest_framework import viewsets
from .models import ParkingFee, ManagingFee, ServiceFee
import serializers


class ManagingFeeViewSet(viewsets.ViewSet):
    queryset = ManagingFee.objects.all()
    serializer_class = serializers.ManagingFeeSerializer


class ParkingFeeViewSet(viewsets.ViewSet):
    queryset = ParkingFee.objects.all()
    serializer_class = serializers.ParkingFeeSerializer


class ServiceFeeViewSet(viewsets.ViewSet):
    queryset = ServiceFee.objects.all()
    serializer_class = serializers.ServiceFeeSerializer
