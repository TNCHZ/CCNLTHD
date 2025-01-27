import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000000',
    },
    subtitle: {
        fontSize: 22,
        fontWeight: "500",
        color: "#555",
        textAlign: "center",
        marginBottom: 5,
      },
    text: {
        fontSize: 18,
        fontweight: "boid",
        color: "blue",
    },
    input: {
        width: "100%",
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: "#fff",
        elevation: 10,
    },
    button: {
        width: '80%',
        height: 50,
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap", // Để các mục xuống dòng nếu không đủ chỗ
        justifyContent: "space-between", // Khoảng cách đều giữa các mục
        padding: 10, // Padding cho View chính
    },
    touchable: {
        marginVertical: 5, // Khoảng cách dọc giữa các nút
    },
    chip: {
        backgroundColor: "#64c8ff", // Màu nền của chip
        paddingHorizontal: 5, // Khoảng cách ngang trong chip
        paddingVertical: 2, // Khoảng cách dọc trong chip
        borderRadius: 20, // Bo góc
    },
    headerRight: {
        backgroundColor: "#00bebe",
        width: "auto",
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginRight: 10,
        elevation: 10,
    },
    dateText: {
        height: 50,
        lineHeight: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
        color: '#555',
    },
});