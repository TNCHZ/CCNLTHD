import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, SafeAreaView ,Image, ActivityIndicator} from 'react-native';
import StyleMomo from './StyleMomo';
import Styles from '../../styles/Styles';

const Momo = ({route}) => {
    const id = route.params.FeeID;
    const name = route.params.FeeName;
    const money = route.params.FeeValue;
    const merchantname = "Chung cư tiện ích JpHome";
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);


    const formatNumberToMoney = (number, defaultNum = "0", predicate = "VND") => {
        if (!number || isNaN(number)) return defaultNum + predicate;
        return new Intl.NumberFormat("vi-VN").format(number) + predicate;
    };

    const pickImage = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Quyền bị từ chối', 'Bạn cần cấp quyền truy cập vào thư viện ảnh.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync();
        if (!result.canceled) {
            setAvatar(result.assets[0]);
        } else {
            console.log('Bộ chọn hình ảnh đã bị hủy');
        }
    };

    const onPress = async () => {
        try {
            setLoading(true);
            
        } catch (error) {
            console.error("Lỗi thanh toán MoMo: ", error);
            setContent("Lỗi khi gửi yêu cầu thanh toán.");
        } finally {
            setLoading(false);
        }
    };
    //=======================================================================================
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'transparent', padding: 10}}>
        <View style={StyleMomo.container}>
            <View style={[{backgroundColor: 'transparent', alignItems:'center', justifyContent:'center', height: 200}]}>
                <Image style={{flex:1, width:200, height:200,}} source={require('../../stactic/momo.jpg')}/>
            </View>
            <Text style={[StyleMomo.text, { color: 'red', fontSize: 20 }]}>CHUNG CƯ TIỆN ÍCH JPHOME</Text>
            <Text style={[StyleMomo.text, { color: 'red', fontSize: 18 }]}>Cổng thanh toán momo</Text>
            <Text style={[StyleMomo.text, { color: '#000', fontSize: 14, marginVertical: 5, textAlign:'left', marginTop:20 }]}>Người nhận : {merchantname}</Text>
            <Text style={[StyleMomo.text, { color: '#000', fontSize: 14, marginVertical: 5, textAlign:'left' }]}>Tên Chi phí :{name}</Text>
            <Text style={[StyleMomo.text, { color: '#000', fontSize: 14, marginVertical: 5, textAlign:'left' }]}>Giá trị : {formatNumberToMoney(money, "0", " VND")}</Text>

            {/* <TouchableOpacity style={{ alignItems: "center" }} onPress={pickImage}>
                <Text style={Styles.title}>Chọn ảnh đại diện</Text>
                {avatar ? (
                    <Image source={{}} style={Styles.imageAvatar} />
                ) : (
                    <Text style={Styles.text}>Chưa có ảnh đại diện</Text>
                )}
            </TouchableOpacity> */}

            <TouchableOpacity onPress={onPress} style={StyleMomo.button} >
            {
                loading ?
                <Text style={StyleMomo.text}>Đang chờ phản hồi từ App MoMo</Text>
                :
                <Text style={StyleMomo.text}>Xác nhận thanh toán</Text>
            }
            </TouchableOpacity>
        </View>

        </SafeAreaView>
    );

};
export default Momo;