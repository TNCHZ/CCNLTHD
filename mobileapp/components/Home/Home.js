import { View, Text, TextInput, Button} from "react-native";
import Styles from "../../styles/Styles";
import React from "react";

const Home = () =>{
    return (
        <View style={Styles.container}>
            <View >
            {/* Content */}
                <Text>Đây là content</Text>
                <TextInput placeholder="Nhập vô đây" style={Styles.input} />
                <Button title="123" onPress={() => console.log("Button pressed")} />
            </View>
            
            {/* Footer */}
            <View style={Styles.footer}>
                <Text>Đây là footer</Text>
            </View>
        </View>
    );
}

export default Home;