import { StyleSheet } from "react-native";

export default StyleSheet.create({
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
    marginVertical: 5,
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
    elevation: 2, // Bóng đổ trên Android
  },
});