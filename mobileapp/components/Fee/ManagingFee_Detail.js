import { useEffect, useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { Text, View, ScrollView } from "react-native";

const ManagingFee_Detail = ({route}) => {
    const managingFeeID= route.parmas?.managingFeeID;
    const [loading, setLoading]= useState(false);
    const [managingFee, setManagingFee] = useState([]);

    const loadManagingFee = async () => {
        try {
            setLoading(true)
            let res = await APIs.get(endpoints['managing-fee'](managingFeeID));
            setManagingFee(res.data);

        } catch (error) {
            console.error("Lỗi: ", error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadManagingFee();
    },[managingFeeID])
    return (
        <ScrollView style={{margin: 10}}>
            <Text>Phí quản lý</Text>
            {loading && <ActivityIndicator />}
            {managingFee && 
                <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{managingFee.name}</Text>
                    
                    <Text>Trạng thái: {managingFee.status ? "Đã thanh toán" : "Chưa thanh toán"}</Text>
                </View>
            }
        </ScrollView>
    );

}

export default ManagingFee_Detail;