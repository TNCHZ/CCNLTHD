import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Styles from "../../styles/Styles";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { authApis, endpoints } from "../../configs/APIs";


const CheckSurvey = () => {
    const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [loadingSurvey, setLoadingSurvey] = useState(false);
    const [loadingResponses, setLoadingResponses] = useState(false);
    const [surveyList, setSurveyList] = useState([]);
    const [responses, setResponses] = useState([]);

    const fetchSurvey = async () => {
        setLoadingSurvey(true);
        let allSurvey = [];
        let nextUrl = endpoints["survey"];

        try {
            while (nextUrl) {
                const token = await AsyncStorage.getItem("token");
                const response = await authApis(token).get(nextUrl);
                allSurvey = [...allSurvey, ...response.data.results];
                nextUrl = response.data.next;
            }
            setSurveyList(allSurvey);
        } catch (error) {
            console.error("Lỗi khi tải danh sách khảo sát:", error.response?.data || error);
        } finally {
            setLoadingSurvey(false);
        }
    };

    const fetchResidentResponses = async (surveyId) => {
        if (!surveyId) return;
        setLoadingResponses(true);
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await authApis(token).get(`${endpoints["get-resident-response-survey"]}${surveyId}/`);
            
            const processedResponses = response.data.map((item) => {
                const questions = item.survey_details.content.split("#").map(q => q.trim());
                const answers = item.response_content.split("#").map(a => a.trim());

                return {
                    residentName: `${item.resident_details.userdetail.first_name} ${item.resident_details.userdetail.last_name} - ${item.resident_details.address.name}  `,
                    questions,
                    answers,
                };
            });

            setResponses(processedResponses);
        } catch (error) {
            console.error("Lỗi khi tải phản hồi:", error.response?.data || error);
        } finally {
            setLoadingResponses(false);
        }
    };

    useEffect(() => {
        fetchSurvey();
    }, []);

    return (
        <View style={Styles.containerNoCenter}>
            <Text style={Styles.title}>Khảo sát của dân cư</Text>
            
            <Picker selectedValue={selectedSurvey} style={Styles.input}
                onValueChange={(value) => {
                    setSelectedSurvey(value);
                    fetchResidentResponses(value); 
                }}
            >
                <Picker.Item label="Chọn khảo sát" value={null} />
                {loadingSurvey ? (
                    <Picker.Item label="Đang tải..." value="loading" />
                ) : (
                    surveyList.map((item) => (
                        <Picker.Item key={item.id} label={item.name} value={item.id} />
                    ))
                )}
            </Picker>

            <ScrollView style={Styles.scrollView}>
                {loadingResponses ? (
                    <Text style={{ textAlign: "center", fontStyle: "italic", color: "gray" }}>Đang tải phản hồi...</Text>
                ) : responses.length > 0 ? (
                    responses.map((response, index) => (
                        <View key={index} style={{ marginBottom: 10, padding: 10,
                            borderBottomWidth: 1, borderBottomColor: "#ddd", }}>
                            <Text style={Styles.txt}>Cư dân: {response.residentName}</Text>
                            <ScrollView horizontal>
                                <View>
                                    {response.questions.map((question, qIndex) => (
                                        <View key={qIndex} style={{ marginBottom: 5 }}>
                                            <Text style={{ fontWeight: "600" }}>Câu hỏi {qIndex + 1}: {question}</Text>
                                            <Text style={{ color: "#333", marginTop: 2 }}>Trả lời: {response.answers[qIndex] || "Chưa có câu trả lời"}</Text>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    ))
                ) : (
                    <Text>Không có phản hồi nào.</Text>
                )}
            </ScrollView>
        </View>
    );
};

export default CheckSurvey;
