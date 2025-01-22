import { StyleSheet } from "react-native";


export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9", // Màu nền sáng
        padding: 20, // Khoảng cách xung quanh
    },
    title: {
        fontSize: 20, // Kích thước chữ cho tiêu đề
        fontWeight: "bold",
        color: "#000000",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#323232",
        marginBottom: 15,
    },
    list: {
        marginTop: 10,
    },
    touchable: {
        padding: 15, // Khoảng cách bên trong
        backgroundColor: "#e0f7fa", // Màu nền nhấn mạnh
        marginBottom: 10, // Khoảng cách giữa các mục
        borderRadius: 8, // Bo góc
    },
    text: {
        fontSize: 16,
        fontWeight: "500",
        color: "#00796b", // Màu chữ nổi bật
        textAlign: "center",
    },
});