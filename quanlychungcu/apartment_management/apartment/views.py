from requests import Response
from rest_framework import viewsets, generics
from rest_framework.decorators import action
from .models import ParkingFees, ManagingFees, ServiceFees, Resident
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