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
    header: {
        width: '100%',
        height: 50,
        top: 0,
        backgroundColor: '#0288D1',
        justifyContent:'center',
        alignItems:'center',
    },
    headerStyle: {
        fontSize: 25,
        textAlign: 'center',
        color: '#fff',
    },
    content: {
        
    },
    footer: {
        width: '100%',
        height: 50,
        backgroundColor: '#00FFFF',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute', // Footer cố định ở cuối màn hình
        bottom: 0,

        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 8,
        padding: 10,
        marginVertical: 10,
      },
});