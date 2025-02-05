import React, { useContext, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image, Button, Alert } from "react-native";
import { MyAccountContext } from "../../configs/MyContext";
import APIs, { authApis, endpoints } from "../../configs/APIs";
import Styles from "../../styles/Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";


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
            console.log("url", url);
            let res = await APIs.get(url);
            console.log("res: ", res.data);
            setResidentInfo(res.data);

        } catch (error) {
            console.error("Lỗi lấy dữ liệu cư dân:", error);
            Alert.alert("Lỗi", "Không thể tải thông tin cư dân");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadResidentInfo();
    }, [accountState]);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

    return (
        <View style={Styles.containerNoCenter}>
            {residentInfo ? (
                <>
                    <Text style={Styles.title}>Thông tin cá nhân</Text>
                    {residentInfo.userdetail.avatar ? (
                        <Image source={{ uri: extractImageUrl(residentInfo.userdetail.avatar) }} style={Styles.imageAvatar} />
                    ) : (
                        <Text style={Styles.text}>Không có ảnh đại diện</Text>
                    )}
                    <Text style={Styles.txt}>Giới tính: {residentInfo.gender ? "Nam" : "Nữ"}</Text>
                    <Text style={Styles.txt}>Ngày sinh: {residentInfo.day_of_birth}</Text>
                    <Text style={Styles.txt}>Số điện thoại: {residentInfo.phone}</Text>
                    <Text style={Styles.txt}>CCCD: {residentInfo.citizen_identification}</Text>
                    <Text style={Styles.txt}>Địa chỉ: {residentInfo.address.name}</Text>

                    {/* Nút đổi mật khẩu */}
                    <Button title="Cập nhật mật khẩu và ảnh đại diện" onPress={() => navigation.navigate("updateInfo")} />
                </>
            ) : (
                <Text>Không có thông tin cư dân</Text>
            )}
        </View>
    );
};

export default Profile;
