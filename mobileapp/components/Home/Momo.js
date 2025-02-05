import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, SafeAreaView, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';  // Correct import
import StyleMomo from './StyleMomo';
import Styles from '../../styles/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIs, { endpoints, authApis } from "../../configs/APIs";


const Momo = ({ route, navigation }) => {
    const id = route.params.FeeID;
    const name = route.params.FeeName;
    const money = route.params.FeeValue;
    const feeType = route.params.FeeType;
    const merchantname = "Chung cư tiện ích JpHome";
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState(null);

    const feeEndpoints = {
        "Phí Quản Lí": "create-managing-fee",
        "Phí Đỗ Xe": "create-parking-fee",
        "Phí Dịch Vụ": "create-service-fee"
    };


    const formatNumberToMoney = (number, defaultNum = "0", predicate = "VND") => {
        if (!number || isNaN(number)) return defaultNum + predicate;
        return new Intl.NumberFormat("vi-VN").format(number) + predicate;
    };

    const uploadImageToCloudinary = async (imageUri) => {
        const data = new FormData();
        data.append("file", {
            uri: imageUri,
            type: "image/jpeg",
            name: "avatar.jpg",
        });
        data.append("upload_preset", "ml_default");
        data.append("cloud_name", "dqlk15sot");

        try {
            let response = await fetch("https://api.cloudinary.com/v1_1/dqlk15sot/image/upload", {
                method: "POST",
                body: data,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "multipart/form-data"
                }
            });
            let result = await response.json();
            return result.secure_url;
        } catch (error) {
            console.error("Lỗi upload ảnh lên Cloudinary:", error);
            return null;
        }
    };

    const pickImage = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();  // Request permissions
        if (status !== 'granted') {
            Alert.alert('Quyền bị từ chối', 'Bạn cần cấp quyền truy cập vào thư viện ảnh.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        });

        if (!result.canceled && result.assets?.length > 0) {
            const uploadedImageUrl = await uploadImageToCloudinary(result.assets[0].uri);
            if (uploadedImageUrl) {
                setAvatar(uploadedImageUrl);
            }
        } else {
            console.log('Bộ chọn hình ảnh đã bị hủy');
        }
    };


    const onPress = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            const url = `${endpoints[feeEndpoints[name]]}${id}/`;
            console.log(avatar)

            await authApis(token).patch(url, { fee_image: avatar }, {
                headers: { 'Content-Type': 'application/json' }
            });

            Alert.alert("Thành công!", "Thanh toán thành công.");
            navigation.navigate("home");
        } catch (error) {
            console.error("Lỗi thanh toán MoMo: ", error);
            setContent("Lỗi khi gửi yêu cầu thanh toán.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent', padding: 10 }}>
            <View style={StyleMomo.container}>
                <View style={[{ backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', height: 200 }]}>
                    <Image style={{ flex: 1, width: 200, height: 200 }} source={require('../../stactic/momo.jpg')} />
                </View>
                <Text style={[StyleMomo.text, { color: 'red', fontSize: 20 }]}>CHUNG CƯ TIỆN ÍCH JPHOME</Text>
                <Text style={[StyleMomo.text, { color: 'red', fontSize: 18 }]}>QR momo</Text>
                <Text style={[StyleMomo.text, { color: '#000', fontSize: 14, marginVertical: 5, textAlign: 'left', marginTop: 20 }]}>Người nhận : {merchantname}</Text>
                <Text style={[StyleMomo.text, { color: '#000', fontSize: 14, marginVertical: 5, textAlign: 'left' }]}>Tên Chi phí : {name}</Text>
                <Text style={[StyleMomo.text, { color: '#000', fontSize: 14, marginVertical: 5, textAlign: 'left' }]}>Giá trị : {formatNumberToMoney(money, "0", " VND")}</Text>
                <View style={{ alignItems: 'center' }}>
                    {avatar ? (
                        <Image source={{ uri: avatar }} style={{ borderColor: "#000", borderWidth: 1, width: 200, height: 200, margin: 10 }} />
                    ) : (
                        <Image source={{}} style={{ borderColor: "#000", borderWidth: 1, width: 200, height: 200, margin: 10 }} />
                    )}
                    <TouchableOpacity style={[Styles.input, { width: "60%", justifyContent: "center", alignItems: "center" }]} onPress={pickImage}>
                        <Text style={{ fontWeight: 'bold', }}>Ảnh xác minh thanh toán</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={onPress} style={StyleMomo.button} >
                    <Text style={StyleMomo.text}>Xác nhận thanh toán</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Momo;
