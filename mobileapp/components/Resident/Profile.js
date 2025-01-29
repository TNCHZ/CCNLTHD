import React, { useContext, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image, Button, Alert } from "react-native";
import { MyAccountContext } from "../../configs/MyContext";
import APIs, { authApis, endpoints } from "../../configs/APIs";
import Styles from "../../components/Home/HomeStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = ({ navigation }) => { // Thêm navigation vào props
    const [accountState] = useContext(MyAccountContext);
    const [residentInfo, setResidentInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResidentInfo = async () => {
            if (!accountState?.id) {
                Alert.alert("Lỗi", "Không tìm thấy ID người dùng");
                setLoading(false);
                return;
            }

            try {
                const token = await AsyncStorage.getItem("token");
                if (!token) throw new Error("Không tìm thấy token");
                
                const res = await authApis(token).get(`${endpoints["resident-information"]}${accountState.id}/`);
                setResidentInfo(res.data);
            } catch (error) {
                console.error("Lỗi lấy dữ liệu cư dân:", error);
                Alert.alert("Lỗi", "Không thể tải thông tin cư dân");
            } finally {
                setLoading(false);
            }
        };

        fetchResidentInfo();
    }, [accountState]);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

    return (
        <View style={Styles.container}>
            {residentInfo ? (
                <>
                    <Text>Thông tin cá nhân</Text>
                    {residentInfo.avatar ? (
                        <Image source={{ uri: residentInfo.avatar }} style={Styles.avatar} />
                    ) : (
                        <Text>Không có ảnh đại diện</Text>
                    )}
                    <Text>Giới tính: {residentInfo.gender ? "Nam" : "Nữ"}</Text>
                    <Text>Ngày sinh: {residentInfo.day_of_birth}</Text>
                    <Text>Số điện thoại: {residentInfo.phone}</Text>
                    <Text>CCCD: {residentInfo.citizen_identification}</Text>
                    <Text>Địa chỉ: {residentInfo.address.name}</Text>

                    {/* Nút đổi mật khẩu */}
                    <Button title="Đổi mật khẩu" onPress={() => navigation.navigate("ChangePassword")} />
                </>
            ) : (
                <Text>Không có thông tin cư dân</Text>
            )}
        </View>
    );
};

export default Profile;
