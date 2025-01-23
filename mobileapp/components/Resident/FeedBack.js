import { TextInput, View, Text, TouchableOpacity, Alert } from "react-native";
import FeedBackStyle from "./FeedBackStyle";
import { useState } from "react";

const FeedBack = ({navigation}) => {
    const [feedback, setFeedback] = useState("");

    const thanks = () => {
        try {
            Alert.alert(
                "FeedBack",
                "Cảm ơn bạn đã đóng góp ý kiển để cải thiện chất lượng của JpHome !",
                [
                    { text: "Ở lại trang Góp Ý", style: "cancel" },
                    { text: "Trở về trang chủ", onPress: () => navigation.navigate("home") }
                ]
            );
            setFeedback("");
            console.info("Gửi FeedBack thành công");
        } catch (error) {
            console.error("Gửi FeedBack thất bại");
        }
    }

    return (
        <View style={FeedBackStyle.container}>
            <Text style={FeedBackStyle.title}>THƯ GÓP Ý</Text>
            <Text style={FeedBackStyle.subtitle}>Gửi đến Ban Quản Lý Chung Cư JpHome</Text>
            <TextInput style={FeedBackStyle.input} placeholder="Hãy ghi các đóng góp ý kiến của bạn ở đây !"
                placeholderTextColor="#888"
                multiline={true} // Đảm bảo text không bị tràn màn hình mà xuống dòng
                textAlignVertical="top" // Đảm bảo text bắt đầu từ trên cùng
                value={feedback}
                onChangeText={(text) => setFeedback(text)}
            />
            <TouchableOpacity style={FeedBackStyle.button} onPress={thanks}>
                <Text style={FeedBackStyle.buttonText}>Gửi</Text>
            </TouchableOpacity>
        </View>
    );
}

export default FeedBack;