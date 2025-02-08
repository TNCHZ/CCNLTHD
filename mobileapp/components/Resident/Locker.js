import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import Styles from "../../styles/Styles";
import { useContext, useEffect, useState } from "react";
import { MyAccountContext } from "../../configs/MyContext";
import APIs, { endpoints, authApis } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Locker = () => {
    const [accountState] = useContext(MyAccountContext);
    const [loading, setLoading] = useState(false);
    const [locker, setLocker] = useState(null);

    const loadLocker = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            let res = await authApis(token).get(endpoints["locker-resident"](accountState));
            setLocker(res.data);
        } catch (ex) {
            console.error("Lỗi khi tải tủ đồ: ", ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLocker();
    }, [accountState.id]);

    return (
        <View style={Styles.containerNoCenter}>
            <Text style={Styles.title}>QUẢN LÝ TỦ ĐỒ CÁ NHÂN</Text>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            
            {locker ? (
                <View>
                    <Text style={[Styles.subtitle, { textAlign: "left" }]}>
                        Tủ đồ: {locker.name}
                    </Text>

                    <ScrollView style={Styles.scrollView}>
                        <View style={[Styles.containerNoCenter,{padding:5}]}>
                        {locker.items_in_locker.length > 0 ? (
                            locker.items_in_locker.map((item) => (
                                <View key={item.id} style={{ marginBottom: 10, padding: 10, backgroundColor: "#f0f0f0", borderRadius: 5 }}>
                                    <Text style={[Styles.text,{color:"#000"}]}>{item.name}</Text>
                                    <Text style={[Styles.text,{color:"#000"}]}>Trạng thái: {item.status ? "Đã lấy" : "Chưa lấy"}</Text>
                                    <Text style={[Styles.text,{color:"#000"}]}>Ngày thêm: {new Date(item.created_date).toLocaleDateString()}</Text>
                                </View>
                            ))
                        ) : (
                            <Text>Không có vật phẩm nào trong tủ.</Text>
                        )}
                        </View>
                    </ScrollView>
                </View>
            ) : (
                <Text style={Styles.subtitle}>Không có dữ liệu tủ đồ.</Text>
            )}
        </View>
    );
};

export default Locker;
