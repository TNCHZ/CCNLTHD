import { ScrollView, View, Text, ActivityIndicator } from "react-native";
import Styles from "../../styles/Styles";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { authApis, endpoints } from "../../configs/APIs";


const CheckFeedback = () => {
    const [loading, setLoading] = useState(false);
    const [feedbackList, setFeedbackList] = useState([]);

    // Hàm lấy dữ liệu từ API
    const fetchFeedback = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await authApis(token).get(endpoints["feedback"]);
            setFeedbackList(response.data.results);
        } catch (error) {
            console.error("Lỗi khi tải phản hồi:", error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    return (
        <View style={Styles.container}>
            <Text style={Styles.title}>Danh sách phản hồi</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <ScrollView style={[Styles.scrollView, {width: "100%"}]}>
                    {feedbackList.length > 0 ? (
                        feedbackList.map((feedback) => {
                            const resident = feedback.resident_details;
                            const fullName = `${resident.userdetail.first_name} ${resident.userdetail.last_name}`;
                            const apartment = resident.address.name;
                            return (
                                <View key={feedback.id} style={{ marginBottom: 10, padding: 10, backgroundColor: "#f0f0f0", borderRadius: 5 }}>
                                    <Text style={{ fontWeight: "600" }}>{apartment} - {fullName}</Text>
                                    <Text style={{ color: "#333", marginTop: 2 }}>Nội dung: {feedback.content}</Text>
                                </View>
                            );
                        })
                    ) : (
                        <Text>Không có phản hồi nào.</Text>
                    )}
                </ScrollView>
            )}
        </View>
    );
};

export default CheckFeedback;
