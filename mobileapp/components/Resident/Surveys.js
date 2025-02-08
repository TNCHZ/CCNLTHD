import { useContext, useEffect, useState } from "react";
import { MyAccountContext } from "../../configs/MyContext";
import APIs, { authApis, endpoints } from "../../configs/APIs";
import { Text, View, TextInput, Button, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Surveys = () => {
    const [accountState] = useContext(MyAccountContext);
    const [surveyResponses, setSurveyResponses] = useState([]);  
    const [loading, setLoading] = useState(false);
    const [selectedSurvey, setSelectedSurvey] = useState(null); 
    const [answers, setAnswers] = useState({}); 
    const [surveyQuestions, setSurveyQuestions] = useState([]);

    const loadSurveyResponses = async () => {
        setLoading(true);
        try {
            let url = `${endpoints['survey-response'](accountState)}`;
            const token = await AsyncStorage.getItem("token");
            let res = await authApis(token).get(url);
            setSurveyResponses(res.data); 
        } catch (ex) {
            console.error("Lỗi survey", ex);
        } finally {
            setLoading(false);
        }
    };

    const handleSurveySelect = (surveyId) => {
        setSelectedSurvey(surveyId);
        const selectedSurveyResponse = surveyResponses.find(survey => survey.id === surveyId);
        if (selectedSurveyResponse) {
            const questions = selectedSurveyResponse.survey_details.content.split("#");
            setSurveyQuestions(questions.map(question => question.trim()));
        }
    };

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
        const responseContent = Object.values(answers).join(' # ');  

        try {
            const surveyId = selectedSurvey;  
            console.log("Selected Survey ID: ", selectedSurvey);

            const data = {
                response_content: responseContent,
                is_response: true
            };

            const token = await AsyncStorage.getItem("token");

            let url = `${endpoints['resident-survey-response']}${selectedSurvey}/`;
            console.log(url)

            const response = await authApis(token).patch(url, data, {
                headers: {
                    "Content-Type": "application/json",
                }
            });


            setAnswers({}); 
            setSelectedSurvey(null);  
            setSurveyQuestions([]);  

            loadSurveyResponses();  

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
                                        placeholder="Câu trả lời của bạn"
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
