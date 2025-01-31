from requests import Response
from rest_framework import viewsets, generics, status
from rest_framework.decorators import action, permission_classes
from .models import *
from . import serializers
from .perms import *
from rest_framework.response import Response



class MonthViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = Month.objects.all()
    serializer_class = serializers.MonthSerializer


class UserViewSet(viewsets.ViewSet):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer

    def get_permissions(self):
        if self.action in ['get_current_user']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        return Response(serializers.UserSerializer(request.user).data)

    @action(detail=True, methods=['patch'], url_path='update-avatar-password')
    def update_avatar_password(self, request, pk=None):
        user = self.get_object()  # Lấy người dùng hiện tại

        # Kiểm tra nếu có avatar hoặc password được gửi trong request
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()  # Lưu lại dữ liệu đã cập nhật
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class ResidentCreateViewSet(viewsets.ViewSet):
    queryset = Resident.objects.all()
    serializer_class = serializers.CreateResidentSerializer
    permission_classes = [AdminPermission]

    def create(self, request):
        serializer = serializers.CreateResidentSerializer(data=request.data)
        if serializer.is_valid():
            resident = serializer.save()  # Gọi create() của serializer
            return Response(
                {"message": "Resident created successfully!", "resident_id": resident.user.id},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#============================================|| Resident ||============================================#
class ListResident(viewsets.ViewSet, generics.ListAPIView):
    queryset = Resident.objects.all()
    serializer_class = serializers.ResidentInformationSerializer



class ResidentDetailViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = Resident.objects.all()
    serializer_class = serializers.ResidentInformationSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queries = self.queryset

        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(user__username__icontains=q)

        return queries


    @action(methods=['get'], url_path='managing-fees', detail=True)
    def get_managing_fees(self, request, pk=None):
        try:
            resident = Resident.objects.get(pk=pk)
        except Resident.DoesNotExist:
            return Response({"detail": "Resident not found"}, status=status.HTTP_404_NOT_FOUND)

        managing_fees = ManagingFees.objects.filter(resident=resident, status=False)
        managing_fees_serializer = serializers.ResidentManagingFeeSerializer(managing_fees, many=True)

        return Response(managing_fees_serializer.data)


    @action(methods=['get'], url_path='parking-fees', detail=True)
    def get_parking_fees(self, request, pk=None):
        try:
            resident = Resident.objects.get(pk=pk)
        except Resident.DoesNotExist:
            return Response({"detail": "Resident not found"}, status=status.HTTP_404_NOT_FOUND)

        parking_fees = ParkingFees.objects.filter(resident=resident, status=False)
        parking_fees_serializer = serializers.ResidentParkingFeeSerializer(parking_fees, many=True)
        return Response(parking_fees_serializer.data)


    @action(methods=['get'], url_path='service-fees', detail=True)
    def get_service_fees(self, request, pk=None):
        try:
            resident = Resident.objects.get(pk=pk)
        except Resident.DoesNotExist:
            return Response({"detail": "Resident not found"}, status=status.HTTP_404_NOT_FOUND)

        parking_fees = ServiceFees.objects.filter(resident=resident, status=False)
        parking_fees_serializer = serializers.ResidentParkingFeeSerializer(parking_fees, many=True)
        return Response(parking_fees_serializer.data)


    @action(methods=['get'], url_path='locker', detail=True)
    def get_locker(self, request, pk=None):
        try:
            resident = Resident.objects.get(pk=pk)
        except Resident.DoesNotExist:
            return Response({"detail": "Resident not found"}, status=status.HTTP_404_NOT_FOUND)

        locker = Locker.objects.filter(resident=resident)
        locker_serializer = serializers.ResidentLockerSerializer(locker)
        return Response(locker_serializer.data)

    @action(methods=['get'], url_path='surveys', detail=True)
    def get_surveys(self, request, pk=None):
        try:
            resident = Resident.objects.get(pk=pk)
        except Resident.DoesNotExist:
            return Response({"detail": "Resident not found"}, status=status.HTTP_404_NOT_FOUND)

        survey_residents = SurveyResident.objects.filter(resident=resident)
        survey_resident_serializer = serializers.SurveyResidentSerializer(survey_residents, many=True)
        return Response(survey_resident_serializer.data)

    @action(methods=['get'], url_path='feedback', detail=True)
    def get_feedbacks(self, request, pk=None):
        try:
            resident = Resident.objects.get(pk=pk)
        except Resident.DoesNotExist:
            return Response({"detail": "Resident not found"}, status=status.HTTP_404_NOT_FOUND)

        feedback_resident = Feedback.objects.filter(resident=resident)
        feedback_resident_serializer = serializers.ResidentFeedBackSerializer(survey_residents, many=True)
        return Response(feedback_resident_serializer.data)


    @action(methods=['get'], url_path='all-fees', detail=True)
    def get_all_fees(self, request, pk=None):
        try:
            resident = Resident.objects.get(pk=pk)
        except Resident.DoesNotExist:
            return Response({"detail": "Resident not found"}, status=status.HTTP_404_NOT_FOUND)

        # Lấy tất cả các loại phí có status=False
        managing_fees = ManagingFees.objects.filter(resident=resident)
        parking_fees = ParkingFees.objects.filter(resident=resident)
        service_fees = ServiceFees.objects.filter(resident=resident)

        # Tuần tự hóa dữ liệu từng loại phí
        managing_fees_serializer = serializers.ResidentManagingFeeSerializer(managing_fees, many=True)
        parking_fees_serializer = serializers.ResidentParkingFeeSerializer(parking_fees, many=True)
        service_fees_serializer = serializers.ResidentServiceFeeSerializer(service_fees, many=True)

        # Gộp tất cả phí thành một danh sách
        all_fees = {
            "managing_fees": managing_fees_serializer.data,
            "parking_fees": parking_fees_serializer.data,
            "service_fees": service_fees_serializer.data,
        }

        return Response(all_fees)

class ResidentManagingFeeViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = ManagingFees.objects.all()
    serializer_class = serializers.ResidentManagingFeeSerializer

    def get_permissions(self):
        if self.request.method == "POST":  # POST: Admin only
            return [permissions.IsAuthenticated(), AdminPermission()]
        elif self.request.method == "PATCH": # PATCH: Resident only
            return [permissions.IsAuthenticated(), ResidentPermission()]
        elif self.request.method == "GET":
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

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


class AddressViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Address.objects.filter(is_free=True).all()
    serializer_class = serializers.AddressSerializer