import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2'
  },
  textInput: {
    fontSize: 18,
    marginHorizontal: 15,
    marginTop: 5,
    height: 40,
    paddingBottom: 5,
    borderBottomColor: '#dadada',
    borderBottomWidth: 1,
  },
  formInput: {
    backgroundColor: '#FFF',
    borderBottomColor: '#dadada',
    borderTopColor: '#dadada',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#b0006d',
    borderRadius: 4,
    marginHorizontal: 40,
    marginVertical: 10
  },
  text: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 10
  },
  textGrey: {
    color: "grey",
    fontSize: 18,
    textAlign: 'center',
  }
});