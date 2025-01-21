from django.db.models.functions import Trunc
from requests import Response
from rest_framework import viewsets, generics, status
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

        return Response(serializers.ManagingFeeSerializer(managing_fees, many=True, context = {'request': request}).data)

# lấy các parking_fee theo resident_id
    @action(methods=['get'], detail=True)
    def parking_fees(self, request, pk):
        parking_fees = self.get_object().parking_fees_set.all()

        return Response(serializers.ParkingFeeSerializer(parking_fees, many=True, context = {'request': request}).data)

# lấy các service_fee theo resident_id
    @action(methods=['get'], detail=True)
    def service_fees(self, request, pk):
        service_fees = self.get_object().service_fees_set.all()

        return Response(serializers.ServiceFeeSerializer(service_fees, many=True, context = {'request': request}).data)


    @action(methods=['post'], detail=True, url_path='register-parking-relative')
    def register_parking_relative(self, request, pk=None):
        resident = self.get_object()

        data = request.data.copy()
        data['resident'] = resident.id

        serializer = serializers.ParkingForRelativeSerializer(data=data, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Đăng ký giữ xe cho người thân thành công!',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response({
            'message': 'Dữ liệu không hợp lệ!',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


# lấy tủ của resident
    @action(methods=['get'],detail=True)
    def locker(self, request, pk):
        locker = self.get_object().locker_set.all()
        return Response(serializers.LockerSerializer(locker))


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



class ParkingRelativeViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ParkingForRelatives.objects.filter(active = True).all()
    serializers_class = serializers.ParkingForRelativeSerializer


class ItemsInLockerViewSet(viewsets.ModelViewSet, generics.ListAPIView):
    queryset = ItemsInLocker.objects.all()
    serializer_class = serializers.ItemsInLockerSerializer


class FeedbackViewSet(viewsets.ModelViewSet, generics.ListAPIView):
    queryset = Feedback.objects.all()
    serializer_class = serializers.FeedbackSerializer


class SurveyViewSet(viewsets.ModelViewSet, generics.ListAPIView):
    queryset = Survey.objects.all()
    serializer_class = serializers.SurveySerializer


class SurveyResidentViewSet(viewsets.ModelViewSet, generics.ListAPIView):
    queryset = SurveyResident.objects.all()
    serializer_class = serializers.SurveyResidentSerializer


class AdminViewSet(viewsets.ModelViewSet, generics.ListAPIView):
    queryset = Admin.objects.all()
    serializer_class = serializers.AdminSerializer


class FeeValueViewSet(viewsets.ModelViewSet, generics.ListAPIView):
    queryset = FeeValue.objects.all()
    serializer_class = serializers.FeeValueSerializer

