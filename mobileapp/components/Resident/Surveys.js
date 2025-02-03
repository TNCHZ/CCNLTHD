import { useContext, useEffect, useState } from "react";
import { MyAccountContext } from "../../configs/MyContext";
import APIs, { authApis, endpoints } from "../../configs/APIs";
import { Text, View, TextInput, Button, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Surveys = () => {
    const [accountState] = useContext(MyAccountContext);
    const [surveyResponses, setSurveyResponses] = useState([]);  // Dữ liệu các khảo sát
    const [loading, setLoading] = useState(false);
    const [selectedSurvey, setSelectedSurvey] = useState(null); // Khảo sát được chọn
    const [answers, setAnswers] = useState({}); // Lưu các câu trả lời
    const [surveyQuestions, setSurveyQuestions] = useState([]); // Các câu hỏi của khảo sát

    // Load các khảo sát
    const loadSurveyResponses = async () => {
        setLoading(true);
        try {
            let url = `${endpoints['survey-response'](accountState)}`;
            let res = await APIs.get(url);
            setSurveyResponses(res.data); // Lưu dữ liệu khảo sát vào state
        } catch (ex) {
            console.error("Lỗi survey", ex);
        } finally {
            setLoading(false);
        }
    };

    // Khi người dùng chọn khảo sát
    const handleSurveySelect = (surveyId) => {
        setSelectedSurvey(surveyId);
        const selectedSurveyResponse = surveyResponses.find(survey => survey.id === surveyId);
        if (selectedSurveyResponse) {
            // Tách câu hỏi từ `content` dựa trên dấu #
            const questions = selectedSurveyResponse.survey_details.content.split("#");
            setSurveyQuestions(questions.map(question => question.trim()));
        }
    };

    // Handle input change for each question
    const handleAnswerChange = (questionIndex, text) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionIndex]: text,
        }));
    };

    useEffect(() => {
        loadSurveyResponses();
    }, []);


    const handleSubmit = async () => {
        const responseContent = Object.values(answers).join(' # ');  // Kết hợp câu trả lời

        try {
            const surveyId = selectedSurvey;  // Đảm bảo bạn đã chọn khảo sát
            console.log("Selected Survey ID: ", selectedSurvey);

            const data = {
                response_content: responseContent,
                is_response: true
            };

            // Lấy token từ AsyncStorage
            const token = await AsyncStorage.getItem("token");

            let url = `${endpoints['resident-survey-response'](accountState)}`


            const response = await authApis(token).patch(url, data, {
                headers: {
                    "Content-Type": "application/json",
                }
            });

            console.log("Cập nhật câu trả lời thành công:", response.data);

            // Reset giao diện: 
            setAnswers({});  // Xóa các câu trả lời đã nhập
            setSelectedSurvey(null);  // Đặt lại khảo sát đã chọn về null
            setSurveyQuestions([]);  // Đặt lại câu hỏi khảo sát về mảng rỗng

            // Tải lại danh sách khảo sát (refresh giao diện)
            loadSurveyResponses();  // Gọi lại hàm để lấy lại danh sách khảo sát từ API

        } catch (error) {
            console.error("Lỗi khi cập nhật câu trả lời:", error);
        }
    };


    return (
        <ScrollView style={{ margin: 20 }}>
            <Text>Chọn khảo sát</Text>

            {loading ? (
                <Text>Loading...</Text>
            ) : surveyResponses.length === 0 ? (
                <Text>Không có khảo sát để thực hiện.</Text>
            ) : (
                <View>
                    <Picker
                        selectedValue={selectedSurvey}
                        onValueChange={handleSurveySelect}
                    >
                        <Picker.Item label="Chọn khảo sát" value={null} />
                        {surveyResponses.map((survey) => (
                            <Picker.Item
                                key={survey.id}
                                label={survey.survey_details.name}
                                value={survey.id}
                            />
                        ))}
                    </Picker>

                    {/* Khi đã chọn khảo sát, hiển thị câu hỏi */}
                    {selectedSurvey && surveyQuestions.length > 0 && (
                        <View>
                            <Text style={{ fontWeight: "bold" }}>
                                {surveyResponses.find(survey => survey.id === selectedSurvey)?.survey_details.name}
                            </Text>
                            {surveyQuestions.map((question, index) => (
                                <View key={index} style={{ marginBottom: 10 }}>
                                    <Text>{question}</Text>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            padding: 5,
                                            marginBottom: 10,
                                        }}
                                        placeholder="Your answer"
                                        value={answers[index] || ""}
                                        onChangeText={(text) => handleAnswerChange(index, text)}
                                    />
                                </View>
                            ))}
                            <Button title="Submit" onPress={handleSubmit} />
                        </View>
                    )}
                </View>
            )}
        </ScrollView>
    );
};

export default Surveys;
