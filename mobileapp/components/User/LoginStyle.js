import { StyleSheet } from "react-native";


export default StyleSheet.create({
    input:{
        width: "100%",
        height: 50,
        padding: 5,
        marginBottom: 10,
        marginTop: 10,
        
    },
    button: {
        width: "auto",
        height: 20,
        padding: 10,
        marginTop: 10,
        backgroundColor: 'hwb(0 0% 0%)', // Màu đỏ (hue 0) với không trắng hoặc đen
        color: 'hwb(0 0% 100%)', // Màu trắng
        textAlign: "center",
    }
});