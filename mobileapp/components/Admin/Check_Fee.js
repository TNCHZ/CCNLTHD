import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, Image, Alert } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/APIs";
import { Picker } from "@react-native-picker/picker";
import Styles from "../../styles/Styles";

const Check_Fee = () => {
    const [users, setUsers] = useState([]);
    const [months, setMonths] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fees, setFees] = useState(null);

    const extractImageUrl = (avatarUrl) => {
        if (!avatarUrl) return null;

        // Kiểm tra nếu avatarUrl đã là URL hợp lệ
        if (avatarUrl.startsWith("https://")) return avatarUrl;

        // Nếu avatarUrl chứa "image/upload/", loại bỏ phần này
        const prefix = "image/upload/";
        const index = avatarUrl.indexOf(prefix);
        return index !== -1 ? avatarUrl.substring(index + prefix.length) : avatarUrl;
    };

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

    useEffect(() => {
        if (users.length > 0 && !selectedUser) {
            setSelectedUser(users[0].user); // Set the first user as the selected user
        }
        if (months.length > 0 && !selectedMonth) {
            setSelectedMonth(months[0].id); // Set the first month as the selected month
        }
    }, [users, months, selectedUser, selectedMonth]);

    const filterResults = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");

            const response = await authApis(token).get(
                `/${"resident-information"}/${selectedUser}/${"get_fees_in_month"}/?month=${selectedMonth}`
            );
            setFees(response.data);
        } catch (error) {
            console.error("Error fetching fees:", error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    const updatePaymentStatus = async (feeType, feeId) => {
        setLoading(true);

        try {
            const token = await AsyncStorage.getItem("token");
            const response = await authApis(token).patch(`${endpoints[feeType]}${feeId}/`, {
                status: true,
            });

            if (response.status === 200) {
                Alert.alert("Thông báo", "Thanh toán thành công!");
            } else {
                Alert.alert("Thông báo", "Có lỗi xảy ra trong quá trình thanh toán!");
            }
        } catch (error) {
            console.error("Error updating payment status:", error);
            Alert.alert("Thông báo", "Có lỗi xảy ra trong quá trình thanh toán!");
        } finally {
            setLoading(false);
        }
    };

    const handleFeePress = (feeType, feeId) => {
        Alert.alert(
            "Xác nhận thanh toán",
            "Bạn có chắc chắn muốn thanh toán cho khoản phí này?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Xác nhận",
                    onPress: () => updatePaymentStatus(feeType, feeId),
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Phần chọn căn hộ */}
            <View style={styles.row}>
                <Text style={styles.label}>Chọn căn hộ</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <Picker
                        selectedValue={selectedUser}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedUser(itemValue)}
                    >
                        {users.map((user) => (
                            <Picker.Item key={user.id} label={user.address.name} value={user.user} />
                        ))}
                    </Picker>
                )}
            </View>

            {/* Phần chọn tháng */}
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

            {/* Nút lọc */}
            <TouchableOpacity onPress={filterResults} style={styles.button}>
                <Text style={styles.buttonText}>Lọc</Text>
            </TouchableOpacity>

            {/* Phần kết quả tìm kiếm có thể cuộn */}
            <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.feeContainer}>
                <Text style={styles.header}>Kết quả tìm kiếm:</Text>

                {/* Phí Quản Lí */}
                {fees && fees.managing_fees?.length > 0 && (
                    <View style={styles.feeItem}>
                        <Text style={styles.feeTitle}>Phí Quản Lí</Text>
                        <Text style={styles.feeText}>Giá: {fees.managing_fees[0].fee_value} VND</Text>
                        <Text style={styles.feeText}>
                            Tháng: {fees.managing_fees[0].month_details.name} {fees.managing_fees[0].month_details.year}
                        </Text>
                        {fees.managing_fees[0].fee_image ? (
                            <Image
                                source={{ uri: extractImageUrl(fees.managing_fees[0].fee_image) }}
                                style={Styles.imageLogo}
                            />
                        ) : (
                            <Text style={styles.feeText}>Không có hình ảnh</Text>
                        )}
                        <Text style={styles.feeText}>
                            Trạng thái: {fees.managing_fees[0].status ? "Đã thanh toán" : "Chưa thanh toán"}
                        </Text>
                        {!fees.managing_fees[0].status && (
                            <TouchableOpacity
                                style={styles.paymentButton}
                                onPress={() => handleFeePress("managing_fees", fees.managing_fees[0].id)}
                            >
                                <Text style={styles.paymentButtonText}>Xác nhận thanh toán</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}


                {/* Phí Đỗ Xe */}
                {fees && fees.parking_fees?.length > 0 && (
                    <View style={styles.feeItem}>
                        <Text style={styles.feeTitle}>Phí Đỗ Xe</Text>
                        <Text style={styles.feeText}>Giá: {fees.parking_fees[0].fee_value} VND</Text>
                        <Text style={styles.feeText}>
                            Tháng: {fees.parking_fees[0].month_details.name} {fees.parking_fees[0].month_details.year}
                        </Text>
                        {fees.parking_fees[0].fee_image ? (
                            <Image
                                source={{ uri: extractImageUrl(fees.parking_fees[0].fee_image) }}
                                style={styles.feeImage}
                            />
                        ) : (
                            <Text style={styles.feeText}>Không có hình ảnh</Text>
                        )}
                        {!fees.parking_fees[0].status && (
                            <TouchableOpacity
                                style={styles.paymentButton}
                                onPress={() => handleFeePress("create-parking-fee", fees.parking_fees[0].id)}
                            >
                                <Text style={styles.paymentButtonText}>Xác nhận thanh toán</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* Phí Dịch Vụ */}
                {fees && fees.service_fees?.length > 0 && (
                    <View style={styles.feeItem}>
                        <Text style={styles.feeTitle}>Phí Dịch Vụ</Text>
                        <Text style={styles.feeText}>Giá: {fees.service_fees[0].fee_value} VND</Text>
                        <Text style={styles.feeText}>
                            Tháng: {fees.service_fees[0].month_details.name} {fees.service_fees[0].month_details.year}
                        </Text>
                        {fees.service_fees[0].fee_image ? (
                            <Image
                                source={{ uri: extractImageUrl(fees.service_fees[0].fee_image) }}
                                style={styles.feeImage}
                            />
                        ) : (
                            <Text style={styles.feeText}>Không có hình ảnh</Text>
                        )}
                        {!fees.service_fees[0].status && (
                            <TouchableOpacity
                                style={styles.paymentButton}
                                onPress={() => handleFeePress("create-service-fee", fees.service_fees[0].id)}
                            >
                                <Text style={styles.paymentButtonText}>Xác nhận thanh toán</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
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
    button: {
        backgroundColor: "#4CAF50",
        padding: 10,
        alignItems: "center",
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
    feeContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
    },
    header: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    feeText: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default Check_Fee;
