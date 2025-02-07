import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image, Button, Alert, TouchableOpacity } from "react-native";
import { MyAccountContext } from "../../configs/MyContext";
import APIs, { authApis, endpoints } from "../../configs/APIs";
import Styles from "../../styles/Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";


const Profile = ({ navigation }) => { // Thêm navigation vào props
    const [accountState] = useContext(MyAccountContext);
    const [residentInfo, setResidentInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const extractImageUrl = (avatarUrl) => {
        if (!avatarUrl) return null;
        
        // Kiểm tra nếu avatarUrl đã là URL hợp lệ
        if (avatarUrl.startsWith("https://")) return avatarUrl;
        
        // Nếu avatarUrl chứa "image/upload/", loại bỏ phần này
        const prefix = "image/upload/";
        const index = avatarUrl.indexOf(prefix);
        return index !== -1 ? avatarUrl.substring(index + prefix.length) : avatarUrl;
    };
    

    const loadResidentInfo = async () => {
        if (!accountState?.id) {
            Alert.alert("Lỗi", "Không tìm thấy ID người dùng");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            let url = `${endpoints['resident-information'](accountState)}`
            const token = await AsyncStorage.getItem("token");
            let res = await authApis(token).get(url);
            setResidentInfo(res.data);

        } catch (error) {
            console.error("Lỗi lấy dữ liệu cư dân:", error);
            Alert.alert("Lỗi", "Không thể tải thông tin cư dân");
        } finally {
            setLoading(false);
        }
    }
    useFocusEffect(
        useCallback(() => {
            loadResidentInfo();
        }, [accountState])
    );

    useEffect(() => {
        loadResidentInfo();
    }, [accountState]);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

    return (
        <View style={Styles.containerNoCenter}>
            {residentInfo ? (
                <>
                    <Text style={Styles.title}>Thông tin cá nhân</Text>
                    <View style={Styles.container}>
                        {residentInfo.userdetail.avatar ? (
                            <Image source={{ uri: extractImageUrl(residentInfo.userdetail.avatar) }} style={[Styles.imageAvatar, {justifyContent: "center"}]} />
                        ) : (
                            <Text style={Styles.text}>Không có ảnh đại diện</Text>
                        )}
                    </View>
                    <View style={{borderColor: "#ccc", borderWidth: 1, padding: 10}}>
                        <Text style={[Styles.title, {textAlign:"left"}]}>Họ và tên: {residentInfo.userdetail.first_name} {residentInfo.userdetail.last_name}</Text>
                        <Text style={[Styles.title, {textAlign:"left"}]}>Giới tính: {residentInfo.gender ? "Nam" : "Nữ"}</Text>
                        <Text style={[Styles.title, {textAlign:"left"}]}>Ngày sinh: {residentInfo.day_of_birth}</Text>
                        <Text style={[Styles.title, {textAlign:"left"}]}>Số điện thoại: {residentInfo.phone}</Text>
                        <Text style={[Styles.title, {textAlign:"left"}]}>CCCD: {residentInfo.citizen_identification}</Text>
                        <Text style={[Styles.title, {textAlign:"left"}]}>Mã căn hộ: {residentInfo.address.name}</Text>
                    </View>
                    {/* Nút đổi mật khẩu */}
                    <View style={Styles.container}>
                        <TouchableOpacity style={[Styles.button, {width:"90%"}]} onPress={() => navigation.navigate("updateInfo")}>
                            <Text style={Styles.buttonText}>Cập nhật mật khẩu và ảnh đại diện</Text>
                        </TouchableOpacity>
                    </View>
                    
                </>
            ) : (
                <Text>Không có thông tin cư dân</Text>
            )}
        </View>
    );
};

export default Profile;
