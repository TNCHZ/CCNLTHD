import { Button, TouchableOpacity, Text, TextInput, View } from "react-native";
import Styles from "../../styles/Styles";
import React, { useState } from "react";
import { ShowDatePicker } from "../../configs/ShowDatePicker";

const RegisterParking = () => {
    const [date, setDate] = useState(new Date());

    return (
        <View style={Styles.container}>
            <View style={Styles.row}>
                <Text style={Styles.subtitle}>Biển số xe:</Text>
                <TextInput style={Styles.input} placeholder="Vui lòng nhập biển số của bạn: 00-XX 000.00"/>
            </View>

            <View style={Styles.row}>
                <Text style={Styles.subtitle}>Ngày đăng ký:</Text>
                <TouchableOpacity style={{ width: "50%", backgroundColor: "#ffffff" , padding: 10, borderWidth: 1, marginBottom: 10 }} onPress={() => ShowDatePicker(date, setDate)}>
                    <Text style={{justifyContent:"center"}}>{date.toLocaleDateString("vi-VN")}</Text>
                </TouchableOpacity>
            </View>
            <Button title="Đăng ký" />
        </View>
    );
}
export default RegisterParking;