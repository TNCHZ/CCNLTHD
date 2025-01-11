from rest_framework.pagination import PageNumberPagination

class ManagingFeePagination(PageNumberPagination):
    page_size = 2


class ParkingFeePagination(PageNumberPagination):
    page_size = 2


class ServiceFeePagination(PageNumberPagination):
    page_size = 2
