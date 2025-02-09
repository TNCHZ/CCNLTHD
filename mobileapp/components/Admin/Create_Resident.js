import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Styles from '../../styles/Styles';
import APIs, { authApis, endpoints } from "../../configs/APIs";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const Create_Resident = () => {
    const [date, setDate] = useState(new Date());
    const [addresses, setAddresses] = useState([]);
    const [locker, setLocker] = useState([]);

    const showDatePicker = () => {
        DateTimePickerAndroid.open({
            value: date,
            mode: 'date',
            is24Hour: true,
            onChange: (event, selectedDate) => {
                if (selectedDate) {
                    update('dayOfBirth', selectedDate);
                    setDate(selectedDate);
                }
            },
        });
    };

    const [json, setJson] = useState({
        fullName: "",
        gender: true,
        dayOfBirth: date,
        address: "",
        phone: "",
        citizenId: "",
        password: "1",
    });

    const [selectedLocker, setSelectedLocker] = useState('');

    const fetchLocker = async () => {
        let allLocker = [];
        let nextUrl = endpoints["locker"];

        try {
            while (nextUrl) {
                const token = await AsyncStorage.getItem("token");
                const response = await authApis(token).get(nextUrl);
                const filterLocker = response.data.results.filter(address => address.resident === null);

                allLocker = [...allLocker, ...filterLocker];
                nextUrl = response.data.next;
            }
            setLocker(allLocker);
        } catch (error) {
            console.error("Lỗi khi tải danh sách tủ điện tử:", error);
        }
    };

    const fetchAddresses = async () => {
        let allAddresses = [];
        let nextUrl = endpoints["address"];

        try {
            while (nextUrl) {
                const token = await AsyncStorage.getItem("token");
                const response = await authApis(token).get(nextUrl);
                const filteredAddresses = response.data.results.filter(address => address.is_free === true);

                allAddresses = [...allAddresses, ...filteredAddresses];
                nextUrl = response.data.next;
            }
            setAddresses(allAddresses);
        } catch (error) {
            console.error("Lỗi khi tải danh sách căn hộ:", error);
        }
    };

    useEffect(() => {
        fetchAddresses();
        fetchLocker();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchAddresses();
            fetchLocker();
        }, [])
    );

    const update = (field, value) => {
        setJson({ ...json, [field]: value });
    };
    

    const submit = async () => {
        const { fullName, gender, dayOfBirth, address, phone, citizenId, password } = json;
    
        if (!fullName || !address || !phone || !citizenId) {
            Alert.alert('Cảnh Báo', 'Vui lòng điền đầy đủ thông tin!');
            return;
        }
    
        const nameParts = fullName.trim().split(" ");
        const firstName = nameParts.slice(0, -1).join(" ");
        const lastName = nameParts.slice(-1).join(" ");
    
        const payload = {
            user: {
                username: phone,
                first_name: firstName,
                last_name: lastName,
                password: password,
                role: "Resident"
            },
            gender: gender,
            day_of_birth: dayOfBirth.toISOString().split("T")[0],
            address: parseInt(address, 10),
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
            console.log(response.data)
    
            if (response.status === 201) {
                const residentId = response.data.resident_id;
    
                if (selectedLocker) {
                    try {
                        console.log(residentId)
                        await authApis(token).patch(`${endpoints["locker"]}${selectedLocker}/`, {
                            resident: residentId
                        });
    
                        Alert.alert("Thành công", "Cư dân và tủ điện tử đã được đăng ký thành công!");
                    } catch (lockerError) {
                        console.error("Lỗi khi cập nhật tủ điện tử:", lockerError.response?.data || lockerError);
                        Alert.alert("Cảnh báo", "Tạo cư dân thành công nhưng không thể gán tủ điện tử!");
                    }
                } else {
                    Alert.alert("Thành công", "Cư dân đã được đăng ký thành công!");
                }
    
                // Reset form
                fetchAddresses();
                fetchLocker();
                setJson({
                    fullName: "",
                    gender: true,
                    dayOfBirth: new Date(),
                    address: "",
                    phone: "",
                    citizenId: "",
                    password: "1",
                });
                setDate(new Date());
                setSelectedLocker(""); 
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
                value={json.fullName} onChangeText={(value) => update('fullName', value)} />

            <Picker selectedValue={json.gender}
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

            <Text style={Styles.subtitle}>Số Căn Hộ:</Text>
            <Picker selectedValue={json.address} style={Styles.input} onValueChange={(value) => update("address", value)} >
                <Picker.Item label="Chọn căn hộ" value="" />
                {addresses.map((addr) => (
                    <Picker.Item key={addr.id} label={addr.name} value={addr.id} />
                ))}
            </Picker>

            <Text style={Styles.subtitle}>Tủ điện tử:</Text>
            <Picker selectedValue={selectedLocker} style={Styles.input} onValueChange={(value) => setSelectedLocker(value)} >
                <Picker.Item label="Chọn tủ điện tử" value="" />
                {locker.map((addr) => (
                    <Picker.Item key={addr.id} label={addr.name} value={addr.id} />
                ))}
            </Picker>


            <TextInput style={Styles.input} placeholder="Số điện thoại"
                keyboardType="numeric" value={json.phone} maxLength={10} onChangeText={(value) => update('phone', value)} />

            <TextInput style={Styles.input} placeholder="CCCD/CMND"
                value={json.citizenId} onChangeText={(value) => update('citizenId', value)} />

            <Button style={Styles.button} title="Đăng Ký" onPress={submit} />
        </ScrollView>
    );
};

export default Create_Resident;
