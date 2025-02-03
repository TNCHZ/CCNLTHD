import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, TextInput, DeviceEventEmitter,
  SafeAreaView ,Image, NativeModules, NativeEventEmitter, ActivityIndicator} from 'react-native';
import reactNativeMomosdk from 'react-native-momosdk';
import QRCode from 'react-native-qrcode-svg';
import StyleMomo from './StyleMomo';

const RNMoMoPaymentModule = NativeModules.reactNativeMomosdk;
const EventEmitter = new NativeEventEmitter(RNMoMoPaymentModule);
const merchantname = "Chung cư tiện ích JpHome";
const merchantcode = "Chủ chung cư";
const merchantNameLabel = "Nhà cung cấp";
const billdescription = "Tiền thuê căn hộ chung cư";
const amount = 100000;
const enviroment = "0"; //"1": production

const Momo = () => {
    const [textAmount, setTextAmount] = useState(formatNumberToMoney(amount, null, ""));
    const [amountState, setAmount] = useState(amount);
    const [description, setDescription] = useState("");
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const listenerTokenReceived = EventEmitter.addListener('RCTMoMoNoficationCenterRequestTokenReceived', (response) => {
        console.log("<MoMoPay>Listen.Event::" + JSON.stringify(response));
        try {
            if (response && response.status == 0) {
            setDescription(JSON.stringify(response));
            setProcessing(false);
            let momoToken = response.data;
            let phonenumber = response.phonenumber;
            let message = response.message;
            let orderId = response.refOrderId;
            let requestId = response.refRequestId;
            } else {
            setDescription("message: Get token fail");
            setProcessing(false);
            }
        } catch (ex) {}
        });

        const listenerTokenState = EventEmitter.addListener('RCTMoMoNoficationCenterRequestTokenState', (response) => {
        console.log("<MoMoPay>Listen.RequestTokenState:: " + response.status);
        });

        return () => {
        listenerTokenReceived.remove();
        listenerTokenState.remove();
        };
    }, []);

    const formatNumberToMoney = (number, defaultNum, predicate) => {
        predicate = !predicate ? "" : "" + predicate;
        if (number == 0 || number == '' || number == null || number == 'undefined' ||
        isNaN(number) === true || number == '0' || number == '00' || number == '000') return "0" + predicate;

        var array = [];
        var result = '';
        var count = 0;

        if (!number) {
        return defaultNum ? defaultNum : "" + predicate;
        }

        let flag1 = false;
        if (number < 0) {
        number = -number;
        flag1 = true;
        }

        var numberString = number.toString();
        if (numberString.length < 3) {
        return numberString + predicate;
        }

        for (let i = numberString.length - 1; i >= 0; i--) {
        count += 1;
        if (numberString[i] == "." || numberString[i] == ",") {
            array.push(',');
            count = 0;
        } else {
            array.push(numberString[i]);
        }
        if (count == 3 && i >= 1) {
            array.push('.');
            count = 0;
        }
        }

        for (let i = array.length - 1; i >= 0; i--) {
        result += array[i];
        }

        if (flag1) result = "-" + result;

        return result + predicate;
    };

    const onPress = async () => {
        if (!processing) {
        let jsonData = {};
        jsonData.enviroment = "0"; //"0": SANBOX , "1": PRODUCTION
        jsonData.action = "gettoken";
        jsonData.isDev = true; //SANBOX only , remove this key on PRODUCTION 
        jsonData.merchantname = merchantname;
        jsonData.merchantcode = merchantcode;
        jsonData.merchantnamelabel = merchantNameLabel;
        jsonData.description = billdescription;
        jsonData.amount = amountState;
        jsonData.orderId = "bill234284290348";
        jsonData.requestId = "your_requestId";
        jsonData.orderLabel = "Ma don hang";
        jsonData.appScheme = "momocgv20170101"; // iOS App Only, get from Info.plist > key URL types > URL Schemes. Check Readme

        console.log("data_request_payment " + JSON.stringify(jsonData));

        if (Platform.OS === 'android') {
            let dataPayment = await reactNativeMomosdk.requestPayment(jsonData);
            momoHandleResponse(dataPayment);
            console.log("data_request_payment " + dataPayment.status);
        } else {
            reactNativeMomosdk.requestPayment(JSON.stringify(jsonData));
        }
        setDescription("");
        setProcessing(true);
        } else {
        setDescription(".....");
        setProcessing(false);
        }
    };

    const momoHandleResponse = async (response) => {
        try {
        if (response && response.status == 0) {
            setDescription(JSON.stringify(response));
            setProcessing(false);
            let momoToken = response.data;
            let phonenumber = response.phonenumber;
            let message = response.message;
            // continue to submit momoToken,phonenumber to server
        } else {
            setDescription("message: Get token fail");
            setProcessing(false);
        }
        } catch (ex) {}
    };

    const onChangeText = (value) => {
        let newValue = value.replace(/\./g, "").trim();
        let formattedAmount = formatNumberToMoney(newValue, null, "");
        setAmount(newValue);
        setTextAmount(formattedAmount);
        setDescription("");
    };

    // Tạo dữ liệu QR Code
    const generateQRCodeData = () => {
        const data = {
        "Chủ sở hữu": merchantname,
        "Mã khách hàng": merchantcode,
        "Số Tiền": amount,
        orderId: "Aparment-0000",
        "Nội dung": billdescription,
        };

        // Tạo chuỗi URL hoặc JSON để mã hóa vào mã QR
        const qrCodeData = JSON.stringify(data);
        return qrCodeData;
    };

    return (
        <SafeAreaView style={{flex: 1, marginTop: 30, backgroundColor: 'transparent', padding: 10}}>
        <View style={StyleMomo.container}>
            <View style={[{backgroundColor: 'transparent', alignItems:'center', justifyContent:'center', height: 100}]}>
            <Image style={{flex:1, width:100, height:100, borderRadius: 50,}} source={require('../../stactic/JpHome.png')}/>
            </View>
            <Text style={[StyleMomo.text, { color: 'red', fontSize: 20 }]}>CHUNG CƯ TIỆN ÍCH JPHOME</Text>
            <Text style={[StyleMomo.text, { color: 'red', fontSize: 18 }]}>Cổng thanh toán momo</Text>
            <Text style={[StyleMomo.text, { color: '#000', fontSize: 14, marginVertical: 5, textAlign:'left', marginTop:20 }]}>Số Căn Hộ : {merchantcode}</Text>
            <Text style={[StyleMomo.text, { color: '#000', fontSize: 14, marginVertical: 5, textAlign:'left' }]}>"Tên : {merchantname}</Text>
            <Text style={[StyleMomo.text, { color: '#000', fontSize: 14, marginVertical: 5, textAlign:'left' }]}>Loại Chi phí :{billdescription}</Text>
            <View style={StyleMomo.formInput}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{flex:1, fontSize: 18, paddingHorizontal:10}}>Tổng số tiền: </Text>
                <TextInput
                style={[StyleMomo.textInput, { flex: 1, paddingRight: 30 }]}
                autoFocus={true} maxLength={11}
                placeholderTextColor={"#929292"}
                placeholder={"Nhập số tiền"}
                keyboardType={"numeric"} returnKeyType="done"
                value={textAmount == 0 ? "" : textAmount}
                onChangeText={onChangeText}
                underlineColorAndroid="transparent"
                />
                <Text style={{ position: 'absolute', right: 20, fontSize: 20 }}>VND</Text>
            </View>
            </View>

            <TouchableOpacity onPress={onPress} style={StyleMomo.button}>
            {processing ? (
                <Text style={StyleMomo.text}>Đang chờ phản hồi từ App MoMo</Text>
            ) : (
                <Text style={StyleMomo.text}>Xác nhận thanh toán</Text>
            )}
            </TouchableOpacity>

            {processing ? <ActivityIndicator size="small" color="#000" /> : null}
            {description != "" ? <Text style={[StyleMomo.text, { color: 'red' }]}>{description}</Text> : null}

            <View style={StyleMomo.container}>
            <Text style={[StyleMomo.text, {color: "#000"}]}>QR Code thanh toán Momo</Text>
            <QRCode size={100} value={generateQRCodeData()} />
            </View>
        </View>
        </SafeAreaView>
    );
};

export default Momo;


// Kết quả trả vê
//data_request_payment {
// "enviroment":"0",
// "action":"gettoken",
// "isDev":true,
// "merchantname":"CGV Cinemas",
// "merchantcode":"CGV01",
// "merchantnamelabel":"Nhà cung cấp",
// "description":"Fast and Furious 8",
// "amount":50000,
// "orderId":"bill234284290348",
// "requestId":"your_requestId",
// "orderLabel":"Ma don hang",
// "appScheme":"momocgv20170101"}

//===========================================================================================