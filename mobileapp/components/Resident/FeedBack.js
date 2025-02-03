import { TextInput, View, Text, TouchableOpacity, Alert } from "react-native";
import FeedBackStyle from "./FeedBackStyle";
import { useContext, useState } from "react";
import Styles from "../../styles/Styles";
import { MyAccountContext } from "../../configs/MyContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/APIs";

const FeedBack = ({navigation}) => {
    const [accountState] = useContext(MyAccountContext);
    const [feedback, setFeedback] = useState("");

    const thanks = async () => {
        try {
            const feedbackData = { 
                content: feedback,
                resident: accountState.id 
            }; 
    
            const token = await AsyncStorage.getItem("token");
    
            const response = await authApis(token).post(endpoints["feedback"], feedbackData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            // Kiểm tra phản hồi từ server
            if (response.status === 200 || response.status === 201) {
                Alert.alert("FeedBack", "Cảm ơn bạn đã đóng góp ý kiến để cải thiện chất lượng của JpHome!");
                setFeedback("");  // Reset lại nội dung feedback
                console.info("Gửi FeedBack thành công");
            } else {
                Alert.alert("FeedBack", "Đã có lỗi xảy ra khi gửi ý kiến của bạn. Vui lòng thử lại.");
                console.error("Gửi FeedBack thất bại");
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            Alert.alert("FeedBack", "Có lỗi khi gửi phản hồi. Vui lòng thử lại.");
            console.error("Gửi FeedBack thất bại", error);
        }
    };
    return (
        <View style={Styles.container}>
            <Text style={Styles.title}>THƯ GÓP Ý</Text>
            <Text style={FeedBackStyle.subtitle}>Gửi đến Ban Quản Lý Chung Cư JpHome</Text>
            <TextInput style={FeedBackStyle.input} placeholder="Hãy ghi các đóng góp ý kiến của bạn ở đây !"
                placeholderTextColor="#888"
                multiline={true} // Đảm bảo text không bị tràn màn hình mà xuống dòng
                textAlignVertical="top" // Đảm bảo text bắt đầu từ trên cùng
                value={feedback}
                onChangeText={(text) => setFeedback(text)}
            />
            <TouchableOpacity style={Styles.button} onPress={thanks}>
                <Text style={Styles.buttonText}>Gửi</Text>
            </TouchableOpacity>
        </View>
    );
}

export default FeedBack;