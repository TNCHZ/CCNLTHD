from django.contrib import admin
from django.contrib.auth.models import Permission

from . import models

class ManagingFeesAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name']
    search_fields = ['name']
    list_filter = ['id', 'name']


class ParkingFeesAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name']
    search_fields = ['name']
    list_filter = ['id', 'name']


class ServiceFeesAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name']
    search_fields = ['name']
    list_filter = ['id', 'name']


# Register your models here.
admin.site.register(models.User)
admin.site.register(models.Resident)
admin.site.register(models.ManagingFees, ManagingFeesAdmin)
admin.site.register(models.ParkingFees, ParkingFeesAdmin)
admin.site.register(models.ServiceFees, ServiceFeesAdmin)
admin.site.register(models.Admin)
admin.site.register(models.Survey)
admin.site.register(models.SurveyResident)
admin.site.register(models.Feedback)
admin.site.register(models.ParkingForRelatives)
admin.site.register(models.ItemsInLocker)
admin.site.register(models.Locker)
admin.site.register(models.Address)
admin.site.register(models.Month)