import { useContext } from "react"
import { MyAccountContext } from "../../configs/MyContext"
import { Button } from "react-native";

const Logout = ({navigation}) => {
    const [user, dispatch] = useContext(MyAccountContext);

    const logout = () => {
        dispatch({
            "type":"logout"
        })
        console.info("Đăng xuất");
    }

    if (user===null) {
        return <Button title="Đăng nhập" onPress={() => { navigation.navigate("login") }}/>
    }
    return( <Button title="Đăng xuất" onPress={logout}/> )
}

export default Logout;