from django.contrib import admin

from . import models

class ApartmentAdminSite(admin.AdminSite):
    site_header = 'iSuccess'


admin_site = ApartmentAdminSite(name='myApp')


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
admin_site.register(models.Resident)
admin_site.register(models.ManagingFees, ManagingFeesAdmin)
admin_site.register(models.ParkingFees, ParkingFeesAdmin)
admin_site.register(models.ServiceFees, ServiceFeesAdmin)
