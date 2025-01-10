import { useState } from "react";
import { MyDispatchContext } from "../../configs/MyContext"
import APIs, { endpoints } from "../../configs/APIs"
import Style from "./LoginStyle"
import MyStyle from"../../styles/Styles"
import { TextInput, TouchableOpacity, View, Text } from "react-native";

const Login = () => {
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
    const dispatch = useState(MyDispatchContext);
    const updateAccount = (value, field) => {
        setAccount({...account, [field]:value});
    }

    const login = async () => {
        try {
            setLoading(true);
            // const res = await APIs.post(endpoints['login'], {
            //     'username': username,
            //     'password': password,
            //     'client_id': "",
            //     'client_secret': "",
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
            dispatch({"type": "login", 
                "payload": {
                    "username": "admin"
                }
            });
            navigation.navigate("UserInterface");
        } catch(ex){
            console.error(ex); // login thất bại
        } finally{
            setLoading(false);
        }
    }

    return (
        <View style={MyStyle.container}>
            <Text style={MyStyle.text}>Đăng nhập</Text>
            <TextInput value={account.username} onChangeText={t => setAccount(t)} placeholder="Tên đăng nhập" style={Style.input} />
            <TextInput value={account.password} secureTextEntry={true} placeholder="Nhập mật khẩu" style={Style.input} />
            <TouchableOpacity onPress={login}>
                <Text style={Style.button}>Login</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Login;