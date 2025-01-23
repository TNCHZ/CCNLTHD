import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center", // Căn giữa theo trục dọc
        alignItems: "center", // Căn giữa theo trục ngang
        backgroundColor: "#f9f9f9", // Màu nền
        padding: 20,
    },
    title: {
        fontSize: 20, // Kích thước chữ lớn
        fontWeight: "bold", // Chữ đậm
        color: "#333", // Màu chữ tối
        textAlign: "center",
        marginBottom: 20, // Khoảng cách dưới tiêu đề
    },
});