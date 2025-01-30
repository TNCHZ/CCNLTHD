import { useNavigation } from "@react-navigation/native";
import { List } from "react-native-paper";
import moment from "moment";
import { Image, TouchableOpacity, View, Text } from "react-native";
import Styles from "../../styles/Styles";

const Items = ({item, routeName, params}) => {
    const nav = useNavigation();
    return(
        <List.Item key={item.id}
            title={() => (
                <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
                    {item.value && (
                        <Text style={{ fontSize: 14, color: 'gray', marginTop: 4 }}>
                            {`Value: ${item.value}`}
                        </Text>
                    )}
                    <Text>Giá trị: {item.fee_value.value} VNĐ</Text>
                    <Text>Trạng thái: {item.status ? "Đã thanh toán" : "Chưa thanh toán"}</Text>
                </View>
            )}
            description={item.created_date && moment(item.created_date).fromNow()} 
            left={porps => (
                <TouchableOpacity onPress={() => {nav.navigate(routeName, params)}}>
                    <Image source={{uri: item.image}} style={Styles.box}/>
                </TouchableOpacity>
            )}    
        />
    );
}

export default Items;