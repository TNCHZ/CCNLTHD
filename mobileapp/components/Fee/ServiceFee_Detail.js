import { useEffect, useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { Text, View, ScrollView } from "react-native";

const ServiceFee_Detail = ({route}) => {
    const serviceFeeID= route.parmas?.managingFeeID;
    const [loading, setLoading]= useState(false);
    const [serviceFee, setServiceFee] = useState([]);

    const loadServiceFee = async () => {
        try {
            setLoading(true)
            let res = await APIs.get(endpoints['service-fee'](serviceFeeID));
            setServiceFee(res.data);

        } catch (error) {
            console.error("Lỗi: ", error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadServiceFee();
    },[serviceFeeID])
    return (
        <ScrollView style={{margin: 10}}>
            <Text>Phí Dịch Vụ</Text>
            {loading && <ActivityIndicator />}
            {serviceFee && 
                <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{serviceFee.name}</Text>
                    
                    <Text>Trạng thái: {serviceFee.status ? "Đã thanh toán" : "Chưa thanh toán"}</Text>
                </View>
            }
        </ScrollView>
    );

}

export default ServiceFee_Detail;