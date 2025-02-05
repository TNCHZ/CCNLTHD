import React, { useState, useEffect } from "react";
import { Text, View, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/APIs";
import { Picker } from "@react-native-picker/picker";

const Check_Fee = () => {
    const [users, setUsers] = useState([]);
    const [months, setMonths] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [feeName, setFeeName] = useState("");
    const [apartment, setApartment] = useState("");
    const [image, setImage] = useState(null); // Placeholder for the image
    const [loading, setLoading] = useState(false);

    // Fetching users
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
            setUsers(allUsers);
        } catch (error) {
            console.error("Error fetching users:", error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    // Fetching months
    const fetchMonths = async () => {
        setLoading(true);
        let allMonths = [];
        let nextUrl = endpoints["month-fee"];

        try {
            while (nextUrl) {
                const token = await AsyncStorage.getItem("token");
                const response = await authApis(token).get(nextUrl);
                allMonths = [...allMonths, ...response.data.results];
                nextUrl = response.data.next;
            }
            setMonths(allMonths);
        } catch (error) {
            console.error("Error fetching months:", error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchMonths();
    }, []);

    // Filter function (for demo purposes, can be customized as per your needs)
    const filterResults = () => {
        console.log("Filtering with the following parameters:");
        console.log("User: ", selectedUser);
        console.log("Month: ", selectedMonth);
        console.log("Fee Name: ", feeName);
        console.log("Apartment: ", apartment);
        console.log("Image: ", image);
        // Here, you would call your backend API to filter the data based on these parameters.
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.label}>Chọn Người Dùng</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <Picker
                        selectedValue={selectedUser}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedUser(itemValue)}
                    >
                        {users.map((user) => (
                            <Picker.Item key={user.id} label={user.name} value={user.id} />
                        ))}
                    </Picker>
                )}
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Chọn Tháng</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <Picker
                        selectedValue={selectedMonth}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                    >
                        {months.map((month) => (
                            <Picker.Item key={month.id} label={`Tháng ${month.name} ${month.year}`} value={month.id} />
                        ))}
                    </Picker>
                )}
            </View>

            <View style={styles.row}>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập tên phí"
                    value={feeName}
                    onChangeText={(text) => setFeeName(text)}
                />
            </View>

            <View style={styles.row}>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập căn hộ"
                    value={apartment}
                    onChangeText={(text) => setApartment(text)}
                />
            </View>

            <View style={styles.row}>
                <TouchableOpacity style={styles.imagePicker} onPress={() => alert("Pick an image")}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.imagePreview} />
                    ) : (
                        <Text>Chọn hình ảnh</Text>
                    )}
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={filterResults}>
                <Text style={styles.buttonText}>Lọc Kết Quả</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    label: {
        width: "30%",
        fontSize: 16,
        fontWeight: "bold",
    },
    picker: {
        width: "70%",
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        paddingLeft: 10,
        width: "70%",
    },
    imagePicker: {
        width: "70%",
        height: 40,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
    },
    imagePreview: {
        width: 50,
        height: 50,
        resizeMode: "contain",
    },
    button: {
        backgroundColor: "#4CAF50",
        padding: 10,
        alignItems: "center",
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
});

export default Check_Fee;
