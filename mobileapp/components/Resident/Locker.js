import { View, Text, Button, TouchableOpacity } from "react-native";
import Styles from "../../styles/Styles";
import LockerStyle from "./LockerStyle";
const Locker = ({navigation}) => {
    const roomNumber = "0000";
    const locker = "Không có đồ";
    return (
        <View style={LockerStyle.container}>
            <Text style={LockerStyle.title}>Số Căn Hộ: A-{roomNumber} </Text>
            <Text style={LockerStyle.subtitle}>QUẢN LÝ TỦ ĐỒ CÁ NHÂN</Text>
            <View style={Styles.row}>
                <Text style={LockerStyle.subtitle}>Mã tủ đồ: T-{roomNumber}</Text>
                <Text style={LockerStyle.textView}>{locker}</Text>
            </View>
        </View>
    )
}
export default Locker;