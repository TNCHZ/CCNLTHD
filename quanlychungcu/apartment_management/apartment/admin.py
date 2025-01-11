from django.contrib import admin

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
admin.site.register(models.Resident)
admin.site.register(models.ManagingFees, ManagingFeesAdmin)
admin.site.register(models.ParkingFees, ParkingFeesAdmin)
admin.site.register(models.ServiceFees, ServiceFeesAdmin)
