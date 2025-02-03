import { useNavigation } from "@react-navigation/native";
import { List } from "react-native-paper";
import moment from "moment";
import { Image, TouchableOpacity, View, Text } from "react-native";
import Styles from "../../styles/Styles";

const Items = ({item, routeName, params}) => {
    const nav = useNavigation();
    return(
        <List.Item key={`${item.id}-${item.name}`}
            title={() => (
                <TouchableOpacity onPress={() => {nav.navigate(routeName, params)}}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
                    {item.fee_value && (
                        <Text style={{ fontSize: 14, color: 'gray', marginTop: 4 }}>
                            Giá trị: {`Value: ${item.fee_value}`} VND
                        </Text>
                    )}
                    <Text>Trạng thái: {item.status ? "Đã thanh toán" : "Chưa thanh toán"}</Text>
                </TouchableOpacity>
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