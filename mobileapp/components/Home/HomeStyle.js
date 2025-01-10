import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
        justifyContent: "space-between",
    },
    header: {
        alignItems: "center",
        marginTop: 20,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: "contain",
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    content: {
        padding: 10,
    },
    description: {
        fontSize: 14,
        color: "#555",
        textAlign: "center",
        marginBottom: 10,
        lineHeight: 24,
    },
    footer: {
        alignItems: "center",
        marginBottom: 0,
    },
    button: {
        backgroundColor: "#007BFF",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 10,
        width: "80%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});