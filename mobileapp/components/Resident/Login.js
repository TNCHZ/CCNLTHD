import { useContext, useState } from "react";
import MyContext, { MyAccountContext } from "../../configs/MyContext"
import APIs, { endpoints } from "../../configs/APIs"
import Styles from"../../styles/Styles"
import { TextInput, TouchableOpacity, View, Text, ActivityIndicator, Alert } from "react-native";
import { AsyncStorage } from "react-native";

const Login = ({navigation}) => {
    const [account, setAccount] = useState({
        "username": "",
        "password": ""
    });
    const [loading, setLoading] = useState(false);
    const accounts = { //Mảng account
        "username": {
            "title": "Tên đăng nhập",
            "field": "username",
            "secure": false,
            "icon": "text"
        },  "password": {
            "title": "Mật khẩu",
            "field": "password",
            "secure": true,
            "icon": "eye"
        }
    }

    const [accountState, dispatch] = useContext(MyAccountContext);

    // Cập nhật lại state account với giá trị mới
    const updateAccount = (value, field) => {
        setAccount({...account, [field]: value });
    }

    const login = async () => {
        try {
            setLoading(true);

            console.log("Account trước khi đăng nhập:", account);
            // Kiểm tra nếu thông tin tài khoản chưa đầy đủ
            if (!account.username || !account.password) {
                console.error("Account không hợp lệ:", account);
                return;
            }
            // In ra endpoint để kiểm tra
            console.log("Endpoint login:", endpoints['login']);
            
            // Gửi yêu cầu đăng nhập
            const res = await APIs.post(endpoints['login'], {
                'client_id': "7mxk1Nj7dhNt7a4ylmiHFRWnwIYlyh5jahcqbEjKn",
                'client_secret': "pbkdf2_sha256$870000$Nmvk3Nrf121JViCHczos1d$hNaMJlJNlcEvRMfZXK3TAAYwXAEM6utGo49NsO6r34A=",
                "grant_type": "password", //<-Đang lỗi
                ...account
            });
            if (res?.data?.access_token) {
                console.info("Token:", res.data.access_token);
                await AsyncStorage.setItem('token', res.data.access_token);
    
                // Lấy thông tin người dùng sau khi đăng nhập thành công
                const token = await AsyncStorage.getItem("token");
    
                if (!token) {
                    console.error("Không tìm thấy token!");
                    return;
                }
    
                account = await authApis(token).get(endpoints['current-user']);
                // Gửi hành động đăng nhập với dữ liệu người dùng
                dispatch({
                    "type": "login", 
                    "payload": {
                        "username": account.username,
                        "password": account.password
                    }
                });
    
                // Điều hướng đến trang chủ sau khi đăng nhập thành công
                navigation.navigate("home");
            } else {
                console.error("Lỗi từ API: Không có token trả về");
                Alert.alert("Lỗi", "Đăng nhập không thành công.");
            }
        } catch(ex) {
            console.error("Lỗi đăng nhập:", ex);
            // Ghi lại lỗi chi tiết
            if (ex.response) {
                console.error("Lỗi response:", ex.response.status, ex.response.data);
            } else if (ex.request) {
                console.error("Không nhận được phản hồi:", ex.request);
            } else {
                console.error("Thông báo lỗi:", ex.message);
            }
            Alert.alert("Lỗi", "Đã xảy ra lỗi trong quá trình đăng nhập.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={Styles.container}>
            <Text style={Styles.title}>Đăng nhập</Text>
            <TextInput style={Styles.input} value={account.username} onChangeText={(t) => updateAccount(t, "username")} placeholder="Tên đăng nhập"/>
            <TextInput style={Styles.input} value={account.password} secureTextEntry={true} onChangeText={(p) => updateAccount(p, "password")} placeholder="Nhập mật khẩu"/>
            <TouchableOpacity onPress={login} style={Styles.button} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={Styles.buttonText}>Đăng Nhập</Text>
                )}
            </TouchableOpacity>
        </View>
    )
}

export default Login;