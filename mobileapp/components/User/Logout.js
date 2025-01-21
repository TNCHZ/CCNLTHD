import { useContext } from "react"
import { MyAccountContext } from "../../configs/MyContext"
import { Button, View, Text } from "react-native";
import Styles from "../../styles/Styles";

const Logout = ({navigation}) => {
    const [user, dispatch] = useContext(MyAccountContext);

    const logout = () => {
        dispatch({
            "type":"logout"
        })
        console.info("Đăng xuất");
    }
    
    return(
        <View style={Styles.container}>
            <Text style={Styles.title}> Bạn có chắc muốn ĐĂNG XUẤT ?</Text>
            <Button title="Đăng xuất" onPress={logout}/> 
        </View>
    )
}

export default Logout;