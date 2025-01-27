import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Styles from "../../styles/Styles";

const Delete_Resident = () => {
    return (
            <View style={Styles.container}>
                <Text style={Styles.title}>Tìm Tài Khoản</Text>
                <TextInput style={Styles.input} placeholder="Nhập tên đăng nhập"/>
                <TouchableOpacity style={Styles.button}>
                    <Text style={Styles.buttonText}>Xóa</Text>
                </TouchableOpacity>
            </View>
        )
}
export default Delete_Resident;