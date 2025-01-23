import { useContext, useState } from "react";
import MyContext, { MyAccountContext } from "../../configs/MyContext"
import APIs, { endpoints } from "../../configs/APIs"
import Styles from"../../styles/Styles"
import { TextInput, TouchableOpacity, View, Text, ActivityIndicator, Alert } from "react-native";

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

    const updateAccount = (value, field) => {
        setAccount({...account, [field]:value});
    }

// const res = await APIs.post(endpoints['login'], {
//     'username': username,
//     'password': password,
//     'client_id': "7mxk1Nj7dhNt7a4ylmiHFRWnwIYlyh5jahcqbEjKn",
//     'client_secret': "pbkdf2_sha256$870000$Nmvk3Nrf121JViCHczos1d$hNaMJlJNlcEvRMfZXK3TAAYwXAEM6utGo49NsO6r34A=",
//     "grant_type": "password"
// });

// console.info(res.data)
// setTimeout(async () => {
//     let account = await authApis(res.data.access_token).get(endpoints['current-user']); // trả ra cục dữ liệu của user
//     console.info(account.data);
//     dispatch({"type": "login", 
//         "payload": account.data
//     });
// }, 500);


    const login = async () => {
        try {
            setLoading(true);
            //note
            console.log("Thông tin tài khoản:", account);

            if (account.username==="admin" && account.password==="123"){
                dispatch({"type": "login", 
                    "payload": {
                        "username": account.username,
                        "password": account.password
                    }
                });
                navigation.navigate("home");
            } else {
                // Thông báo lỗi nếu tài khoản không hợp lệ
                Alert.alert("Đăng nhập thất bại", "Tên đăng nhập hoặc mật khẩu không đúng.");
            }
        } catch(ex){
            console.error("Lỗi đăng nhập:", ex);
            Alert.alert("Lỗi", "Đã xảy ra lỗi trong quá trình đăng nhập.");
        } finally{
            setLoading(false);
        }
    }

    return (
        <View style={Styles.container}>
            <Text style={Styles.title}>Đăng nhập</Text>
            <TextInput style={Styles.input} value={account.username} onChangeText={(t) => setAccount({ ...account, username: t })} placeholder="Tên đăng nhập"/>
            <TextInput style={Styles.input} value={account.password} secureTextEntry={true} onChangeText={(p) => setAccount({ ...account, password: p })} placeholder="Nhập mật khẩu"/>
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