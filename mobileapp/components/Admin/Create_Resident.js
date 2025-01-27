import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Styles from '../../styles/Styles';

const Create_Resident = () => {
    const [date, setDate] = useState(new Date());
    const [form, setForm] = useState({
        'fullName': '',
        'gender': true,
        'dayOfBirth': date,
        'address': '',
        'phone': '',
        'citizenId': '',
        'password': '1',
        'changePasswordImage': false,
    });

    const showDatePicker = () => {
        DateTimePickerAndroid.open({
            value: date,
            mode: 'date',
            is24Hour: true,
            onChange: (event, selectedDate) => {
                if (selectedDate) {
                    update('dayOfBirth', selectedDate);
                    setDate(selectedDate); // Cập nhật ngày khi người dùng chọn
                }
            },
        });
    };

    const update = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const submit = () => {
        const { fullName, address, phone, citizenId } = form;

        if (!fullName || !address || !phone || !citizenId) {
            Alert.alert('Cảnh Báo', 'Vui lòng điền đầy đủ thông tin !');
            return;
        }
        // Chỗ xử lý
        Alert.alert('Đăng ký thành công', 'Tài khoản đã được lưu !');
    };

    return (
        <ScrollView style={{flex: 1, padding: 20, backgroundColor: '#f8f9fa',}}>
        <Text style={Styles.title}>ĐĂNG KÝ TÀI KHOẢN</Text>

        <TextInput style={Styles.input} placeholder="Họ và Tên"
            value={form.fullName}  onChangeText={(value) => update('fullName', value)} />

        <Picker selectedValue={form.gender}
            style={Styles.input} onValueChange={(value) => update('gender', value)} >
            <Picker.Item label="Nam" value={true}/>
            <Picker.Item label="Nữ" value={false}/>
        </Picker>

        <View style={Styles.row}>
            <Text style={Styles.subtitle}>Ngày sinh:</Text>
            <TouchableOpacity style={{ width: "60%", backgroundColor: "#ffffff" , padding: 10, borderWidth: 1, marginBottom: 10 }} onPress={showDatePicker}>
                <Text style={{justifyContent:"center"}}>{date.toLocaleDateString("vi-VN")}</Text>
                <Text>{form.dayOfBirth.toDateString()}</Text>
            </TouchableOpacity>
        </View>

        <TextInput style={[Styles.input, {backgroundColor: "#ff0000"}]} placeholder="Số Căn Hộ"
            value={form.address} onChangeText={(value) => update('address', value)}/>

        <TextInput style={Styles.input} placeholder="Số điện thoại"
            keyboardType="numeric" value={form.phone} onChangeText={(value) => update('phone', value)} />

        <TextInput style={Styles.input} placeholder="CCCD/CMND"
            value={form.citizenId} onChangeText={(value) => update('citizenId', value)} />

        <Button style={Styles.button} title="Đăng Ký" onPress={submit} />
        </ScrollView>
    );

};

export default Create_Resident;