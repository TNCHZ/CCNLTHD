import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import Styles from "../../styles/Styles";
import { ShowDatePicker } from "../../configs/ShowDatePicker";
import { Picker } from '@react-native-picker/picker';

const Checkin = () => {
    const [dateIn, setDateIn] = useState(new Date());
    const [dateOut, setDateOut] = useState(new Date());

    return (
        <View style={Styles.container}>
            <Text style={Styles.title}>ĐĂNG KÝ TÀI KHOẢN</Text>

            <TextInput style={Styles.input} placeholder="Họ và Tên"/>

            <Picker
                style={Styles.input}>
                <Picker.Item label="Nam" value={true}/>
                <Picker.Item label="Nữ" value={false}/>
            </Picker>

            <TextInput style={Styles.input} placeholder="CCCD/CMND"/>

            <View style={Styles.row}>
                <Text style={Styles.subtitle}>Ngày vào:</Text>
                <TouchableOpacity style={{ width: "60%", backgroundColor: "#ffffff", padding: 10, borderWidth: 1, marginBottom: 10 }}
                    onPress={() => ShowDatePicker(dateIn, setDateIn)}>
                    <Text style={{ justifyContent: "center" }}>{dateIn.toLocaleDateString("vi-VN")}</Text>
                </TouchableOpacity>
            </View>

            <View style={Styles.row}>
                <Text style={Styles.subtitle}>Ngày ra:</Text>
                <TouchableOpacity style={{ width: "60%", backgroundColor: "#ffffff", padding: 10, borderWidth: 1, marginBottom: 10 }}
                    onPress={() => ShowDatePicker(dateOut, setDateOut)}>
                    <Text style={{ justifyContent: "center" }}>{dateOut.toLocaleDateString("vi-VN")}</Text>
                </TouchableOpacity>
            </View>
            
            <Button style={Styles.button} title="Đăng Ký"/>
        </View>
    );
};

export default Checkin;