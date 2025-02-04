import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import Styles from "../../styles/Styles";
import { useContext, useEffect, useState } from "react";
import { MyAccountContext } from "../../configs/MyContext";
import APIs, { endpoints } from "../../configs/APIs";

const Locker = () => {
    const [accountState] = useContext(MyAccountContext);
    const [loading, setLoading] = useState(false);
    const [locker, setLocker] = useState(null);

    // Hàm lấy dữ liệu tủ đồ
    const loadLocker = async () => {
        try {
            setLoading(true);
            let res = await APIs.get(endpoints["locker-resident"](accountState));
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
                    {/* Hiển thị mã tủ */}
                    <Text style={[Styles.subtitle, { textAlign: "left" }]}>
                        Tủ đồ: {locker.name}
                    </Text>

                    {/* Danh sách vật phẩm */}
                    <ScrollView style={{ marginTop: 10, borderColor: "#ccc", borderWidth: 1, borderRadius: 8, padding: 10 }}>
                        {locker.items_in_locker.length > 0 ? (
                            locker.items_in_locker.map((item) => (
                                <View key={item.id} style={{ marginBottom: 10, padding: 10, backgroundColor: "#f0f0f0", borderRadius: 5 }}>
                                    <Text style={Styles.textBold}>{item.name}</Text>
                                    <Text>Trạng thái: {item.status ? "Đã lấy" : "Chưa lấy"}</Text>
                                    <Text>Ngày thêm: {new Date(item.created_date).toLocaleDateString()}</Text>
                                </View>
                            ))
                        ) : (
                            <Text>Không có vật phẩm nào trong tủ.</Text>
                        )}
                    </ScrollView>
                </View>
            ) : (
                <Text>Không có dữ liệu tủ đồ.</Text>
            )}
        </View>
    );
};

export default Locker;
