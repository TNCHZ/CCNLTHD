from dataclasses import fields
from datetime import datetime

from cloudinary.provisioning import users
from django.contrib.auth.models import AbstractUser, Group, Permission
from ckeditor.fields import RichTextField
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField
from django.db import models
from enum import Enum

from django.template.defaultfilters import default


class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        abstract = True
        ordering = ["-id"]


class Role(Enum):
    ADMIN = "Admin"
    RESIDENT = "Resident"

    @classmethod
    def choices(cls):
        return [(role.value, role.name.capitalize()) for role in cls]

class User(AbstractUser):
    avatar = CloudinaryField('avatar', null=True, blank=True, default="https://res.cloudinary.com/dqlk15sot/image/upload/v1738150398/default-avatar-profile-icon-of-social-media-user-vector_qydb7c.jpg")
    change_password_image = models.BooleanField(default=False)

    role = models.CharField(
        max_length=20,
        choices=Role.choices(),
        default=Role.ADMIN.value
    )
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='apartment_user_groups',  # Tên tùy chỉnh
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='apartment_user_permissions',  # Tên tùy chỉnh
        blank=True,
    )

    class Meta:
        ordering = ["id"]


class Admin(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    class Meta:
        ordering = ["user"]  # Sắp xếp theo khóa chính (user)

    def __str__(self, user=None):
        return self.user.username


class Address(BaseModel):
    name = models.TextField(null=False)
    is_free = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Resident(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    gender = models.BooleanField(choices=[(True, 'Male'), (False, 'Female')], default=True)
    day_of_birth = models.DateField(null=False)
    address = models.ForeignKey(Address, on_delete=models.CASCADE)
    phone = models.CharField(max_length=10, null=False, unique=True)
    citizen_identification = models.CharField(max_length=12, null=False, unique=True)

    class Meta:
        ordering = ["user"]  # Sắp xếp theo khóa chính (user)

    def __str__(self, user=None):
        return self.user.first_name + " " + self.user.last_name


class Month(models.Model):
    name = models.PositiveIntegerField(default=datetime.now().month)
    year = models.PositiveIntegerField(default=datetime.now().year)

    class Meta:
        unique_together = ['name', 'year']
        ordering = ['year', 'name']

    def __str__(self):
        return "Tháng " + f"{self.name} {self.year}"

class Fee(BaseModel):
    name = models.TextField(null=False)
    image = CloudinaryField('fee', null=True, blank = True)
    month = models.ForeignKey(Month, on_delete=models.CASCADE)
    fee_value = models.CharField(max_length=20, blank=True, null=False)
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE)
    STATUS_CHOICES = [
        (True, 'Đã thanh toán'),
        (False, 'Chưa thanh toán'),
    ]
    status = models.BooleanField(choices=STATUS_CHOICES, default=False)

    class Meta:
        abstract = True
        unique_together = ['resident', 'month']  # Ràng buộc duy nhất giữa cư dân và tháng


    def __str__(self):
        return self.name


class ManagingFees(Fee):
    pass


class ParkingFees(Fee):
    pass


class ParkingForRelatives(BaseModel):
    name_relative = models.TextField(null=False)
    phone_relative = models.CharField(max_length=10, null=False, unique=True)
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE)

    def __str__(self):
        return self.name_relative


class ServiceFees(Fee):
    pass


class Locker(BaseModel):
    name = models.TextField(null = False)
    STATUS_CHOICES = [
        (True, 'Không có đồ cần lấy'),
        (False, 'Có đồ cần lấy'),
    ]
    status = models.BooleanField(choices=STATUS_CHOICES, default=True)
    resident = models.OneToOneField(
        Resident,  # Đảm bảo quan hệ một-một
        on_delete=models.CASCADE,
        related_name='locker',  # Tên truy cập ngược từ Resident
    )

    def __str__(self):
        return self.name




class ItemsInLocker(BaseModel):
    name = models.TextField(null=False)
    locker = models.ForeignKey(Locker, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Feedback(BaseModel):
    content = RichTextField(null=False, blank=True)
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE)

    def __str__(self):
        return self.resident


class Survey(BaseModel):
    name = models.TextField()
    content = RichTextField(null=False, blank=True)
    residents = models.ManyToManyField(
        'Resident',
        through='SurveyResident',
        related_name='surveys',
        blank=True
    )
    def __str__(self):
        return self.name


class SurveyResident(BaseModel):
    survey = models.ForeignKey('Survey', on_delete=models.CASCADE)
    resident = models.ForeignKey('Resident', on_delete=models.CASCADE)
    response_content = RichTextField(null=False, blank=True)
    is_response = models.BooleanField(default=False)

    class Meta:
        unique_together = ['survey', 'resident']

