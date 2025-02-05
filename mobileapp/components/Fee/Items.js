import { useNavigation } from "@react-navigation/native";
import { List } from "react-native-paper";
import moment from "moment";
import { Image, TouchableOpacity, View, Text } from "react-native";
import Styles from "../../styles/Styles";

const Items = ({ item, routeName, params }) => {
    const nav = useNavigation();
    
    return (
        <List.Item style={{borderColor: "#ccc", borderWidth: 1, borderRadius: 8,}}
            title={() => (
                <View>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.name}</Text>
                    {item.fee_value && (
                        <Text style={{ fontSize: 14, color: "gray", marginTop: 4 }}>
                            Giá trị: {`Value: ${item.fee_value}`} VND
                        </Text>
                    )}
                    <Text>Trạng thái: {item.status ? "Đã thanh toán" : "Chưa thanh toán"}</Text>
                </View>
            )}
            description={item.created_date ? moment(item.created_date).fromNow() : "Không có ngày"}
            left={(props) => (
                <Image
                    {...props}
                    source={{ uri: item.image }}
                    style={{ width: 40, height: 40, borderRadius: 8, marginRight: 10 }}
                />
            )}
            right={(props) =>
                !item.status ? (
                    <TouchableOpacity style={{backgroundColor: "#007bff", justifyContent: "center",
                        alignItems: "center", borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12,}}
                        onPress={() => {
                            console.log("Navigating with:", params);
                            nav.navigate(routeName, params);
                        }}>
                        <Text style={{ color: "white", fontWeight: "bold" }}>Thanh Toán</Text>
                    </TouchableOpacity>
                ) : null
            }
        />
    );
};

export default Items;