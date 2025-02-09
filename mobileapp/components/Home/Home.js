import { View, Text, TouchableOpacity, Image, ScrollView} from "react-native";
import React, { useContext } from "react";
import { MyAccountContext } from "../../configs/MyContext";
import Styles from "../../styles/Styles";

const Home = ({navigation}) =>{
    const [account] = useContext(MyAccountContext);
    const roomNumber = "0000";
    const locker = "Không có đồ";

    return (
        <View style={[Styles.containerNoCenter, {backgroundColor: "#fff", justifyContent: "space-between"}]}>
            {/* Header */}
            <View style={{alignItems: "center", marginTop: 20}}>
                <Image
                    source={require('../../assets/JpHome.png')} // Thay bằng ảnh phù hợp
                    style={Styles.imageLogo}
                />
                <Text style={Styles.title}>Chào mừng bạn đến với Chung cư tiện ích JpHome!</Text>
            </View>
    
            {/* Content */}
            <ScrollView style={{padding: 10}}>
                <Text style={Styles.description}>
                    Chung cư JpHome là biểu tượng của phong cách sống hiện đại, 
                    tiện nghi và đẳng cấp, tọa lạc tại vị trí đắc địa giữa trung tâm thành phố. 
                    Được thiết kế với cảm hứng từ kiến trúc Nhật Bản, JpHome mang đến không gian sống hài hòa giữa thiên nhiên và con người, 
                    với các tiện ích vượt trội đáp ứng đầy đủ nhu cầu của cư dân.
                </Text>
                <Text style={Styles.description}>
                    Hãy cùng chúng tôi xây dựng một thói quen mới và nâng cao chất lượng cuộc sống.
                </Text>
            </ScrollView>
    
            {/* Footer Login */}
            
            <View style={Styles.footer}>
                {account===null?<>
                    <TouchableOpacity style={Styles.button} onPress={() => navigation.navigate("login")}>
                        <Text style={Styles.buttonText}>Đăng nhập</Text>
                    </TouchableOpacity>
                </>:<>
                </>}
            </View>
            
        </View>
    );
}

export default Home;