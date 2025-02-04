import { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import Styles from "../../styles/Styles";
import APIs, { authApis, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Delete_Resident = () => {
    const [users, setUsers] = useState([]);  // Lưu danh sách user
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState(""); // Lọc theo tài khoản
    const [searchAddress, setSearchAddress] = useState(""); // Lọc theo căn hộ

    const fetchUsers = async () => {
        setLoading(true);
        let allUsers = [];
        let nextUrl = endpoints["list-user"];

        try {
            while (nextUrl) {
                const token = await AsyncStorage.getItem("token");
                const response = await authApis(token).get(nextUrl);
                allUsers = [...allUsers, ...response.data.results];
                nextUrl = response.data.next;
            }
            setUsers(allUsers);
        } catch (error) {
            console.error("Lỗi khi tải danh sách user:", error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Hàm để hiển thị hộp thoại xác nhận
    const confirmDisableUser = (userId) => {
        Alert.alert(
            "Dừng hoạt động tài khoản",
            "Bạn có chắc chắn muốn dừng hoạt động tài khoản này?",
            [
                { text: "Hủy", style: "cancel" },
                { text: "Xác nhận", onPress: () => disableUser(userId) }
            ]
        );
    };

    const disableUser = async (userId) => {
        try {
            const token = await AsyncStorage.getItem("token");
            const url = `${endpoints['list-user']}${userId}/`;  // Giả định API hỗ trợ PATCH
    
            const data = {
                is_active: false,  
                address: null     
            };
    
            // Gửi PATCH request
            const response = await authApis(token).patch(url, data, {
                headers: { "Content-Type": "application/json" }
            });
    
            console.log("Cập nhật thành công:", response.data);
            Alert.alert("Thành công", "Tài khoản đã bị vô hiệu hóa!");    
            
            // Cập nhật UI sau khi thành công
            setUsers(users.map(user => 
                user.user === userId ? { ...user, is_active: false, address: null } : user
            ));
    
        } catch (error) {
            console.error("Lỗi khi dừng hoạt động tài khoản:", error);
            Alert.alert("Lỗi", "Không thể dừng hoạt động tài khoản.");
        }
    };
    

    // Lọc danh sách theo tài khoản hoặc căn hộ
    const filteredUsers = users.filter(user => 
        (user.userdetail?.first_name + " " + user.userdetail?.last_name || "").toLowerCase().includes(searchText.toLowerCase()) &&
        (user.address?.name || "").toLowerCase().includes(searchAddress.toLowerCase())
    );

    return (
        <View style={Styles.container}>
            <Text style={Styles.title}>Danh Sách Người Dùng & Căn Hộ</Text>

            {/* Ô tìm kiếm theo tài khoản */}
            <TextInput
                style={Styles.input}
                placeholder="Tìm theo tên tài khoản"
                value={searchText}
                onChangeText={setSearchText}
            />

            {/* Ô tìm kiếm theo căn hộ */}
            <TextInput
                style={Styles.input}
                placeholder="Tìm theo căn hộ"
                value={searchAddress}
                onChangeText={setSearchAddress}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={filteredUsers}
                    keyExtractor={(item) => item.user.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={Styles.userRow}
                            onPress={() => confirmDisableUser(item.user)}
                        >
                            <Text style={Styles.userText}>
                                {item.userdetail?.first_name + " " + item.userdetail?.last_name || "Không có"}
                            </Text>
                            <Text style={Styles.addressText}>
                                {item.address?.name || "Chưa có địa chỉ"}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

export default Delete_Resident;
