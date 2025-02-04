import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import Styles from "../../styles/Styles";
import { useState, useContext } from "react";
import { MyAccountContext } from "../../configs/MyContext";
import APIs, { endpoints } from "../../configs/APIs";

const RegisterRelative = ({ navigation }) => {
    const [accountState] = useContext(MyAccountContext);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    // Hàm xử lý đăng ký người thân
    const handleRegister = async () => {
        if (!name || !phone) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        setLoading(true);
        try {
            let res = await APIs.post(endpoints["register-for-relative"], {
                name_relative: name,
                phone_relative: phone,
                resident: accountState.id  // ID của cư dân đang đăng nhập
            });

            Alert.alert("Thành công", "Đăng ký người thân thành công!");
            setName("");
            setPhone("");
            navigation.goBack(); // Quay về màn hình trước đó
        } catch (ex) {
            console.error("Lỗi khi đăng ký người thân:", ex);
            Alert.alert("Lỗi", "Không thể đăng ký người thân!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={Styles.container}>
            <Text style={Styles.title}>ĐĂNG KÝ NGƯỜI THÂN</Text>

            <Text style={Styles.label}>Họ và Tên:</Text>
            <TextInput
                style={Styles.input}
                placeholder="Nhập tên người thân"
                value={name}
                onChangeText={setName}
            />

            <Text style={Styles.label}>Số điện thoại:</Text>
            <TextInput
                style={Styles.input}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <TouchableOpacity style={Styles.button} onPress={handleRegister}>
                    <Text style={Styles.buttonText}>Đăng Ký</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default RegisterRelative;
