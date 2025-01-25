from rest_framework import permissions
from apartment.models import Role

class OwnerPermission(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj=None):
        if not obj:
            return False
        return super().has_permission(request, view) and request.user == obj.user


class AdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role == Role.ADMIN.value


class ResidentPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role == Role.RESIDENT.value
