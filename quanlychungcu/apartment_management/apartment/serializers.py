from rest_framework import serializers
from .models import ParkingFees, ManagingFees, ServiceFees, Resident


#============================================|| Resident ||============================================#
class ResidentSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField(source='avatar')

    def get_image(self, managing_fee):
        if managing_fee.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri('/static/%s' % managing_fee.avatar.name)
            return '/static/%s' % managing_fee.avatar.name

    class Meta:
        model = Resident
        fields = '__all__'


#============================================|| ManagingFees ||============================================#
class ManagingFeeSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(source='image')

    def get_image(self, managing_fee):
        if managing_fee.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri('/static/%s' % managing_fee.image.name)
            return '/static/%s' % managing_fee.image.name


    class Meta:
        model = ManagingFees
        fields = '__all__'


#============================================|| ParkingFees ||============================================#
class ParkingFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingFees
        fields = '__all__'


#============================================|| ServiceFees ||============================================#
class ServiceFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceFees
        fields = '__all__'