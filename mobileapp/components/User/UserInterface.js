import { View, Text, Button, TouchableOpacity } from "react-native";
import UserInterfaceStyle from "./UserInterfaceStyle";
import Styles from "../../styles/Styles";

const UserInterface = ({navigation}) => {
    const roomNumber = "0000";
    const locker = "Không có đồ";
    return (
        <View style={UserInterfaceStyle.container}>
            <Text style={UserInterfaceStyle.title}>Số Căn Hộ: A-{roomNumber} </Text>
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
                    <Text style={UserInterfaceStyle.text}>Tất Cả Chi Phí</Text> 
                </TouchableOpacity>
            </View>

            <Text style={UserInterfaceStyle.subtitle}>QUẢN LÝ TỦ ĐỒ CÁ NHÂN</Text>
            <View style={Styles.row}>
                <Text style={UserInterfaceStyle.subtitle}>Mã tủ đồ: T-{roomNumber}</Text>
                <Text style={UserInterfaceStyle.textView}>{locker}</Text>
            </View>

            <Text style={UserInterfaceStyle.subtitle}>ĐĂNG KÝ DỊCH VỤ</Text>
            <View style={Styles.row}>
                <Button title="Thẻ gửi xe"/>
                <Button title="Checkin/Checkout"/>
            </View>
        </View>
    )
}
export default UserInterface;