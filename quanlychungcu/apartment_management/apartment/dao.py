from apartment_management.apartment.models import *

#============================================|| ManagingFees ||============================================#
def load_managing_fees(params={}):
    q = ManagingFees.objects.all()

    kw = params.get('kw') #lọc theo id
    if kw:
        q = q.filter(subject__icontains=kw) #icontain ->'i'contain là không phân biệt chữ hoa, thường

    res_id =  params.get('res_id') #lọc theo id resident
    if res_id:
        q = q.filter(resident_id=res_id)

    return q


#============================================|| ParkingFees ||============================================#
def load_parking_fees(params={}):
    q = ParkingFees.objects.all()

    kw = params.get('kw')
    if kw:
        q = q.filter(subject__icontains=kw)

    res_id = params.get('res_id')
    if res_id:
        q = q.filter(resident_id=res_id)

    return q


#============================================|| ServiceFees ||============================================#
def load_service_fees(params={}):
    q = ServiceFees.objects.all()

    kw = params.get('kw')
    if kw:
        q = q.filter(subject__icontains=kw)

    res_id = params.get('res_id')
    if res_id:
        q = q.filter(resident_id=res_id)

    return q
