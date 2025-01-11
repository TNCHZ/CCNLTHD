from rest_framework import serializers
from .models import ParkingFee, ManagingFee, ServiceFee


class ManagingFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagingFee
        fields = '__all__'


class ParkingFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingFee
        fields = '__all__'


class ServiceFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceFee
        fields = '__all__'


