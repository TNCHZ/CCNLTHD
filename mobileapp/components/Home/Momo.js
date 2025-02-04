import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Image, NativeModules, NativeEventEmitter, ActivityIndicator } from 'react-native';
import RNMomosdk from 'react-native-momosdk';

const RNMoMoPaymentModule = NativeModules.RNMomosdk;
const EventEmitter = new NativeEventEmitter(RNMoMoPaymentModule);

const merchantname = "CGV Cinemas";
const merchantcode = "CGV01";
const billdescription = "Fast and Furious 8";
const amount = 10000;
const environment = "0"; // 0: sandbox, 1: production

const App = () => {
    const formatNumberToMoney = (number, defaultNum, predicate) => {
        predicate = predicate || "";
        if (number === 0 || number === '' || number === null || isNaN(number)) return "0" + predicate;

        let array = [];
        let count = 0;
        let result = '';
        let numberString = number.toString();

        if (numberString.length < 3) {
            return numberString + predicate;
        }

        for (let i = numberString.length - 1; i >= 0; i--) {
            count += 1;
            if (numberString[i] === "." || numberString[i] === ",") {
                array.push(',');
                count = 0;
            } else {
                array.push(numberString[i]);
            }
            if (count === 3 && i >= 1) {
                array.push('.');
                count = 0;
            }
        }

        for (let i = array.length - 1; i >= 0; i--) {
            result += array[i];
        }
        return result + predicate;
    }

    const [textAmount, setTextAmount] = useState(formatNumberToMoney(amount, null, ""));
    const [amountState, setAmountState] = useState(amount);
    const [description, setDescription] = useState("");
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        console.log(RNMoMoPaymentModule)
        const listener = EventEmitter.addListener('RCTMoMoNoficationCenterRequestTokenReceived', (response) => {
            console.log("<MoMoPay>Listen.Event::" + JSON.stringify(response));
            if (response && response.status === 0) {
                let momoToken = response.data;  // Đây là token bạn cần
                let phonenumber = response.phonenumber;  // Số điện thoại của người thanh toán
                let orderId = response.refOrderId;  // ID đơn hàng
                let requestId = response.refRequestId;  // ID yêu cầu

                // Lưu token vào trạng thái hoặc xử lý tiếp theo
                setDescription(`Token: ${momoToken}`);
            } else {
                setDescription("Lỗi: Không lấy được token");
            }
            setProcessing(false);
        });

        return () => listener.remove(); // Cleanup khi component bị unmount
    }, []);

    const onPress = async () => {
        if (!processing) {
            let jsonData = {
                environment, // Môi trường (0: sandbox, 1: production)
                action: "gettoken",  // Hành động lấy token
                isDev: true,  // Cờ xác định môi trường phát triển
                merchantname,
                merchantcode,
                description: billdescription,
                amount: amountState,
                orderId: "bill234284290348",  // ID đơn hàng
                requestId: "your_requestId",  // ID yêu cầu
                orderLabel: "Ma don hang",  // Nhãn đơn hàng
                appScheme: "momocgv20170101"  // Scheme của app MoMo
            };

            // Gửi yêu cầu thanh toán và nhận phản hồi
            let dataPayment = await RNMomosdk.requestPayment(jsonData);
            console.log("data_request_payment " + dataPayment.status);

            if (Platform.OS === 'android') {
                // Xử lý phản hồi từ MoMo cho Android
                if (dataPayment.status === 0) {
                    momoHandleResponse(dataPayment);
                } else {
                    setDescription("Lỗi khi gửi yêu cầu thanh toán");
                }
            } else {
                // Xử lý cho iOS nếu cần
                RNMomosdk.requestPayment(JSON.stringify(jsonData));
            }

            setDescription("");
            setProcessing(true);
        } else {
            setDescription("Đang xử lý...");
            setProcessing(false);
        }
    };

    const momoHandleResponse = (response) => {
        if (response && response.status === 0) {
            let momoToken = response.data;  // Token thanh toán
            setDescription(`Token: ${momoToken}`);
        } else {
            setDescription("Lỗi: Không lấy được token");
        }
        setProcessing(false);
    };

    const onChangeText = (value) => {
        let newValue = value.replace(/\./g, "").trim();
        let amountFormatted = formatNumberToMoney(newValue, null, "");
        setAmountState(newValue);
        setTextAmount(amountFormatted);
        setDescription("");
    };

    return (
        <SafeAreaView style={{ flex: 1, marginTop: 50, backgroundColor: 'transparent' }}>
            <View style={styles.container}>
                <View style={[{ backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', height: 100 }]}>
                    <Image style={{ flex: 1, width: 100, height: 100 }} source={require('../../stactic/JpHome.png')} />
                </View>
                <Text style={[styles.text, { color: 'red', fontSize: 20 }]}>{"MOMO DEVELOPMENT"}</Text>
                <Text style={[styles.text, { color: 'red', fontSize: 18 }]}>{"React native version"}</Text>
                <Text style={[styles.text, { color: '#000', fontSize: 14, marginVertical: 5, textAlign: 'left', marginTop: 20 }]}>{"MerchantCode : " + merchantcode}</Text>
                <Text style={[styles.text, { color: '#000', fontSize: 14, marginVertical: 5, textAlign: 'left' }]}>{"MerchantName : " + merchantname}</Text>
                <Text style={[styles.text, { color: '#000', fontSize: 14, marginVertical: 5, textAlign: 'left' }]}>{"Description : " + billdescription}</Text>
                <View style={styles.formInput}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ flex: 1, fontSize: 18, paddingHorizontal: 10 }}>{"Total amount"}</Text>
                        <TextInput
                            autoFocus={true}
                            maxLength={10}
                            placeholderTextColor={"#929292"}
                            placeholder={"Enter amount"}
                            keyboardType={"numeric"}
                            returnKeyType="done"
                            value={textAmount === 0 ? "" : textAmount}
                            style={[styles.textInput, { flex: 1, paddingRight: 30 }]}
                            onChangeText={onChangeText}
                            underlineColorAndroid="transparent"
                        />
                        <Text style={{ position: 'absolute', right: 20, fontSize: 30 }}>{"đ"}</Text>
                    </View>
                </View>

                <TouchableOpacity onPress={onPress} style={styles.button}>
                    {
                        processing ?
                            <Text style={styles.textGrey}>Waiting response from MoMo App</Text>
                            :
                            <Text style={styles.text}>Confirm Payment</Text>
                    }
                </TouchableOpacity>
                {processing ? <ActivityIndicator size="small" color="#000" /> : null}
                {description && <Text style={[styles.text, { color: 'red' }]}>{description}</Text>}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2'
    },
    textInput: {
        fontSize: 16,
        marginHorizontal: 15,
        marginTop: 5,
        height: 40,
        paddingBottom: 2,
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

export default App;
