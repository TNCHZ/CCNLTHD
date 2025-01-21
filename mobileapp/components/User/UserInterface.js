import { View, Text, Button, TouchableOpacity } from "react-native";
import Styles from "../../styles/Styles";

const UserInterface = ({navigation}) => {
    return (
        <View>
            <TouchableOpacity onPress={() => navigation.navigate("fee")}>
                <Text>Các khoản chi phí cần đóng</Text>
            </TouchableOpacity>
        </View>
    )
}
export default UserInterface;