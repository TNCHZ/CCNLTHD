import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
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
//==============================================================================================================================    
    return (
        <View style={Styles.container}>
            {/* Phần chọn căn hộ */}
            <View style={[Styles.row, {borderColor: "#ccc", borderWidth: 1,}]}>
                <Text style={[Styles.title, {alignItems:'center', fontSize:18, width: "40%"}]}>Chọn căn hộ</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <Picker style={{width: "60%", backgroundColor: "#fff",}} selectedValue={selectedUser}
                        onValueChange={(itemValue) => setSelectedUser(itemValue)}
                    >
                        {users.map((user) => (
                            <Picker.Item key={user.user} label={user.address.name} value={user.user} />
                        ))}
                    </Picker>
                )}
            </View>

            {/* Phần chọn tháng */}
            <View style={[Styles.row, {borderColor: "#ccc", borderWidth: 1,}]}>
                <Text style={[Styles.title, {alignItems:'center', fontSize:18, width: "40%"}]}>Chọn Tháng</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <Picker style={{width: "60%", backgroundColor: "#fff",}} selectedValue={selectedMonth}
                        onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                    >
                        {months.map((month) => (
                            <Picker.Item key={month.id} label={`Tháng ${month.name} ${month.year}`} value={month.id} />
                        ))}
                    </Picker>
                )}
            </View>

            {/* Nút lọc */}
            <TouchableOpacity onPress={filterResults} style={Styles.button}>
                <Text style={Styles.buttonText}>Lọc</Text>
            </TouchableOpacity>
            
            
            <Text style={Styles.title}>Kết quả tìm kiếm</Text>
            {/* Phần kết quả tìm kiếm có thể cuộn */}
            <ScrollView style={[Styles.scrollView, {width:"100%"}]}>
                {/* Phí Quản Lí */}
                {fees && fees.managing_fees?.length > 0 && (
                    <View style={{borderColor: "#000", borderWidth: 1, marginBottom: 5, padding: 5}}>
                        <Text style={[Styles.title, {fontSize:18}]}>Phí Quản Lí</Text>
                        <Text style={Styles.txt}>Giá: {fees.managing_fees[0].fee_value} VND</Text>
                        <Text style={Styles.txt}>
                            Tháng: {fees.managing_fees[0].month_details.name} - Năm: {fees.managing_fees[0].month_details.year}
                        </Text>
                        <View style={{alignItems:"center"}}>
                            {fees.managing_fees[0].fee_image ? (
                                <Image style={{width: 50, height: 50, margin: 5,}}
                                    source={{ uri: extractImageUrl(fees.managing_fees[0].fee_image) }}
                                />
                            ) : (
                                <Text style={[Styles.text, {fontSize:14}]}>Không có hình ảnh</Text>
                            )}
                        </View>
                        <Text style={Styles.txt}>
                            Trạng thái: {fees.managing_fees[0].status ? "Đã thanh toán" : "Chưa thanh toán"}
                        </Text>
                        {!fees.managing_fees[0].status && (
                            <View style={{alignItems:"center"}}>
                                <TouchableOpacity style={[Styles.button, {height: 20}]} onPress={() => handleFeePress("managing_fees", fees.managing_fees[0].id)}>
                                    <Text style={[Styles.buttonText, {fontSize: 12}]}>Xác nhận thanh toán</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}


                {/* Phí Đỗ Xe */}
                {fees && fees.parking_fees?.length > 0 && (
                    <View style={{borderColor: "#000", borderWidth: 1, marginBottom: 5, padding: 5}}>
                        <Text style={[Styles.title, {fontSize:18}]}>Phí Đỗ Xe</Text>
                        <Text style={Styles.txt}>Giá: {fees.parking_fees[0].fee_value} VND</Text>
                        <Text style={Styles.txt}>
                            Tháng: {fees.parking_fees[0].month_details.name} - Năm: {fees.parking_fees[0].month_details.year}
                        </Text>
                        <View style={{alignItems:"center"}}>
                            {fees.parking_fees[0].fee_image ? (
                                <Image style={{width: 50, height: 50, margin: 5,}}
                                    source={{ uri: extractImageUrl(fees.parking_fees[0].fee_image) }}
                                />
                            ) : (
                                <Text style={[Styles.text, {fontSize:14}]}>Không có hình ảnh</Text>
                            )}
                        </View>
                        <Text style={Styles.txt}>
                            Trạng thái: {fees.parking_fees[0].status ? "Đã thanh toán" : "Chưa thanh toán"}
                        </Text>
                        {!fees.parking_fees[0].status && (
                            <View style={{alignItems:"center"}}>
                                <TouchableOpacity style={[Styles.button, {height: 20}]} onPress={() => handleFeePress("create-parking-fee", fees.parking_fees[0].id)}>
                                    <Text style={[Styles.buttonText, {fontSize: 12}]}>Xác nhận thanh toán</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}

                {/* Phí Dịch Vụ */}
                {fees && fees.service_fees?.length > 0 && (
                    <View style={{borderColor: "#000", borderWidth: 1, marginBottom: 5, padding: 5}}>
                        <Text style={[Styles.title, {fontSize:18}]}>Phí Dịch Vụ</Text>
                        <Text style={Styles.txt}>Giá: {fees.service_fees[0].fee_value} VND</Text>
                        <Text style={Styles.txt}>
                            Tháng: {fees.service_fees[0].month_details.name} - Năm: {fees.service_fees[0].month_details.year}
                        </Text>
                        <View style={{alignItems:"center"}}>
                            {fees.service_fees[0].fee_image ? (
                                <Image style={{width: 50, height: 50, margin: 5,}}
                                    source={{ uri: extractImageUrl(fees.service_fees[0].fee_image) }}
                                />
                            ) : (
                                <Text style={[Styles.text, {fontSize:14}]}>Không có hình ảnh</Text>
                            )}
                        </View>
                        <Text style={Styles.txt}>
                            Trạng thái: {fees.service_fees[0].status ? "Đã thanh toán" : "Chưa thanh toán"}
                        </Text>
                        {!fees.service_fees[0].status && (
                            <View style={{alignItems:"center"}}>
                                <TouchableOpacity style={[Styles.button, {height: 20}]} onPress={() => handleFeePress("create-service-fee", fees.service_fees[0].id)}>
                                    <Text style={[Styles.buttonText, {fontSize: 12}]}>Xác nhận thanh toán</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );

};

export default Check_Fee;
