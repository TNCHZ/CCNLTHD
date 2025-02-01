import React from "react";
import { View, Button } from "react-native";
import axios from "axios";
import { Alert } from "react-native";

// {
//     import json
//     import urllib.request
//     import urllib
//     import uuid
//     import requests
//     import hmac
//     import hashlib

//     # parameters send to MoMo get get payUrl
//     endpoint = "https://test-payment.momo.vn/v2/gateway/api/create"
//     partnerCode = "MOMO"
//     accessKey = "F8BBA842ECF85"
//     secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"
//     orderInfo = "pay with MoMo"
//     redirectUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b"
//     ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b"
//     amount = "50000"
//     orderId = str(uuid.uuid4())
//     requestId = str(uuid.uuid4())
//     requestType = "captureWallet"
//     extraData = ""  # pass empty value or Encode base64 JsonString

//     # before sign HMAC SHA256 with format: accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl
//     # &orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId
//     # &requestType=$requestType
//     rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType

//     # puts raw signature
//     print("--------------------RAW SIGNATURE----------------")
//     print(rawSignature)
//     # signature
//     h = hmac.new(bytes(secretKey, 'ascii'), bytes(rawSignature, 'ascii'), hashlib.sha256)
//     signature = h.hexdigest()
//     print("--------------------SIGNATURE----------------")
//     print(signature)

//     # json object send to MoMo endpoint

//     data = {
//         'partnerCode': partnerCode,
//         'partnerName': "Test",
//         'storeId': "MomoTestStore",
//         'requestId': requestId,
//         'amount': amount,
//         'orderId': orderId,
//         'orderInfo': orderInfo,
//         'redirectUrl': redirectUrl,
//         'ipnUrl': ipnUrl,
//         'lang': "vi",
//         'extraData': extraData,
//         'requestType': requestType,
//         'signature': signature
//     }
//     print("--------------------JSON REQUEST----------------\n")
//     data = json.dumps(data)
//     print(data)

//     clen = len(data)
//     response = requests.post(endpoint, data=data, headers={'Content-Type': 'application/json', 'Content-Length': str(clen)})

//     # f.close()
//     print("--------------------JSON response----------------\n")
//     print(response.json())

//     print(response.json()['payUrl'])
// }

const API_URL = "http://192.168.206.3:8000/payment"; // Địa chỉ server Django

const PaymentScreen = () => {
    const sendPaymentRequest = async (priceGlobal) => {
        try {
          const response = await axios.post(API_URL, {
            priceGlobal: priceGlobal,
          });
      
          if (response.data && response.data.payUrl) {
            // Mở trình duyệt đến URL thanh toán MoMo
            console.log("Redirecting to:", response.data.payUrl);
            Alert.alert("Thanh toán", "Mở trình duyệt để thanh toán", [
              { text: "OK", onPress: () => Linking.openURL(response.data.payUrl) },
            ]);
          }
        } catch (error) {
          console.error("Lỗi thanh toán:", error);
          Alert.alert("Lỗi", "Không thể kết nối đến server");
        }
      };

    return (
        <View>
        <Button
            title="Thanh toán MoMo"
            onPress={() => sendPaymentRequest(10000)} // Ví dụ 10,000 VND
        />
        </View>
    );
};

export default PaymentScreen;
