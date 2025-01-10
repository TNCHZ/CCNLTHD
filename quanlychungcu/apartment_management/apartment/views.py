from rest_framework import viewsets
from .models import ParkingFee
from .serializers import ParkingFeeSerializer


class ParkingFeeViewSet(viewsets.ModelViewSet):
    queryset = ParkingFee.objects.all()
    serializer_class = ParkingFeeSerializer
