from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import *

class MonthSerializer(serializers.ModelSerializer):
    class Meta:
        model = Month
        fields = ['id', 'name', 'year']

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'name', 'is_free']


class FeedbackSerializer(serializers.ModelSerializer):
    serializers.PrimaryKeyRelatedField(queryset=Resident.objects.all())
    resident_details = serializers.SerializerMethodField()

    class Meta:
        model = Feedback
        fields = ['id', 'content', 'resident', 'resident_details']

    def get_resident_details(self, obj):
        return ResidentInformationSerializer(obj.resident).data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'avatar', 'username', 'password', 'role', 'change_password_image']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def update(self, instance, validated_data):
        avatar = validated_data.get('avatar', None)
        if avatar:
            instance.avatar = avatar

        # Cập nhật password nếu có
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)

        # Cập nhật change_password_image nếu có
        change_password_image = validated_data.get('change_password_image', None)
        if change_password_image:
            instance.change_password_image = change_password_image

        instance.save()
        return instance


class CreateResidentSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Resident
        fields = ['user', 'gender', 'day_of_birth', 'address', 'phone', 'citizen_identification']

    def create(self, validated_data):
        user_data = validated_data.pop('user')

        address = validated_data.get('address')
        if not address:
            raise ValidationError({"address": "Địa chỉ không hợp lệ"})

        user = User.objects.create(
            username=user_data['username'],
            first_name=user_data.get('first_name', ''),
            last_name=user_data.get('last_name', ''),
            role=user_data.get('role', 'Resident')
        )
        user.set_password(user_data['password'])
        user.save()

        resident = Resident.objects.create(user=user, **validated_data)
        address.is_free = False
        address.save()

        return resident



#============================================|| Resident ||============================================#
class ResidentInformationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    userdetail = serializers.SerializerMethodField()

    address = AddressSerializer()

    class Meta:
        model = Resident
        fields = ['user', 'userdetail', 'gender', 'day_of_birth', 'address', 'phone', 'citizen_identification']

    def get_userdetail(self, obj):
        return UserSerializer(obj.user).data



class ManagingFeeSerializer(serializers.ModelSerializer):
    month = serializers.PrimaryKeyRelatedField(queryset=Month.objects.all())
    month_details = serializers.SerializerMethodField()

    class Meta:
        model = ManagingFees
        fields = ['id', 'name', 'fee_image', 'status', 'month', 'month_details', 'updated_date', 'resident', 'fee_value']

    def get_month_details(self, obj):
        return MonthSerializer(obj.month).data


class ParkingFeeSerializer(serializers.ModelSerializer):
    month = serializers.PrimaryKeyRelatedField(queryset=Month.objects.all())
    month_details = serializers.SerializerMethodField()

    class Meta:
        model = ParkingFees
        fields = ['id', 'name', 'fee_image', 'status', 'month', 'month_details', 'updated_date', 'resident', 'fee_value']


    def get_month_details(self, obj):
        return MonthSerializer(obj.month).data

class ServiceFeeSerializer(serializers.ModelSerializer):
    month = serializers.PrimaryKeyRelatedField(queryset=Month.objects.all())
    month_details = serializers.SerializerMethodField()

    class Meta:
        model = ServiceFees
        fields = ['id', 'name', 'fee_image', 'status', 'month', 'month_details', 'updated_date', 'resident', 'fee_value']

    def get_month_details(self, obj):
        return MonthSerializer(obj.month).data



class ResidentItemsInLockerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemsInLocker
        fields = ['id', 'name', 'status', 'locker', 'created_date']  # Bao gồm các trường bạn muốn hiển thị


class ResidentLockerSerializer(serializers.ModelSerializer):
    items_in_locker = ResidentItemsInLockerSerializer(many=True, read_only=True, source='itemsinlocker_set')

    class Meta:
        model = Locker
        fields = ['id', 'name', 'resident', 'items_in_locker']


class SurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = Survey
        fields = ['id', 'name', 'content']


class ResidentSurveyResponseSerializer(serializers.ModelSerializer):
    survey = serializers.PrimaryKeyRelatedField(queryset=Survey.objects.all())
    resident = serializers.PrimaryKeyRelatedField(queryset=Resident.objects.all())

    survey_details = serializers.SerializerMethodField()
    resident_details = serializers.SerializerMethodField()
    class Meta:
        model = SurveyResident
        fields = ['id', 'survey', 'survey_details', 'resident', 'resident_details', 'response_content', 'updated_date', 'is_response']

    def get_survey_details(self, obj):
        return SurveySerializer(obj.survey).data

    def get_resident_details(self, obj):
        return ResidentInformationSerializer(obj.resident).data


class ResidentRelativeRegisterSerializer(serializers.ModelSerializer):
    resident = serializers.PrimaryKeyRelatedField(queryset=Resident.objects.all())
    resident_details = serializers.SerializerMethodField()

    class Meta:
        model = ParkingForRelatives
        fields = ['id', 'name_relative', 'phone_relative', 'is_come', 'resident', 'resident_details', 'updated_date']

    def get_resident_details(self, obj):
        return ResidentInformationSerializer(obj.resident).data