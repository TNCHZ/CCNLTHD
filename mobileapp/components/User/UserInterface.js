import { View, Text, Button, TouchableOpacity } from "react-native";
import UserInterfaceStyle from "./UserInterfaceStyle";

const UserInterface = ({navigation}) => {
    const roomNumber = "000";

    return (
        <View style={UserInterfaceStyle.container}>
            <Text style={UserInterfaceStyle.title}>Số Phòng: {roomNumber} </Text>
            <Text style={UserInterfaceStyle.subtitle}>DANH SÁCH CHI PHÍ</Text>
            <View style={UserInterfaceStyle.list}>
                <TouchableOpacity style={UserInterfaceStyle.touchable} onPress={() => navigation.navigate("managingFees")}>
                    <Text style={UserInterfaceStyle.text}>Phí Quản Lí</Text>
                </TouchableOpacity>
                <TouchableOpacity style={UserInterfaceStyle.touchable} onPress={() => navigation.navigate("parkingFees")}>
                    <Text style={UserInterfaceStyle.text}>Phí Đỗ Xe</Text> 
                </TouchableOpacity>
                <TouchableOpacity style={UserInterfaceStyle.touchable} onPress={() => navigation.navigate("serviceFees")}>
                    <Text style={UserInterfaceStyle.text}>Phí Dịch Vụ</Text> 
                </TouchableOpacity>
                <TouchableOpacity style={UserInterfaceStyle.touchable} onPress={() => navigation.navigate("fee")}>
                    <Text style={UserInterfaceStyle.text}>Tất cả chi phí</Text> 
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default UserInterface;