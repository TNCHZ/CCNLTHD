import { Alert, Button, Text, TextInput, View } from "react-native";
import Styles from "../../styles/Styles";
import { useContext, useState } from "react";
import { MyAccountContext } from "../../configs/MyContext";
import axios from "axios";
import APIs, { client_id, client_secret, endpoints } from "../../configs/APIs";

const ChangePassword = () => {
    const accountState = useContext(MyAccountContext);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);

    const changePassword = async (userId, oldPassword, newPassword) => {
        try {
            const response = await axios.post(APIs.get(endpoints['update-avatar-password']), {
                // client_id: client_id,
                // client_secret: client_secret,
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
            console.error("Lỗi đổi mật khẩu:", error.response?.data || error.message);
            return null;
        }
    };

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

    return (
        <View style={Styles.container}>
            <Text style={Styles.title}>Thay đổi mật khẩu</Text>
            <Text style={Styles.subtitle}>Nhập mật khẩu cũ:</Text>
            <TextInput style={Styles.input} secureTextEntry value={oldPassword}
                placeholder="Nhập mật khẩu hiện tại" onChangeText={setOldPassword}
            />
            
            <Text style={Styles.subtitle}>Nhập mật khẩu mới:</Text>
            <TextInput style={Styles.input} secureTextEntry value={newPassword}
                placeholder="Nhập mật khẩu mới" onChangeText={setNewPassword}
            />

            <Text style={Styles.subtitle}>Nhập lại mật khẩu mới:</Text>
            <TextInput style={Styles.input} secureTextEntry value={confirm}
                placeholder="Nhập lại mật khẩu mới" onChangeText={setConfirm}
            />

            <Button style={Styles.button} title="Đổi mật khẩu" onPress={handleChangePassword} />
        </View>
    );
}

export default ChangePassword;