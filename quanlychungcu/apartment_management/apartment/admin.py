from django.contrib import admin

from . import models


class ManagingFeeAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name']
    search_fields = ['name']
    list_filter = ['id', 'name']


class ParkingFeeAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name']
    search_fields = ['name']
    list_filter = ['id', 'name']


class ServiceFeeAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name']
    search_fields = ['name']
    list_filter = ['id', 'name']


# Register your models here.
admin.site.register(models.Resident)
admin.site.register(models.ManagingFee, ManagingFeeAdmin)
admin.site.register(models.ParkingFee, ParkingFeeAdmin)
admin.site.register(models.ServiceFee, ServiceFeeAdmin)
