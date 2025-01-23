import { Button, View } from "react-native";
import Styles from "../../styles/Styles";

const Profile = ({navigation}) => {
    return(
        <View style={Styles.container}>


            <Button style={Styles.foodter} title="Đăng xuất" onPress={() => navigation.navigate("logout")}/>
        </View>
    );
};

export default Profile;