from requests import Response
from rest_framework import viewsets, generics
from rest_framework.decorators import action
from .models import *
from . import serializers, pagination


#============================================|| Resident ||============================================#
class ResidentViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Resident.objects.all()
    serializer_class = serializers.ResidentSerializer

    def get_queryset(self):
        queries = self.queryset

        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(username__icontains = q)

        return queries

# lấy các managing_fee theo resident_id
    @action(methods=['get'], detail=True)
    def managing_fees(self, request, pk):
        managing_fees = self.get_object().managing_fees_set.filter(active=True).all()

        return Response(serializers.ManagingFeeSerializer(managing_fees, many=True))

# lấy các parking_fee theo resident_id
    @action(methods=['get'], detail=True)
    def parking_fees(self, request, pk):
        parking_fees = self.get_object().parking_fees_set.all()

        return Response(serializers.ParkingFeeSerializer(parking_fees, many=True))

# lấy các service_fee theo resident_id
    @action(methods=['get'], detail=True)
    def service_fees(self, request, pk):
        service_fees = self.get_object().service_fees_set.all()

        return Response(serializers.ServiceFeeSerializer(service_fees, many=True))

# lấy tủ của resident
    @action(methods=['get'],detail=True)
    def locker(self, request, pk):
        locker = self.get_object().locker_set.all()

        return Response(serializers.LockerSerializer(locker))

# lấy danh sách các đồ trong tủ
    @action(detail=True, methods=['get'], url_path='locker/(?P<locker_id>\d+)/items-in-locker')
    def items_in_locker(self, request, pk, locker_id=None):
        try:
            # Lấy Resident từ pk
            resident = self.get_object().filter(active=True)
            # Lấy Locker theo locker_id và Resident
            locker = Locker.objects.get(pk=locker_id, resident=resident)
            # Lấy các Items trong Locker
            items = ItemsInLocker.objects.filter(locker=locker)
            # Serialize và trả về danh sách Items
            return Response(serializers.ItemsInLockerSerializer(items, many=True))

        except Locker.DoesNotExist:
            return Response({"error": "Locker not found."}, status=404)


#============================================|| ManagingFees ||============================================#
class ManagingFeesViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ManagingFees.objects.all()
    serializer_class = serializers.ManagingFeeSerializer
    pagination_class = pagination.ManagingFeePagination

    def get_queryset(self):
        queries = self.queryset

        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(name_icontains = q)

        return queries


#============================================|| ParkingFees ||============================================#
class ParkingFeesViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ParkingFees.objects.all()
    serializer_class = serializers.ParkingFeeSerializer
    pagination_class = pagination.ParkingFeePagination

    def get_queryset(self):
        queries = self.queryset

        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(name_icontains = q)

        return queries


#============================================|| ServiceFees ||============================================#
class ServiceFeesViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ServiceFees.objects.all()
    serializer_class = serializers.ServiceFeeSerializer
    pagination_class = pagination.ServiceFeePagination

    def get_queryset(self):
        queries = self.queryset

        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(name_icontains = q)

        return queries


#============================================|| Locker ||============================================#
class LockerViewSet(viewsets.ViewSet,generics.ListAPIView):
    queryset = Locker.objects.filter(active=True).all()
    serializer_class = serializers.LockerSerializer

# lấy danh sách các đồ trong tủ
    @action(methods=['get'], detail=True)
    def items_in_locker(self, request, pk):
        items_in_locker = self.get_object().items_in_locker_set.all()

        return Response(serializers.ItemsInLockerSerializer(items_in_locker, many=True))