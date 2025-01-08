import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 16,
        //justifyContent: 'space-between', // Đẩy footer xuống cuối màn hình
    },
    text: {
        fontSize: 20,
        fontweight: "boid",
        color: "blue",
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginVertical: 10,
    },
});