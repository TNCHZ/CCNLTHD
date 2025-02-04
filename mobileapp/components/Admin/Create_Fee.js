import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import Styles from "../../styles/Styles";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Checkbox, Chip } from "react-native-paper";
import APIs, { authApis, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";

const Create_Fee = () => {
    const [selectedOption, setSelectedOption] = useState("all"); // "all" hoặc "individual"
    const [user, setUser] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]); // Lưu user được chọn
    const [time, setTime] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [number, setNumber] = useState('');
    const [text, setText] = useState('0');
    const [feeName, setFeeName] = useState('');
    const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu

    const fetchTime = async () =>{
        setLoading(true);
        let allTime = [];
        let nextUrl = endpoints["month-fee"];
        
        try {
            while (nextUrl) {
                const token = await AsyncStorage.getItem("token");
                const response = await authApis(token).get(nextUrl);
                allTime = [...allTime, ...response.data.results];
                nextUrl = response.data.next;
            }

            setTime(allTime);
        } catch (error) {
            console.error("Lỗi khi tải danh sách user:", error.response?.data || error);
        } finally {
            setLoading(false); // Kết thúc tải dữ liệu
        }
    }

    const fetchUsers = async () => {
        setLoading(true); // Bắt đầu tải dữ liệu
        let allUsers = [];
        let nextUrl = endpoints["list-user"];

        try {
            while (nextUrl) {
                const token = await AsyncStorage.getItem("token");
                const response = await authApis(token).get(nextUrl);
                allUsers = [...allUsers, ...response.data.results];
                nextUrl = response.data.next;
            }

            setUser(allUsers);
        } catch (error) {
            console.error("Lỗi khi tải danh sách user:", error.response?.data || error);
        } finally {
            setLoading(false); // Kết thúc tải dữ liệu
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchTime();
    }, []);

    const handleChange = (value) => {
        const num = parseInt(value.replace(/[^0-9]/g, ''), 10); // Chỉ lấy số
        if (!isNaN(num)) {
            setNumber(value);
            setText(numberToWords(num));
        } else {
            setNumber('');
            setText('');
        }
    };

    const toggleUserSelection = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    return (
        <ScrollView style={Styles.containerNoCenter}>
            <View style={Styles.row}>
                <TouchableOpacity style={Styles.touchable} onPress={() => setFeeName('Phí Quản Lí')}>
                    <Chip style={Styles.chip} icon="clipboard-text">Phí Quản Lí</Chip>
                </TouchableOpacity>
                <TouchableOpacity style={Styles.touchable} onPress={() => setFeeName('Phí Đỗ Xe')}>
                    <Chip style={Styles.chip} icon="clipboard-text">Phí Đỗ Xe</Chip>
                </TouchableOpacity>
                <TouchableOpacity style={Styles.touchable} onPress={() => setFeeName('Phí Dịch Vụ')}>
                    <Chip style={Styles.chip} icon="clipboard-text">Phí Dịch Vụ</Chip>
                </TouchableOpacity>
            </View>

            <Text style={Styles.title}>Phiếu đóng tiền: {feeName}</Text>
            
            
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View style={Styles.row}>
                    <Text style={[Styles.subtitle,{width:"40%"}]}>Chọn Thời Gian</Text>
                    <Picker style={[Styles.input,{width:"60%"}]} selectedValue={selectedTime} onValueChange={(itemValue) => setSelectedTime(itemValue)} >
                        {time.map((item) => (
                            <Picker.Item key={item.id} label={"Tháng" + " " + item.name + " " + item.year} value={item.id} />
                        ))}
                    </Picker>
                </View>
            )}

            <View style={Styles.row}>
                <TextInput style={[Styles.input, {width:"70%"}]} placeholder="Nhập số tiền"
                    keyboardType="numeric" value={number} onChangeText={handleChange}
                />
                <Text style={[Styles.subtitle, { marginLeft: 10 }]}>VND</Text>
            </View>


            <View style={{alignItems: 'center',}}>
                <Text style={Styles.subtitle}>Áp dụng cho:</Text>
                <Picker selectedValue={selectedOption} style={Styles.input}
                    onValueChange={(value) => setSelectedOption(value)}>
                    <Picker.Item label="Tất cả dân cư" value="all" />
                    <Picker.Item label="Từng dân cư" value="individual" />
                </Picker>

                {/* Nếu chọn "Từng dân cư" thì hiển thị danh sách với checkbox */}
                {selectedOption === "individual" && (
                    <ScrollView style={{ marginTop: 10 }}>
                        {loading ? <Text>Đang tải danh sách...</Text> :
                            user.map((user) => (
                                <View key={user.user} style={Styles.row}>
                                    <Checkbox
                                        status={selectedUsers.includes(user.user) ? "checked" : "unchecked"}
                                        onPress={() => toggleUserSelection(user.user)}
                                    />
                                    <Text>{user.address.name} - {user.phone}</Text>
                                </View>
                            ))
                        }
                    </ScrollView>
                )}

                {/* Nếu chọn "Tất cả dân cư", thì lưu tất cả */}
                <TouchableOpacity style={Styles.button}
                    onPress={() => console.log(selectedOption === "all" ? user : selectedUsers)}>
                    <Text style={Styles.buttonText}>Lưu danh sách</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
export default Create_Fee;