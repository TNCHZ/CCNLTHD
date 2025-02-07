import { useCallback, useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import Styles from "../../styles/Styles";
import APIs, { authApis, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

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
    const confirmDisableUser = (userId, addressID) => {
        Alert.alert(
            "Dừng hoạt động tài khoản",
            "Bạn có chắc chắn muốn dừng hoạt động tài khoản này?",
            [
                { text: "Hủy", style: "cancel" },
                { text: "Xác nhận", onPress: () => disableUser(userId, addressID) }
            ]
        );
    };



    useFocusEffect(
        useCallback(() => {
            fetchUsers(); 
        }, [])
    );

    const disableUser = async (userId, addressID) => {
        try {
            const token = await AsyncStorage.getItem("token");
            const urlResident = `${endpoints['list-user']}${userId}/`;
            const urlAddress = `${endpoints['address']}${addressID}/`;

            const data = {
                is_free: true,
            };

            // Gửi PATCH request
            const response = await authApis(token).patch(urlAddress, data, {
                headers: { "Content-Type": "application/json" }
            });

            console.log("Cập nhật thành công:", response.data);

            const responsedelete = await authApis(token).delete(urlResident);
            Alert.alert("Thành công", "Tài khoản đã bị vô hiệu hóa!");
            setUsers((prevUsers) => prevUsers.filter(user => user.user !== userId));

            

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
                <FlatList style={{borderColor: "#ccc", borderWidth: 1, borderRadius: 8,}}
                    data={filteredUsers}
                    keyExtractor={(item) => item.user.toString()}
                    renderItem={({ item }) => (
                        <View style={Styles.input}>
                            <TouchableOpacity style={Styles.row} onPress={() => confirmDisableUser(item.user, item.address.id)}>
                                <Text style={[Styles.txt,{width:"25%"}]}>{item.address?.name || "Chưa có địa chỉ"}</Text>
                                <Text style={[Styles.txt,{width:"75%"}]}>
                                    {item.userdetail?.first_name + " " + item.userdetail?.last_name || "Không có"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default Delete_Resident;