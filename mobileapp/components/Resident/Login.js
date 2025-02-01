import { useContext, useState } from "react";
import MyContext, { MyAccountContext } from "../../configs/MyContext"
import APIs, { authApis, endpoints, client_id, client_secret } from "../../configs/APIs"
import Styles from"../../styles/Styles"
import { TextInput, TouchableOpacity, View, Text, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({navigation}) => {
    const [account, setAccount] = useState({
        "username": "",
        "password": "",
    });
    const [loading, setLoading] = useState(false);

    const [accountState, dispatch] = useContext(MyAccountContext);

    // Cập nhật lại state account với giá trị mới
    const updateAccount = (value, field) => {
        setAccount({...account, [field]: value });
    }

    const login = async () => {
        try {
            setLoading(true);

            console.log("Account trước khi đăng nhập:", account);
            if (!account.username || !account.password) {
                console.error("Account không hợp lệ:", account);
                return;
            }

            // Gửi yêu cầu đăng nhập
            const res = await APIs.post(endpoints['login'], {
                client_id: client_id,
                client_secret: client_secret,
                grant_type: "password",
                username: account.username,
                password: account.password
            },{
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
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
    
                const userAccount = await authApis(token).get(endpoints["current-user"]);
                console.log("Thông tin người dùng:", userAccount.data);
    
                // Cập nhật lại state account
                setAccount({
                    username: userAccount.data.username,
                    password: account.password,
                });
    
                // Gửi hành động đăng nhập với Redux/Context API
                dispatch({
                    type: "login",
                    payload: {
                        id: userAccount.data.id,
                        avatar: userAccount.data.avatar,
                        first_name: userAccount.data.first_name,
                        last_name: userAccount.data.last_name,
                        role: userAccount.data.role,
                        username: userAccount.data.username,
                        password: account.password,
                    },
                });

                if (userAccount.data.change_password_image) {
                    // Nếu có avatar, điều hướng đến màn hình "home"
                    navigation.navigate("home");
                } else {
                    // Nếu không có avatar, điều hướng đến màn hình "upload"
                    navigation.navigate("updateInfo");
                }                  
            } else {
                console.error("Lỗi từ API: Không có token trả về");
                Alert.alert("Lỗi", "Đăng nhập không thành công.");
            }
        } catch(ex) {
            console.error("Lỗi đăng nhập:", ex);
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