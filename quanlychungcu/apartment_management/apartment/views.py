from django.contrib.admindocs.utils import get_view_name
from django.db.models.functions import Trunc
from requests import Response
from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from .models import *
from . import serializers, pagination



#============================================|| Resident ||============================================#
class ResidentAccountViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Resident.objects.all()
    serializer_class = serializers.ResidentAccountSerializer

    def get_queryset(self):
        queries = self.queryset

        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(username__icontains = q)

        return queries

class ResidentInformationViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Resident.objects.all()
    serializer_class = serializers.ResidentInformationSerializer

    def get_queryset(self):
        queries = self.queryset

        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(username__icontains = q)

        return queries

    # lấy tủ của resident
    @action(methods=['get'], detail=True)
    def locker(self, request, pk):
        locker = self.get_object().locker_set.all()
        return Response(serializers.LockerSerializer(locker))


class ResidentManagingFeeViewSet(viewsets.ModelViewSet, generics.ListAPIView):
    queryset = ManagingFees.objects.all()
    serializer_class = serializers.ResidentManagingFeeSerializer

    def get_queryset(self):
        queries = self.queryset

        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(username__icontains = q)

        return queries


class ResidentParkingFeeViewSet(viewsets.ModelViewSet, generics.ListAPIView):
    queryset = ParkingFees.objects.all()
    serializer_class = serializers.ResidentParkingFeeSerializer

    def get_queryset(self):
        queries = self.queryset

        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(username__icontains = q)

        return queries


class ResidentServiceFeeViewSet(viewsets.ModelViewSet, generics.ListAPIView):
    queryset = ServiceFees.objects.all()
    serializer_class = serializers.ResidentServiceFeeSerializer

    def get_queryset(self):
        queries = self.queryset

        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(username__icontains = q)

        return queries


class ResidentLockerViewSet(viewsets.ModelViewSet, generics.ListAPIView):
    queryset = Locker.objects.all()
    serializer_class = serializers.ResidentLockerSerializer

    def get_queryset(self):
        queries = self.queryset

        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(username__icontains = q)

        return queries

    @action(methods=['get'], detail=True)
    def items_in_locker(self, request, pk):
        items_in_locker = self.get_object().items_in_locker_set.all()

        return Response(serializers.ResidentItemsInLockerSerializer(items_in_locker, many=True))



class ResidentFeedBackViewSet(viewsets.ModelViewSet, generics.ListAPIView):
    queryset = Feedback.objects.all()
    serializer_class = serializers.ResidentFeedBackSerializer

    def get_queryset(self):
        queries = self.queryset

        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(username__icontains=q)

        return queries

class ResidentSurveyViewSet(viewsets.ModelViewSet):
    queryset = Survey.objects.all()
    serializer_class = serializers.ResidentSurveySerializer


class ResidentSurveyResponseViewSet(viewsets.ModelViewSet):
    queryset = SurveyResident.objects.select_related('survey', 'resident').all()
    serializer_class = serializers.ResidentSurveyResponseSerializer