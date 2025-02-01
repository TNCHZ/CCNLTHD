from rest_framework import serializers
from .models import *

class MonthSerializer(serializers.ModelSerializer):
    class Meta:
        model = Month
        fields = ['id', 'name']

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'name', 'is_free']



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


#============================================|| Resident ||============================================#
class ResidentInformationSerializer(serializers.ModelSerializer):
    address = AddressSerializer()

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


class ResidentFeeValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeValue
        fields = ['id', 'name', 'value']



class ResidentManagingFeeSerializer(serializers.ModelSerializer):
    fee_value = ResidentFeeValueSerializer()

    class Meta:
        model = ManagingFees
        fields = ['id', 'name', 'image', 'status', 'updated_date', 'resident', 'fee_value']

    def create(self, validated_data):
        resident = validated_data.pop('resident')
        fee_value = validated_data.pop('fee_value')

        managing_fee = ManagingFees.objects.create(
            resident=resident,
            fee_value=fee_value,
            **validated_data
        )

        return managing_fee

    def update(self, instance, validated_data):
        resident = validated_data.pop('resident', None)
        fee_value = validated_data.pop('fee_value', None)

        if resident:
            instance.resident = resident
        if fee_value:
            instance.fee_value = fee_value

        instance.status = validated_data.get('status', instance.status)
        instance.image = validated_data.get('image', instance.image)

        instance.save()
        return instance


class ResidentParkingFeeSerializer(serializers.ModelSerializer):
    fee_value = ResidentFeeValueSerializer()

    class Meta:
        model = ParkingFees
        fields = ['id', 'name', 'image', 'status', 'updated_date', 'resident', 'fee_value']

    def create(self, validated_data):
        resident = validated_data.pop('resident')  # Đây sẽ là ID của resident
        fee_value = validated_data.pop('fee_value')  # Đây sẽ là ID của fee_value

        managing_fee = ManagingFees.objects.create(
            resident=resident,
            fee_value=fee_value,
            **validated_data
        )

        return managing_fee

    def update(self, instance, validated_data):
        resident = validated_data.pop('resident', None)
        fee_value = validated_data.pop('fee_value', None)

        if resident:
            instance.resident = resident
        if fee_value:
            instance.fee_value = fee_value

        instance.status = validated_data.get('status', instance.status)
        instance.image = validated_data.get('image', instance.image)

        instance.save()
        return instance


class ResidentServiceFeeSerializer(serializers.ModelSerializer):
    fee_value = ResidentFeeValueSerializer()

    class Meta:
        model = ParkingFees
        fields = ['id', 'name', 'image', 'status', 'updated_date', 'resident', 'fee_value']

    def create(self, validated_data):
        resident = validated_data.pop('resident')  # Đây sẽ là ID của resident
        fee_value = validated_data.pop('fee_value')  # Đây sẽ là ID của fee_value

        managing_fee = ManagingFees.objects.create(
            resident=resident,
            fee_value=fee_value,
            **validated_data
        )

        return managing_fee

    def update(self, instance, validated_data):
        resident = validated_data.pop('resident', None)
        fee_value = validated_data.pop('fee_value', None)

        if resident:
            instance.resident = resident
        if fee_value:
            instance.fee_value = fee_value

        instance.status = validated_data.get('status', instance.status)
        instance.image = validated_data.get('image', instance.image)

        instance.save()
        return instance


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
    survey = ResidentSurveySerializer()

    class Meta:
        model = SurveyResident
        fields = ['id', 'survey', 'resident', 'response_content', 'created_date']

    def create(self, validated_data):
        survey_data = validated_data.pop('survey')
        survey, _ = Survey.objects.get_or_create(**survey_data)
        return SurveyResident.objects.create(survey=survey, **validated_data)
#============================================|| Admin ||============================================#