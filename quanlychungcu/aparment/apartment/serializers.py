from rest_framework import serializers
from .models import *



class UserSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        data = validated_data.copy()

        u = User(**data)
        u.set_password(u.password)
        u.save()

        return u

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'avatar', 'username', 'password']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

#============================================|| Resident ||============================================#
class ResidentInformationSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Resident
        fields = ['user', 'gender', 'day_of_birth', 'address', 'phone', 'citizen_identification']


class ResidentFeeValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeValue
        fields = ['id', 'name', 'value']


class ResidentManagingFeeSerializer(serializers.ModelSerializer):
    fee_value = ResidentFeeValueSerializer()
    resident = ResidentInformationSerializer()

    class Meta:
        model = ManagingFees
        fields = ['id', 'name', 'image', 'status', 'updated_date', 'resident', 'fee_value']


class ResidentParkingFeeSerializer(serializers.ModelSerializer):
    fee_value = ResidentFeeValueSerializer()
    resident = ResidentInformationSerializer()

    class Meta:
        model = ParkingFees
        fields = ['id', 'name', 'image', 'status', 'updated_date', 'resident', 'fee_value']


class ResidentServiceFeeSerializer(serializers.ModelSerializer):
    resident = ResidentInformationSerializer()

    class Meta:
        model = ParkingFees
        fields = ['id', 'name', 'image', 'status', 'updated_date', 'resident', 'fee_value']


class ResidentItemsInLockerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemsInLocker
        fields = ['id', 'name', 'created_date']  # Bao gồm các trường bạn muốn hiển thị


class ResidentLockerSerializer(serializers.ModelSerializer):
    items_in_locker = ResidentItemsInLockerSerializer(many=True, read_only=True, source='itemsinlocker_set')

    class Meta:
        model = Locker
        fields = ['id', 'name', 'resident', 'items_in_locker']


class ResidentFeedBackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        field = ['id', 'title', 'content', 'resident']


class ResidentSurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = Survey
        fields = ['id', 'name', 'content']


class ResidentSurveyResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurveyResident
        fields = ['id', 'survey', 'resident', 'response_content', 'created_date']

    def create(self, validated_data):
        survey_data = validated_data.pop('survey')
        survey, _ = Survey.objects.get_or_create(**survey_data)
        return SurveyResident.objects.create(survey=survey, **validated_data)
#============================================|| Admin ||============================================#