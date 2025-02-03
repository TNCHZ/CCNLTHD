import React, { useEffect, useState } from "react";
import { View, TextInput, Button, ScrollView, Text, Alert, TouchableOpacity } from "react-native";
import Styles from "../../styles/Styles";
import APIs, { authApis, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Create_Survey = () => {
    const [surveyTitle, setSurveyTitle] = useState(""); // Lưu tên khảo sát
    const [questions, setQuestions] = useState([""]); // Lưu danh sách câu hỏi
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu

    // Thêm một ô nhập câu hỏi mới
    const addQuestion = () => {
        setQuestions([...questions, ""]);
    };

    const fetchResidents = async () => {
        let allResident = [];
        let nextUrl = endpoints["list-user"];

        try {
            while (nextUrl) {
                const token = await AsyncStorage.getItem("token");
                const response = await authApis(token).get(nextUrl);
                allResident = [...allResident, ...response.data.results];
                nextUrl = response.data.next;
            }

            setResidents(allResident);
        } catch (error) {
            console.error("Lỗi khi tải danh sách user:", error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResidents();
    }, []);

    // Cập nhật nội dung câu hỏi tại một index cụ thể
    const updateQuestion = (text, index) => {
        const newQuestions = [...questions];
        newQuestions[index] = text;
        setQuestions(newQuestions);
    };

    // Xóa một câu hỏi khỏi danh sách
    const deleteQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions.length > 0 ? newQuestions : [""]); // Luôn có ít nhất một ô nhập
    };


    const submit = async () => {
        if (surveyTitle.trim() === "") {
            Alert.alert("Lỗi", "Vui lòng nhập tên khảo sát!");
            return;
        }
        if (questions.some(q => q.trim() === "")) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ câu hỏi!");
            return;
        }
    
        const content = questions.join(" # ");
    
        const payload = {
            name: surveyTitle,  // Tên khảo sát
            content: content    // Nội dung câu hỏi dạng chuỗi
        };
    
        try {
            const token = await AsyncStorage.getItem("token");
    
            const surveyResponse = await authApis(token).post(endpoints["survey"], payload, {
                headers: { "Content-Type": "application/json" }
            });
    
            if (surveyResponse.status === 201) {
                const surveyId = surveyResponse.data.id;  
    
                const residentIds = residents.map(u => u.user); 

                const surveyResponsePayload = residentIds.map(residentId => ({
                    survey: surveyId,
                    resident: residentId,
                }));
                
    
                for (const responseData of surveyResponsePayload) {
                    await authApis(token).post(endpoints["resident-survey-response"], responseData, {
                        headers: { "Content-Type": "application/json" }
                    });
                }
                
                Alert.alert("Thành công", "Khảo sát đã được tạo và gửi tới cư dân!", [{ text: "OK" }]);
    
                // Reset form sau khi tạo khảo sát
                setSurveyTitle("");
                setQuestions([]);
            } else {
                Alert.alert("Lỗi", surveyResponse.data.message || "Tạo khảo sát thất bại!");
            }
        } catch (error) {
            console.error("Lỗi khi gửi dữ liệu:", error);
            Alert.alert("Lỗi", error.response?.data?.message || "Không thể kết nối đến server!");
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Ô nhập tên khảo sát */}
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Tên khảo sát:</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 5,
                        marginBottom: 20
                    }}
                    placeholder="Nhập tên khảo sát"
                    value={surveyTitle}
                    onChangeText={setSurveyTitle}
                />

                {/* Danh sách câu hỏi */}
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Câu hỏi:</Text>
                {questions.map((question, index) => (
                    <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                        <TextInput
                            style={{
                                flex: 1,
                                borderWidth: 1,
                                padding: 10,
                                borderRadius: 5
                            }}
                            placeholder={`Câu hỏi ${index + 1}`}
                            value={question}
                            onChangeText={(text) => updateQuestion(text, index)}
                        />
                        <TouchableOpacity onPress={() => deleteQuestion(index)} style={{ marginLeft: 10 }}>
                            <Text style={{ fontSize: 18, color: "red" }}>❌</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <Button title="Thêm câu hỏi" onPress={addQuestion} />
                <View style={{ marginTop: 20 }}>
                    <Button title="Lưu khảo sát" onPress={submit} />
                </View>
            </ScrollView>
        </View>
    );
};

export default Create_Survey;
