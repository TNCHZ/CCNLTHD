import { Button, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import Styles from "../../styles/Styles";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Checkbox, Chip } from "react-native-paper";
import APIs, { authApis, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";

const feeEndpoints = {
    "Phí Quản Lí": "create-managing-fee",
    "Phí Đỗ Xe": "create-parking-fee",
    "Phí Dịch Vụ": "create-service-fee"
};

const Create_Fee = () => {
    const [selectedOption, setSelectedOption] = useState("all");
    const [user, setUser] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [time, setTime] = useState([]);
    const [selectedTime, setSelectedTime] = useState("");  // To hold the selected month
    const [number, setNumber] = useState("");
    const [feeName, setFeeName] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchTime = async () => {
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

            // Set the default selectedTime to the first available month (if any)
            if (allTime.length > 0) {
                setSelectedTime(allTime[0].id);  // Default to the first month in the list
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách tháng:", error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
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

            // Set the default selectedUsers to all users if "Tất cả dân cư" is selected
            if (selectedOption === "all") {
                const allUserIds = allUsers.map((u) => u.user);  // Assuming 'user' is the user ID
                setSelectedUsers(allUserIds);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách user:", error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchTime();
    }, []);  // Initial fetch on mount

    const handleChange = (value) => {
        const num = parseInt(value.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(num)) {
            setNumber(value);
        } else {
            setNumber(''); // Reset if the value is not a valid number
        }
    };

    const toggleUserSelection = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const saveFeeData = async () => {
        if (!selectedTime || !number || !feeName) {
            Alert.alert("Lỗi", "Vui lòng chọn loại phí, thời gian và nhập số tiền.");
            return;
        }

        setLoading(true);

        try {
            const token = await AsyncStorage.getItem("token");
            const url = endpoints[feeEndpoints[feeName]];
            

            const data = {
                name: `${feeName} `, // Use month name and year
                month: selectedTime,
                fee_value: number,
            };
            for (let i = 0; i < selectedUsers.length; i++) {
                const userId = selectedUsers[i];

                const response = await authApis(token).post(url, {
                    ...data,
                    resident: userId
                });

                console.log(`Response for user ${userId}: `, response.data);
            }

        } catch (error) {
            console.error("Error saving data:", error);
            Alert.alert("Lỗi", error.response?.data?.message || "Không thể kết nối đến server!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={Styles.containerNoCenter}>
            <View style={Styles.row}>
                {Object.keys(feeEndpoints).map((fee) => (
                    <TouchableOpacity key={fee} style={Styles.touchable} onPress={() => setFeeName(fee)}>
                        <Chip style={Styles.chip} icon="clipboard-text">{fee}</Chip>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={Styles.title}>Phiếu đóng tiền: {feeName}</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View style={Styles.row}>
                    <Text style={[Styles.subtitle, { width: "40%" }]}>Chọn Thời Gian</Text>
                    <Picker style={[Styles.input, { width: "60%" }]} selectedValue={selectedTime} onValueChange={(itemValue) => setSelectedTime(itemValue)} >
                        {time.map((item) => (
                            <Picker.Item key={item.id} label={"Tháng " + item.name + " " + item.year} value={item.id} />
                        ))}
                    </Picker>
                </View>
            )}

            <View style={Styles.row}>
                <TextInput style={[Styles.input, { width: "70%" }]} placeholder="Nhập số tiền"
                    keyboardType="numeric" value={number} onChangeText={handleChange}
                />
                <Text style={[Styles.subtitle, { marginLeft: 10 }]}>VND</Text>
            </View>

            <View style={{ alignItems: 'center', }}>
                <Text style={Styles.subtitle}>Áp dụng cho:</Text>
                <Picker
                    selectedValue={selectedOption}
                    style={Styles.input}
                    onValueChange={(value) => {
                        setSelectedOption(value);
                        if (value === "all") {
                            const allUserIds = user.map((u) => u.user); // Assuming 'user' is the user ID
                            setSelectedUsers(allUserIds);
                        } else {
                            setSelectedUsers([]); // Deselect all users if "Từng dân cư"
                        }
                    }}
                >
                    <Picker.Item label="Tất cả dân cư" value="all" />
                    <Picker.Item label="Từng dân cư" value="individual" />
                </Picker>

                {selectedOption === "individual" && (
                    <ScrollView style={{ marginTop: 10 }}>
                        {user.map((u) => (
                            <View key={u.user} style={Styles.row}>
                                <Checkbox
                                    status={selectedUsers.includes(u.user) ? "checked" : "unchecked"}
                                    onPress={() => toggleUserSelection(u.user)}
                                />
                                <Text>{u.address.name} - {u.phone}</Text>
                            </View>
                        ))}
                    </ScrollView>
                )}

                <TouchableOpacity style={Styles.button} onPress={saveFeeData}>
                    <Text style={Styles.buttonText}>Lưu danh sách</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
export default Create_Fee;
