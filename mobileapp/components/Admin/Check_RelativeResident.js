import { View, Text, TouchableOpacity, ActivityIndicator, Alert, FlatList, TextInput } from "react-native";
import Styles from "../../styles/Styles";
import { useEffect, useState, useContext } from "react";
import { MyAccountContext } from "../../configs/MyContext";
import APIs, { endpoints, authApis } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";


const RelativeList = () => {
    const [accountState] = useContext(MyAccountContext);
    const [loading, setLoading] = useState(false);
    const [relatives, setRelatives] = useState([]);
    const [filteredRelatives, setFilteredRelatives] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const loadRelatives = async () => {
        let allRelatives = [];
        let nextUrl = endpoints["register-for-relative"];

        setLoading(true);
        try {
            while (nextUrl) {
                const token = await AsyncStorage.getItem("token");
                const response = await authApis(token).get(nextUrl);
                allRelatives = [...allRelatives, ...response.data.results];
                nextUrl = response.data.next; // Cập nhật URL nếu có trang tiếp theo
            }
            setRelatives(allRelatives);
            setFilteredRelatives(allRelatives); // Lưu dữ liệu gốc vào filteredRelatives
        } catch (ex) {
            console.error("Lỗi khi tải danh sách người thân:", ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRelatives();
    }, []);

    // Hàm cập nhật trạng thái "đã đến" của người thân
    const confirmArrival = async (relativeId) => {
        try {
            const token = await AsyncStorage.getItem("token");
            await authApis(token).patch(`${endpoints["register-for-relative"]}${relativeId}/`, {
                is_come: true,
            });

            Alert.alert("Thành công", "Xác nhận người thân đã đến!");
            loadRelatives(); // Tải lại danh sách sau khi cập nhật
        } catch (ex) {
            console.error("Lỗi khi cập nhật trạng thái:", ex);
            Alert.alert("Lỗi", "Không thể xác nhận người thân!");
        }
    };

    // Hàm lọc danh sách người thân theo tên hoặc số điện thoại
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query === '') {
            setFilteredRelatives(relatives); // Nếu không có gì nhập vào, hiển thị toàn bộ danh sách
        } else {
            const lowercasedQuery = query.toLowerCase();
            const filtered = relatives.filter((relative) =>
                relative.name_relative.toLowerCase().includes(lowercasedQuery) ||
                relative.phone_relative.includes(query)
            );
            setFilteredRelatives(filtered);
        }
    };

    return (
        <View style={Styles.container}>
            <Text style={Styles.title}>DANH SÁCH NGƯỜI THÂN</Text>

            <TextInput
                style={Styles.input}
                placeholder="Tìm theo tên hoặc số điện thoại"
                value={searchQuery}
                onChangeText={handleSearch} // Cập nhật query khi người dùng nhập
            />

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={filteredRelatives} // Sử dụng filteredRelatives thay vì relatives
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={Styles.card}>
                            <Text style={Styles.subtitle}>
                                {item.resident_details?.address?.name} - {item.resident_details?.userdetail?.first_name} {item.resident_details?.userdetail?.last_name}
                            </Text>
                            <Text>Tên người thân: {item.name_relative}</Text>
                            <Text>SĐT: {item.phone_relative}</Text>

                            {!item.is_come && (
                                <TouchableOpacity style={Styles.button} onPress={() => confirmArrival(item.id)}>
                                    <Text style={Styles.buttonText}>Xác nhận đã đến</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default RelativeList;
