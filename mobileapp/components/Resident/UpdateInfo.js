import { Alert, Button, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Styles from "../../styles/Styles";
import { useContext, useState } from "react";
import { MyAccountContext } from "../../configs/MyContext";
import * as ImagePicker from 'expo-image-picker';
import APIs, { authApis, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UpdateInfo = ({ navigation }) => {
    const [accountState] = useContext(MyAccountContext);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);

    const changePassword = async () => {
        try {
            setLoading(true);
            if (!oldPassword || !newPassword || !confirm) {
                Alert.alert("Lỗi", "Vui lòng nhập đủ thông tin mật khẩu");
                return;
            }
            if (newPassword !== confirm) {
                Alert.alert("Lỗi", "Xác nhận mật khẩu mới không trùng khớp!");
                return;
            }

            const token = await AsyncStorage.getItem("token");
            const url = endpoints['update-avatar-password'];

            await authApis(token).patch(url, { password: newPassword }, {
                headers: { 'Content-Type': 'application/json' }
            });

            Alert.alert("Thành công!", "Mật khẩu đã được thay đổi");
            setOldPassword("");
            setNewPassword("");
            setConfirm("");
        } catch (error) {
            console.error("Lỗi:", error.response?.data || error.message);
            Alert.alert("Lỗi", "Không thể cập nhật mật khẩu!");
        } finally {
            setLoading(false);
        }
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

    const changeAvatar = async () => {
        if (!avatar) {
            Alert.alert("Lỗi", "Vui lòng chọn ảnh trước khi cập nhật.");
            return;
        }

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            const url = endpoints['update-avatar-password'];

            await authApis(token).patch(url, { avatar: avatar }, { 
                headers: { 'Content-Type': 'application/json' } 
            });

            Alert.alert("Thành công!", "Ảnh đại diện đã được cập nhật.");
            navigation.navigate("home");
        } catch (error) {
            console.error("Lỗi:", error.response?.data || error.message);
            Alert.alert("Lỗi", "Không thể cập nhật ảnh đại diện!");
        } finally {
            setLoading(false);
        }
    };

    const changeAll = async () => {
        if (!avatar) {
            Alert.alert("Lỗi", "Bạn cần chọn ảnh trước khi cập nhật.");
            return;
        }
        if (!newPassword || !confirm) {
            Alert.alert("Lỗi", "Bạn cần nhập đầy đủ mật khẩu.");
            return;
        }

        await changePassword();
        await changeAvatar();

        try {
            const token = await AsyncStorage.getItem("token");
            const url = endpoints['update-avatar-password'];

            await authApis(token).patch(url, { change_password_image: true }, {
                headers: { 'Content-Type': 'application/json' }
            });

            navigation.navigate("home");
        } catch (error) {
            console.error("Lỗi:", error.response?.data || error.message);
            Alert.alert("Lỗi", "Không thể cập nhật thông tin!");
        }
    };

    const pickImage = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
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

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView>
                    <TouchableOpacity style={{ alignItems: "center" }} onPress={pickImage}>
                        <Text style={Styles.title}>Chọn ảnh đại diện</Text>
                        {avatar ? (
                            <Image source={{ uri: avatar }} style={Styles.imageAvatar} />
                        ) : (
                            <Text style={Styles.text}>Chưa có ảnh đại diện</Text>
                        )}
                    </TouchableOpacity>

                    <View>
                        <Text style={Styles.title}>Thay đổi mật khẩu</Text>
                        <Text style={[Styles.subtitle, { textAlign: "left" }]}>Nhập mật khẩu cũ:</Text>
                        <TextInput style={Styles.input} secureTextEntry value={oldPassword}
                            placeholder="Nhập mật khẩu hiện tại" onChangeText={setOldPassword}
                        />

                        <Text style={[Styles.subtitle, { textAlign: "left" }]}>Nhập mật khẩu mới:</Text>
                        <TextInput style={Styles.input} secureTextEntry value={newPassword}
                            placeholder="Nhập mật khẩu mới" onChangeText={setNewPassword}
                        />

                        <Text style={[Styles.subtitle, { textAlign: "left" }]}>Nhập lại mật khẩu mới:</Text>
                        <TextInput style={Styles.input} secureTextEntry value={confirm}
                            placeholder="Nhập lại mật khẩu mới" onChangeText={setConfirm}
                        />
                    </View>

                    <View>
                        <Button style={Styles.button} title="Cập nhật" onPress={changeAll} disabled={loading} />
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default UpdateInfo;
