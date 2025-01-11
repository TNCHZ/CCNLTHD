from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField


class User(AbstractUser):
    avatar = CloudinaryField('avatar', null=True)

    class Meta:
        abstract = True
        ordering = ["id"]


class Admin(User):
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='admin_set',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='admin_permissions_set',
        blank=True,
    )


class Resident(User):
    GENDER_CHOICES = [
        (True, 'Male'),
        (False, 'Female'),
    ]
    gender = models.BooleanField(choices=GENDER_CHOICES, default=True)
    day_of_birth = models.DateField(null=False)
    address = models.TextField(null=False)
    phone = models.IntegerField(null=False, unique=True)
    citizen_identification = models.IntegerField(null=False)
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='resident_set',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='resident_permissions_set',
        blank=True,
    )


class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        abstract = True
        ordering = ["id"]



class Fee(BaseModel):
    name = models.TextField(null = False)
    value = models.FloatField(null=False)
    image = CloudinaryField('fee', null=True)
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class ManagingFees(Fee):
    pass


class ParkingFees(Fee):
    def __str__(self):
        return self.name


class ServiceFees(Fee):
    name = models.TextField(null = False)


class ItemsInLocker(BaseModel):
    name = models.TextField(null = False)


class Locker(BaseModel):
    items = models.ForeignKey(ItemsInLocker, on_delete=models.CASCADE)
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE)


class Interaction(BaseModel):
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class Feedback(Interaction):
    title = models.TextField()
    content = models.TextField()
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE)


class Survey(Interaction):
    name = models.TextField()
    content = models.TextField(blank=True, null=True)



