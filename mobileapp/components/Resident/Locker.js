import { View, Text, Button, TouchableOpacity, ActivityIndicator } from "react-native";
import Styles from "../../styles/Styles";
import { useContext, useEffect, useState } from "react";
import { MyAccountContext } from "../../configs/MyContext";
import APIs, { endpoints } from "../../configs/APIs";

const Locker = ({navigation}) => {
    const accountState = useContext(MyAccountContext);
    const [loading, setLoading]= useState(false);
    const [locker, setLocker]=useState([]);

    const loadLocker = async () => {
        try {
            setLoading(true);
            let res = await APIs.get(endpoints['locker'](accountState));
            setLocker(res.data);

        } catch(ex) {
            console.error("Lỗi: ", ex);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        loadLocker();
    }, [accountState.id]);

    return (
        <View style={Styles.containerNoCenter}>
            <Text style={Styles.title}>QUẢN LÝ TỦ ĐỒ CÁ NHÂN</Text>
            {loading && <ActivityIndicator/>}
            <View style={Styles.row}>
                <Text style={[Styles.subtitle, {textAlign: "left"}]}>Mã tủ đồ: T-{locker.name}</Text>
                
            </View>
        </View>
    )
}
export default Locker;