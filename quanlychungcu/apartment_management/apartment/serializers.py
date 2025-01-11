from rest_framework import serializers
from .models import ParkingFees, ManagingFees, ServiceFees


class ManagingFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagingFees
        fields = '__all__'


class ParkingFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingFees
        fields = '__all__'


class ServiceFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceFees
        fields = '__all__'