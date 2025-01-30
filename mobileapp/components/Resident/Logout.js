import { useContext } from "react"
import { MyAccountContext } from "../../configs/MyContext"
import { Button, View, Text, Alert } from "react-native";
import Styles from "../../styles/Styles";

const Logout = ({navigation}) => {
    const [user, dispatch] = useContext(MyAccountContext);

    const logout = () => {
        dispatch({
            "type":"logout"
        })
        console.info("Đăng xuất");
    }

    const confirmLogout = () => {
        Alert.alert(
            "Xác nhận Đăng xuất",
            "Bạn có chắc muốn ĐĂNG XUẤT?",
            [
                { text: "Hủy", style: "cancel" },
                { text: "Đăng xuất", onPress:logout },
            ]
        );
    };
    
    return(
        <View style={[Styles.container,{justifyContent: "center"}]}>
            <Text style={[Styles.title, {fontSize: 20}]}> Bạn có chắc muốn ĐĂNG XUẤT ?</Text>
            <Button title="Đăng xuất" color="#d32f2f" onPress={confirmLogout}/> 
        </View>
    )
}

export default Logout;