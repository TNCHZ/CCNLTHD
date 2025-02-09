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
    avatar = CloudinaryField('avatar', null=True, blank=True)
    change_password_image = models.BooleanField(default=False)

    role = models.CharField(
        max_length=20,
        choices=Role.choices(),
        default=Role.RESIDENT.value
    )
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='apartment_user_groups',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='apartment_user_permissions',
        blank=True,
    )

    class Meta:
        ordering = ["id"]


class Admin(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    class Meta:
        ordering = ["user"]

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
    address = models.ForeignKey(Address, on_delete=models.CASCADE, blank=True, null=True)
    phone = models.CharField(max_length=10, null=False, unique=True)
    citizen_identification = models.CharField(max_length=12, null=False, unique=True)

    class Meta:
        ordering = ["user"]

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
    fee_image = CloudinaryField('fee_image', null=True, blank = True)
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
        unique_together = ['resident', 'month']

    def __str__(self):
        return self.name


class ManagingFees(Fee):
    pass


class ParkingFees(Fee):
    pass


class ParkingForRelatives(BaseModel):
    name_relative = models.TextField(null=False)
    phone_relative = models.CharField(max_length=10, null=False)
    STATUS_CHOICES = [
        (True, 'Đã đến'),
        (False, 'Chưa đến'),
    ]
    is_come = models.BooleanField(choices=STATUS_CHOICES, default=False)
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE)

    def __str__(self):
        return self.name_relative


class ServiceFees(Fee):
    pass


class Locker(BaseModel):
    name = models.TextField(null = False)
    resident = models.OneToOneField(
        Resident,
        on_delete=models.SET_NULL,
        related_name='locker',
        blank=True,
        null=True
    )

    def __str__(self):
        return self.name


class ItemsInLocker(BaseModel):
    name = models.TextField(null=False)
    locker = models.ForeignKey(Locker, on_delete=models.CASCADE)
    STATUS_CHOICES = [
        (True, 'Đã lấy'),
        (False, 'Chưa lấy'),
    ]
    status = models.BooleanField(choices=STATUS_CHOICES, default=False)
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

