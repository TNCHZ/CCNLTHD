from rest_framework import serializers
from .models import *


#============================================|| Resident ||============================================#
class ResidentSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField(source='avatar')

    def get_image(self, resident):
        if resident.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri('/static/%s' % resident.avatar.name)
            return '/static/%s' % resident.avatar.name

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


#============================================|| Locker ||============================================#
class LockerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Locker
        fields = '__all__'


#============================================|| ItemsInLocker ||============================================#
class ItemsInLockerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemsInLocker
        fields = '__all__'


class FeeValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeValue
        fields = '__all__'


class ParkingForRelativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingForRelatives
        fields = '__all__'



class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'


class SurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = Survey
        fields = '__all__'


class SurveyResidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurveyResident
        fields = '__all__'
