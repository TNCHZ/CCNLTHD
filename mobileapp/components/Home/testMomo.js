const testMomo = () => {
    //link xem: https://www.youtube.com/watch?v=Wts0ic42bSU

    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    //parameters

    //Momo cung cấp example của momo
    var partnerCode = "MOMO";
    var accessKey = "F8BBA842ECF85";
    var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    //Chuỗi ngẫu nhiên để phân biệt cái request
    var requestId = partnerCode + new Date().getTime();
    //mã đơn hàng
    var orderId = requestId;
    var orderInfo = "pay with MoMo";
    //cung cấp page khi thanh toán xong sẽ tới
    var redirectUrl = "https://momo.vn/return";
    //page thanks
    var ipnUrl = "https://callback.url/notify";
    // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
    // Biến số dư tài khoản
    var amount = "10000000";
    // Show thông tin thẻ, dưới QR, trên điền form
    var requestType = "captureWallet"
    var extraData = ""; //pass empty value if your merchant does not have stores

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    //biến lớn tổng hợp các biến trên
    var rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)
    //signature

    //Tạo ra thuật toán
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretkey) //secretkey của momo cung cấp sẵn
        .update(rawSignature)
        .digest('hex'); //chữ ký chuyển sang mã 16
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)

    //json object send to MoMo endpoint //gửi những thông tin lên API của momo
    const requestBody = JSON.stringify({
        partnerCode : partnerCode,
        accessKey : accessKey,
        requestId : requestId,
        amount : amount,
        orderId : orderId,
        orderInfo : orderInfo,
        redirectUrl : redirectUrl,
        ipnUrl : ipnUrl,
        extraData : extraData,
        requestType : requestType,
        signature : signature,
        lang: 'en'
    });

    //Create the HTTPS objects //tạo server, https để call các API khác và của Momo
    const https = require('https');
    //Yêu cầu truyền đi
    const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        }
    }
    //Send the request and get the response // Gửi yêu cầu và lấy kết quả trả về từ momo
    const req = https.request(options, res => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        // trả về body là khi mình call momo
        res.on('data', (body) => {
            console.log('Body: ');
            console.log(body);
            console.log('payUrl: ');
            //url đến thanh toán momo
            console.log(JSON.parse(body).payUrl);
        });
        //Dùng để bắt lỗi
        res.on('end', () => {
            console.log('No more data in response.');
        });
    })

    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });
    // write data to request body
    console.log("Sending....")
    req.write(requestBody);
    req.end();
};
export default testMomo;