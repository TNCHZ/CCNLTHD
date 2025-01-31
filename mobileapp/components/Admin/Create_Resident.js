import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Styles from '../../styles/Styles';
import APIs, { authApis, endpoints } from "../../configs/APIs"
import AsyncStorage from '@react-native-async-storage/async-storage';

const Create_Resident = () => {
    const [date, setDate] = useState(new Date());
    const [addresses, setAddresses] = useState([]); // Danh sách căn hộ từ API

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

    const [form, setForm] = useState({
        fullName: "",
        gender: true,
        dayOfBirth: date,
        address: "", // ID của căn hộ
        phone: "",
        citizenId: "",
        password: "1",
    });

     // Hàm lấy toàn bộ danh sách căn hộ (gọi tất cả trang)
     const fetchAddresses = async () => {
        let allAddresses = [];
        let nextUrl = endpoints["address"]; // URL trang đầu tiên

        try {
            while (nextUrl) {
                const response = await APIs.get(nextUrl);
                allAddresses = [...allAddresses, ...response.data.results]; // Thêm dữ liệu vào danh sách
                nextUrl = response.data.next; // Cập nhật URL trang tiếp theo
            }
            setAddresses(allAddresses); // Lưu toàn bộ danh sách vào state
        } catch (error) {
            console.error("Lỗi khi tải danh sách căn hộ:", error);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const update = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const submit = async () => {
        const { fullName, gender, dayOfBirth, address, phone, citizenId, password } = form;

        if (!fullName || !address || !phone || !citizenId) {
            Alert.alert('Cảnh Báo', 'Vui lòng điền đầy đủ thông tin !');
            return;
        }

        // Tách họ tên thành first_name và last_name
        const nameParts = fullName.trim().split(" ");
        const firstName = nameParts.slice(0, -1).join(" ");
        const lastName = nameParts.slice(-1).join(" ");

        // Tạo payload đúng format JSON backend yêu cầu
        const payload = {
            user: {
                username: phone,  // Giả sử username là số điện thoại
                first_name: firstName,
                last_name: lastName,
                password: password,
                role: "Resident"
            },
            gender: gender,
            day_of_birth: dayOfBirth.toISOString().split("T")[0], // Format YYYY-MM-DD
            address: parseInt(address, 10), // Chuyển thành số nguyên
            phone: phone,
            citizen_identification: citizenId
        };

        try {
            const token = await AsyncStorage.getItem("token");
            const response = await authApis(token).post(endpoints["resident-create"], payload, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 201) {
                Alert.alert("Thành công", "Tài khoản đã được tạo!", [{ text: "OK" }]);
                setForm({
                    fullName: "",
                    gender: true,
                    dayOfBirth: new Date(),
                    address: "",
                    phone: "",
                    citizenId: "",
                    password: "1",
                });
                setDate(new Date()); // Cập nhật lại ngày sinh về mặc định
            } else {
                Alert.alert("Lỗi", response.data.message || "Đăng ký thất bại!");
            }
        } catch (error) {
            console.error("Lỗi khi gửi dữ liệu:", error);
            Alert.alert("Lỗi", error.response?.data?.message || "Không thể kết nối đến server!");
        }
    };


    return (
        <ScrollView style={Styles.containerNoCenter}>
            <Text style={Styles.title}>ĐĂNG KÝ TÀI KHOẢN</Text>

            <TextInput style={Styles.input} placeholder="Họ và Tên"
                value={form.fullName} onChangeText={(value) => update('fullName', value)} />

            <Picker selectedValue={form.gender}
                style={Styles.input} onValueChange={(value) => update('gender', value)} >
                <Picker.Item label="Nam" value={true} />
                <Picker.Item label="Nữ" value={false} />
            </Picker>

            <View style={Styles.row}>
                <Text style={Styles.subtitle}>Ngày sinh:</Text>
                <TouchableOpacity style={{ width: "60%", backgroundColor: "#ffffff", padding: 10, borderWidth: 1, marginBottom: 10 }} onPress={showDatePicker}>
                    <Text style={{ justifyContent: "center" }}>{date.toLocaleDateString("vi-VN")}</Text>
                </TouchableOpacity>
            </View>

            {/* ComboBox để chọn địa chỉ */}
            <Text style={Styles.subtitle}>Số Căn Hộ:</Text>
            <Picker
                selectedValue={form.address}
                style={Styles.input}
                onValueChange={(value) => update("address", value)}
            >
                <Picker.Item label="Chọn căn hộ" value="" />
                {addresses.map((addr) => (
                    <Picker.Item key={addr.id} label={addr.name} value={addr.id} />
                ))}
            </Picker>

            <TextInput style={Styles.input} placeholder="Số điện thoại"
                keyboardType="numeric" value={form.phone} onChangeText={(value) => update('phone', value)} />

            <TextInput style={Styles.input} placeholder="CCCD/CMND"
                value={form.citizenId} onChangeText={(value) => update('citizenId', value)} />

            <Button style={Styles.button} title="Đăng Ký" onPress={submit} />
        </ScrollView>
    );

};

export default Create_Resident;