import { Alert, Button, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Styles from "../../styles/Styles";
import { useContext, useEffect, useState } from "react";
import { MyAccountContext } from "../../configs/MyContext";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import APIs, { client_id, client_secret, endpoints } from "../../configs/APIs";

const UpdateInfo = () => {
    const accountState = useContext(MyAccountContext);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);

    
//axios.patch(url, data, config) 
// url: Địa chỉ API endpoint.
// data: Dữ liệu muốn cập nhật (chỉ cần gửi các trường thay đổi).
// config (tùy chọn): Headers, token xác thực, v.v.

//Có biến avatar và newPassword cần xử lý, gửi lên server theo patch
    const changePassword = async (userId, oldPassword, newPassword) => {
        try {
            const response = await axios.patch(APIs.get(endpoints['update-avatar-password']), {
                user_id: userId,
                old_password: oldPassword,
                new_password: newPassword
            }, {
                headers: {
                'Content-Type': 'application/json' // Định dạng gửi dữ liệu là JSON
                }
            });
            console.log(response.data.message);
            return response.data;
        } catch (error) {
            console.error("Lỗi:", error.response?.data || error.message);
            return null;
        }
    };

    const changeAvatar = async () => {

    };

    const changeAll = async () => {

    };


//================================================================================================
    const handleChangePassword = async () => {
        try {
            setLoading(true)
            if (!oldPassword || !newPassword || !confirm) {
                Alert.alert("Lỗi", "Vui lòng nhập đủ thông tin");
                return;
            }
            if (oldPassword != accountState[0].password) {
                Alert.alert("Mật khẩu cũ không chính xác !", "Vui lòng kiểm tra lại mật khẩu cũ !");
                return;
            }
            if (newPassword != confirm) {
                Alert.alert("Xác nhận mật khẩu mới không thành công !", "Vui lòng nhập lại đúng mật khẩu mới !!");
                return;
            }
            const response = await changePassword(accountState.id, oldPassword, newPassword);
    
            if (response) {
                Alert.alert("Thành công !", "Mật khẩu đã được thay đổi");
            } else {
                Alert.alert("Thất bại !", "Có lỗi xảy ra tại response");
            }
        } catch (error) {
            console.error("Lỗi", error)
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        // Yêu cầu quyền truy cập thư viện ảnh
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (status !== 'granted') {
          Alert.alert('Quyền bị từ chối', 'Bạn cần cấp quyền truy cập vào thư viện ảnh.');
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) {
              setAvatar(result.assets[0]);
              console.log("avatar", avatar);  // Lưu ảnh được chọn vào trạng thái
            } else {
              console.log('Bộ chọn hình ảnh đã bị hủy');
            }
        }
    };

    return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView>
            <TouchableOpacity style={{alignItems:"center"}} onPress={pickImage}>
                <Text style={Styles.title}>Chọn ảnh đại diện</Text>
                {/* Hiển thị ảnh đại diện nếu đã chọn */}
                {avatar ? ( 
                    <Image source={{ uri: avatar.uri }} style={Styles.imageAvatar} />
                ) : ( 
                    <Text style={Styles.text}>Chưa có ảnh đại diện</Text>
                )}
            </TouchableOpacity>
            
            <View>
                <Text style={Styles.title}>Thay đổi mật khẩu</Text>
                <Text style={[Styles.subtitle, {textAlign: "left"}]}>Nhập mật khẩu cũ:</Text>
                <TextInput style={Styles.input} secureTextEntry={true} value={oldPassword}
                    placeholder="Nhập mật khẩu hiện tại" onChangeText={setOldPassword}
                />
                
                <Text style={[Styles.subtitle, {textAlign: "left"}]}>Nhập mật khẩu mới:</Text>
                <TextInput style={Styles.input} secureTextEntry={true} value={newPassword}
                    placeholder="Nhập mật khẩu mới" onChangeText={setNewPassword}
                />

                <Text style={[Styles.subtitle, {textAlign: "left"}]}>Nhập lại mật khẩu mới:</Text>
                <TextInput style={Styles.input} secureTextEntry={true} value={confirm}
                    placeholder="Nhập lại mật khẩu mới" onChangeText={setConfirm}
                />
            </View>

            <View>
                <View style={Styles.row}>
                    <Button style={[Styles.button, {with: "50%"}]} title="Đổi mật khẩu" onPress={handleChangePassword} />
                    <Button style={[Styles.button, {with: "50%"}]} title="Đổi avatar" onPress={changeAvatar} />
                </View>
                <Button style={Styles.button} title="Cập nhật avatar và mật khẩu" onPress={changeAll} />
            </View>
        </ScrollView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    );
}

export default UpdateInfo;