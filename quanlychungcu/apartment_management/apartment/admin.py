from django.contrib import admin

from . import models

# Register your models here.
admin.site.register(models.ManagingFee)
admin.site.register(models.ParkingFee)
admin.site.register(models.ServiceFee)
