import { ScrollView, View,  Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Styles from "../../styles/Styles";
import { useState } from "react";

const CheckSurvey = () => {
    const [selectedOption, setSelectedOption] = useState("all");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState([]);


    return (
        <View style={Styles.container}>
            <Text style={Styles.subtitle}>Khảo sát của dân cư</Text>
            <Picker selectedValue={selectedOption} style={Styles.input}
                onValueChange={(value) => setSelectedOption(value)}>
                <Picker.Item label="Tất cả dân cư" value="all" />
                <Picker.Item label="Từng dân cư" value="individual" />
            </Picker>

            {/* Nếu chọn "Từng dân cư" thì hiển thị danh sách với checkbox */}
            {selectedOption === "individual" && (
                <ScrollView style={{borderColor: "#ccc", borderWidth: 1, borderRadius: 8, marginTop: 10 }}>
                    {loading ? <Text>Đang tải danh sách...</Text> :
                        user.map((user) => (
                            <View>  </View>
                        ))
                    }
                </ScrollView>
            )}
        </View>
    );
}
export default CheckSurvey;