from django.contrib.admindocs.utils import get_view_name
from django.db.models.functions import Trunc
from requests import Response
from rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import action, permission_classes
from .models import *
from . import serializers


#============================================|| Resident ||============================================#
class ResidentInformationViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Resident.objects.all()
    serializer_class = serializers.ResidentInformationSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queries = self.queryset

        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(user__username__icontains=q)

        return queries


class ResidentManagingFeeViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ManagingFees.objects.all()
    serializer_class = serializers.ResidentManagingFeeSerializer

    def get_queryset(self):
        queries = self.queryset

        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(username__icontains = q)

        return queries


class ResidentParkingFeeViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ParkingFees.objects.filter(active = True, status=False).all()
    serializer_class = serializers.ResidentParkingFeeSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queries = self.queryset

        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(username__icontains = q)

        return queries


class ResidentServiceFeeViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ServiceFees.objects.all()
    serializer_class = serializers.ResidentServiceFeeSerializer

    def get_queryset(self):
        queries = self.queryset

        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(username__icontains = q)

        return queries


class ResidentLockerViewSet(viewsets.ViewSet, generics.ListAPIView):
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



class ResidentFeedBackViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Feedback.objects.all()
    serializer_class = serializers.ResidentFeedBackSerializer

    def get_queryset(self):
        queries = self.queryset

        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(username__icontains=q)

        return queries

class ResidentSurveyViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Survey.objects.all()
    serializer_class = serializers.ResidentSurveySerializer


    def get_queryset(self):
        queries = self.queryset

        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(username__icontains=q)

        return queries


class ResidentSurveyResponseViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = SurveyResident.objects.select_related('survey', 'resident').all()
    serializer_class = serializers.ResidentSurveyResponseSerializer

    def get_queryset(self):
        queries = self.queryset

        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(username__icontains=q)

        return queries