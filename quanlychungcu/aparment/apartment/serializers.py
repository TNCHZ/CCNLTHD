from rest_framework import serializers
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
    class Meta:
        model = Feedback
        fields = ['id', 'content', 'resident']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'avatar', 'username', 'password', 'role', 'change_password_image', 'is_active']
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
        from django.core.exceptions import ValidationError
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
    class Meta:
        model = ManagingFees
        fields = ['id', 'name', 'image', 'status', 'month', 'updated_date', 'resident', 'fee_value']


class ParkingFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingFees
        fields = ['id', 'name', 'image', 'status', 'month', 'updated_date', 'resident', 'fee_value']


class ServiceFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingFees
        fields = ['id', 'name', 'image', 'status', 'month', 'updated_date', 'resident', 'fee_value']



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


class SurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = Survey
        fields = ['id', 'name', 'content']


class ResidentSurveyResponseSerializer(serializers.ModelSerializer):
    # Dùng PrimaryKeyRelatedField để chỉ nhận ID của Survey khi POST
    survey = serializers.PrimaryKeyRelatedField(queryset=Survey.objects.all())

    # Sử dụng SerializerMethodField để lấy dữ liệu đầy đủ của survey khi GET
    survey_details = serializers.SerializerMethodField()

    class Meta:
        model = SurveyResident
        fields = ['id', 'survey', 'survey_details', 'resident', 'response_content', 'updated_date', 'is_response']

    # Hàm để trả về dữ liệu đầy đủ của Survey khi GET
    def get_survey_details(self, obj):
        return SurveySerializer(obj.survey).data