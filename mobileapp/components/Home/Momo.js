import React, { Component, useEffect } from 'react';
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

// const Momo = () => {
//     const [textMoney, setTextMoney] = useState(formatNumberToMoney(amount, "0", "VND"));
//     const [money, setMoney] = useState(amount);
//     const [content, setContent] = useState("");
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         let isMounted = true; // Tránh cập nhật state nếu component đã ngắt kết nối
//         const listener = EventEmitter.addListener( 'RCTMoMoNoficationCenterRequestTokenReceived', (response) => {
//             console.log("<MoMoPay>Listen.Event::", JSON.stringify(response));
//             try {
//                 if (!isMounted) return;
//                 setLoading(true);
                
//                 if (response?.status === 0) {
//                     setContent(JSON.stringify(response));
//                     const momoToken = response.data;
//                     const phonenumber = response.phonenumber;
//                     const message = response.message;
//                     const orderId = response.refOrderId;
//                     const requestId = response.refRequestId;

//                     // Gửi dữ liệu momoToken, phonenumber lên server tại đây
//                 } else {
//                     setContent("Nhận mã thông báo không thành công");
//                 }
//             } catch (error) {
//                 console.error("Lỗi: ", error);
//             } finally {
//                 if (isMounted){
//                     setLoading(false);
//                 }
//             }
//         });

//         const tokenStateListener = EventEmitter.addListener( 'RCTMoMoNoficationCenterRequestTokenState', (response) => {
//                 console.log("<MoMoPay>Listen.RequestTokenState:: " + response.status);
//                 // status = 1: Thông số hợp lệ & sẵn sàng mở ứng dụng MoMo.
//                 // status = 2: canOpenURL không thành công đối với URL ứng dụng MoMo 
//                 // status = 3: Tham số không hợp lệ
//             }
//         );

//         return () => {
//             isMounted = false; // Đánh dấu component đã unmount
//             listener.remove(); // Gỡ bỏ listener
//             tokenStateListener.remove(); // Gỡ bỏ sự kiện khi component unmount
//         };
//     }, []);
    
//     const formatNumberToMoney = (number, defaultNum = "0", predicate = "") => {
//         if (!number || isNaN(number)) return defaultNum + predicate;
//         return new Intl.NumberFormat("vi-VN").format(number) + predicate;
//     };

//     const onPress = async () => {
//         if (loading) {
//             setContent(".....");
//             setLoading(false);
//             return;
//         }

//         setLoading(true);
//         setContent("");

//         let jsonData = {
//             enviroment: "0", // "0": SANDBOX , "1": PRODUCTION
//             action: "gettoken",
//             isDev: true, // SANDBOX only, remove this key on PRODUCTION 
//             merchantname: "Chung cư tiện ích JpHome",
//             merchantcode: "Chủ chung cư",
//             merchantnamelabel: "Nhà cung cấp",
//             description: "Tiền thuê căn hộ chung cư",
//             amount: 100000,
//             orderId: "bill234284290348",
//             requestId: "your_requestId",
//             orderLabel: "Ma don hang",
//             appScheme: "momocgv20170101", // iOS Only
//         };

//         console.log("data_request_payment ", JSON.stringify(jsonData));

//         try {
//             if (Platform.OS === "android") {
//                 let dataPayment = await reactNativeMomosdk.requestPayment(jsonData);
//                 momoHandleResponse(dataPayment);
//                 console.log("data_request_payment ", dataPayment.status);
//             } else {
//                 reactNativeMomosdk.requestPayment(JSON.stringify(jsonData));
//             }
//         } catch (error) {
//             console.error("Lỗi thanh toán MoMo: ", error);
//             setContent("Lỗi khi gửi yêu cầu thanh toán.");
//         }
//     };

//     const momoHandleResponse = async (response) => {
//         try {
//             if (response && response.status === 0) {
//                 let fromapp = response.fromapp; // ALWAYS: fromapp == momotransfer
//                 setContent(JSON.stringify(response));
                
//                 let momoToken = response.data;
//                 let phonenumber = response.phonenumber;
//                 let message = response.message;
                
//                 // Continue to submit momoToken, phonenumber to server
//             } else {
//                 setContent('Nhận mã thông báo không thành công');
//             }
//         } catch (error) {
//           console.error("Lỗi: ", error);
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     const onChangeText = (value) => {
//         let newValue = value.replace(/\./g, "").trim();
//         let formattedAmount = formatNumberToMoney(newValue);
//         setMoney(newValue);
//         setTextMoney(formattedAmount);
//         setContent("");
//     };

//     const generateQRCodeData = () => {
//         const data = {
//             "Chủ sở hữu": merchantname,
//             "Mã khách hàng": merchantcode,
//             "Số Tiền": amount,
//             orderId: "Aparment-0000",
//             "Nội dung": billdescription,
//         };

//         // Tạo chuỗi URL hoặc JSON để mã hóa vào mã QR
//         const qrCodeData = JSON.stringify(data);
//         return qrCodeData;
//     }


//     //=======================================================================================
//     return (
//         <SafeAreaView style={{flex: 1, backgroundColor: 'transparent', padding: 10}}>
//         <View style={StyleMomo.container}>
//             <View style={[{backgroundColor: 'transparent', alignItems:'center', justifyContent:'center', height: 100}]}>
//                 <Image style={{flex:1, width:100, height:100, borderRadius: 50,}} source={require('../../stactic/JpHome.png')}/>
//             </View>
//             <Text style={[StyleMomo.text, { color: 'red', fontSize: 20 }]}>CHUNG CƯ TIỆN ÍCH JPHOME</Text>
//             <Text style={[StyleMomo.text, { color: 'red', fontSize: 18 }]}>Cổng thanh toán momo</Text>
//             <Text style={[StyleMomo.text, { color: '#000', fontSize: 14, marginVertical: 5, textAlign:'left', marginTop:20 }]}>Số Căn Hộ : {merchantcode}</Text>
//             <Text style={[StyleMomo.text, { color: '#000', fontSize: 14, marginVertical: 5, textAlign:'left' }]}>"Tên : {merchantname}</Text>
//             <Text style={[StyleMomo.text, { color: '#000', fontSize: 14, marginVertical: 5, textAlign:'left' }]}>Loại Chi phí :{billdescription}</Text>
//             <View style={StyleMomo.formInput}>
//                 <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
//                     <Text style={{flex:1, fontSize: 18, paddingHorizontal:10}}>Tổng số tiền: </Text>
//                     <TextInput style={[StyleMomo.textInput, { flex: 1, paddingRight: 30 }]}
//                     autoFocus={true} maxLength={11}
//                     placeholderTextColor={"#929292"}
//                     placeholder={"Nhập số tiền"}
//                     keyboardType={"numeric"} returnKeyType="done"
//                     value={textAmount == 0 ? "" : textAmount}
//                     onChangeText={onChangeText}
//                     underlineColorAndroid="transparent"
//                     />
//                     <Text style={{ position: 'absolute', right: 20, fontSize: 20 }}>VND</Text>
//                 </View>
//             </View>

//             <TouchableOpacity onPress={onPress} style={StyleMomo.button} >
//             {
//                 loading ?
//                 <Text style={StyleMomo.text}>Đang chờ phản hồi từ App MoMo</Text>
//                 :
//                 <Text style={StyleMomo.text}>Xác nhận thanh toán</Text>
//             }
//             </TouchableOpacity>

//             { loading ?
//                 <ActivityIndicator size="small" color="#000" />
//                 : null
//             }
//             {
//             content != "" ?
//                 <Text style={[StyleMomo.text, { color: 'red' }]}>{content}</Text>
//                 : null
//             }
//             <View style={StyleMomo.container}>
//                 <Text style={[StyleMomo.text, {color: "#000"}]}>QR Code thanh toán Momo</Text>
//                 {/* Hiển thị mã QR */}
//                 <QRCode size={100}  // Kích thước mã QR
//                     value={generateQRCodeData()}  // Dữ liệu thanh toán cần mã hóa thành mã QR
//                 />
//             </View>
//         </View>

//         </SafeAreaView>
//     );

// };
// export default Momo;


export default class Momo extends Component {
    state = {
        textAmount: this.formatNumberToMoney(amount, null, ""),
        amount: amount,
        description: "",
        processing: false
    }

    componentDidMount(){
    // Listen for native events
        let me = this;
        EventEmitter.addListener('RCTMoMoNoficationCenterRequestTokenReceived', (response) => {
            console.log("<MoMoPay>Listen.Event::" + JSON.stringify(response));
            try{
                if (response && response.status == 0) {
                    let fromapp = response.fromapp; //ALWAYS:: fromapp==momotransfer
                    me.setState({ description: JSON.stringify(response), processing: false });
                    let momoToken = response.data;
                    let phonenumber = response.phonenumber;
                    let message = response.message;
                    let orderId = response.refOrderId; //your orderId
                    let requestId = response.refRequestId; //your requestId
                    //continue to submit momoToken,phonenumber to server
                } else {
                    me.setState({ description: "message: Get token fail", processing: false });
                }
            }catch(ex){}

        });
        
        //OPTIONAL
        EventEmitter.addListener('RCTMoMoNoficationCenterRequestTokenState',(response) => {
            console.log("<MoMoPay>Listen.RequestTokenState:: " + response.status);
            // status = 1: Parameters valid & ready to open MoMo app.
            // status = 2: canOpenURL failed for URL MoMo app 
            // status = 3: Parameters invalid
        })
    }

    formatNumberToMoney(number, defaultNum, predicate) {
        predicate = !predicate ? "" : "" + predicate;
        if (number == 0 || number == '' || number == null || number == 'undefined' ||
        isNaN(number) === true ||
        number == '0' || number == '00' || number == '000')
        return "0" + predicate;

        var array = [];
        var result = '';
        var count = 0;

        if (!number) {
        return defaultNum ? defaultNum : "" + predicate
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

        if (flag1)
        result = "-" + result;

        return result + predicate;
    }

    onPress = async () => {
        if (!this.state.processing){
        let jsonData = {};
        jsonData.enviroment = "0"; //"0": SANBOX , "1": PRODUCTION
        jsonData.action = "gettoken";
        jsonData.isDev = true; //SANBOX only , remove this key on PRODUCTION 
        jsonData.merchantname = merchantname;
        jsonData.merchantcode = merchantcode;
        jsonData.merchantnamelabel = merchantNameLabel;
        jsonData.description = billdescription;
        jsonData.amount = this.state.amount;
        jsonData.orderId = "bill234284290348";
        jsonData.requestId = "your_requestId";
        jsonData.orderLabel = "Ma don hang";
        jsonData.appScheme = "momocgv20170101";// iOS App Only , get from Info.plist > key URL types > URL Schemes. Check Readme
        console.log("data_request_payment " + JSON.stringify(jsonData));
        if (Platform.OS === 'android'){
            let dataPayment = await reactNativeMomosdk.requestPayment(jsonData);
            this.momoHandleResponse(dataPayment);
            console.log("data_request_payment " + dataPayment.status);
        }else{
            reactNativeMomosdk.requestPayment(JSON.stringify(jsonData));
        }
        this.setState({ description: "", processing: true });
        }
        else{
        this.setState({ description: ".....", processing: false });
        }
    }

    async momoHandleResponse(response){
        try{
        if (response && response.status == 0) {
            let fromapp = response.fromapp; //ALWAYS:: fromapp==momotransfer
            this.setState({ description: JSON.stringify(response), processing: false });
            let momoToken = response.data;
            let phonenumber = response.phonenumber;
            let message = response.message;
            //continue to submit momoToken,phonenumber to server
        } else {
            this.setState({ description: "message: Get token fail", processing: false });
        }
        }catch(ex){}
    }

    onChangeText = (value) => {
        let newValue = value.replace(/\./g, "").trim();
        let amount = this.formatNumberToMoney(newValue, null, "");
        this.setState({ amount: newValue, textAmount: amount, description: "" });
    }

    // Tạo dữ liệu QR Code
    generateQRCodeData() {
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
    }
//===========================================================================================
    render() {
        let { textAmount, description } = this.state; //Tạo dữ liệu sẵn cho null dựa trên các thông số trên
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
                    <TextInput style={[StyleMomo.textInput, { flex: 1, paddingRight: 30 }]}
                    autoFocus={true} maxLength={11}
                    placeholderTextColor={"#929292"}
                    placeholder={"Nhập số tiền"}
                    keyboardType={"numeric"} returnKeyType="done"
                    value={textAmount == 0 ? "" : textAmount}
                    onChangeText={this.onChangeText}
                    underlineColorAndroid="transparent"
                    />
                    <Text style={{ position: 'absolute', right: 20, fontSize: 20 }}>VND</Text>
                </View>
            </View>

            <TouchableOpacity onPress={this.onPress} style={StyleMomo.button} >
            {
                this.state.processing ?
                <Text style={StyleMomo.text}>Đang chờ phản hồi từ App MoMo</Text>
                :
                <Text style={StyleMomo.text}>Xác nhận thanh toán</Text>
            }
            </TouchableOpacity>

            { this.state.processing ?
                <ActivityIndicator size="small" color="#000" />
                : null
            }
            {
            description != "" ?
                <Text style={[StyleMomo.text, { color: 'red' }]}>{description}</Text>
                : null
            }
            <View style={StyleMomo.container}>
                <Text style={[StyleMomo.text, {color: "#000"}]}>QR Code thanh toán Momo</Text>
                {/* Hiển thị mã QR */}
                <QRCode size={100}  // Kích thước mã QR
                    value={this.generateQRCodeData()}  // Dữ liệu thanh toán cần mã hóa thành mã QR
                />
            </View>
        </View>

        </SafeAreaView>
        );
    }
}


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