import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
        padding: 20,
      },
      title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginVertical: 10,
      },
      subtitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#555",
        textAlign: "center",
        marginBottom: 20,
      },
      input: {
        flex: 1,
        backgroundColor: "#fff",
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        lineHeight: 22,
        color: "#333",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // Bóng đổ trên Android
      },
      button: {
        backgroundColor: "#0066cc",
        borderRadius: 8,
        paddingVertical: 12,
        marginTop: 20,
        alignItems: "center",
      },
      buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
      },
});