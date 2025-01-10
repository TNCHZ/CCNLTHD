import { useContext } from "react"
import { MyAccountContext } from "../../configs/AccountContexts"
import { Button } from "react-native";
import Login from "./Login";

const Logout = ({navigation}) => {
    const [user, dispatch] = useContext(MyAccountContext);

    const logout = () => {
        dispatch({
            "type":"logout"
        })
    }

    if (user===null) {
        return <Button title="Đăng nhập" onPress={() => { navigation.navigate("Login") }}/>
    }
    return( <Button title="Đăng xuất" onPress={logout}/> )
}

export default Logout;