import { Button, Text, TextInput, View } from "react-native";
import Styles from "../../styles/Styles";
import React, { useState } from "react";

const Create_Fee = () => {

    const numberToWords = (num) => {
        const units = [ //hàng đơn vị
          '', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín',
        ];
        const tens = [ //hàng chục
          '', '', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi',
        ];
        const scales = ['', 'nghìn', 'triệu', 'tỷ']; //hàng giá trị
      
        if (num === 0) return 'không';

        let numStr = num.toString();
        const groups = [];
        while (numStr.length > 0) {
            groups.unshift(numStr.slice(-3));
            numStr = numStr.slice(0, -3);
        }
      
        let result = ''; //Text value
        for (let i = 0; i < groups.length; i++) {
            const group = parseInt(groups[i], 10);
            if (group === 0) continue;
        
            const hundred = Math.floor(group / 100);
            const ten = Math.floor((group % 100) / 10);
            const unit = group % 10;
        
            const groupStr = [];
            if (hundred) groupStr.push(units[hundred] + ' trăm');
            if (ten || unit) {
                if (ten) {
                    groupStr.push(tens[ten]);
                } else if (hundred && !ten && unit) {
                    groupStr.push('lẻ');
                }
                if (unit) {
                    if (ten && unit === 1) {
                        groupStr.push('mốt');
                    } else if (ten && unit === 5) {
                        groupStr.push('lăm');
                    } else {
                        groupStr.push(units[unit]);
                    }
                }
            }
          result += groupStr.join(' ') + ' ' + scales[groups.length - i - 1] + ' ';
        }
        return result.trim();
    };

    const [number, setNumber] = useState('');
    const [text, setText] = useState('0');
    const handleChange = (value) => {
        const num = parseInt(value.replace(/[^0-9]/g, ''), 10); // Chỉ lấy số
        if (!isNaN(num)) {
            setNumber(value);
            setText(numberToWords(num));
        } else {
            setNumber('');
            setText('');
        }
    };

    return(
        <View style={Styles.container}>
            <Text style={Styles.title}>Phiếu đóng tiền</Text>
            <TextInput style={Styles.input} placeholder="Nhập Tên Phí" />

            <View style={Styles.row}>
                <TextInput style={[Styles.input, {width: "80%"}]} placeholder="Nhập số tiền"
                keyboardType="numeric"value={number} onChangeText={handleChange} />
                <Text style={[Styles.subtitle, {widht: "20%", marginLeft: 10}]}>VND</Text>
            </View>
            <Text style={Styles.text}>{text} đồng</Text>
            
            <View style={Styles.row}>
                <Text style={[Styles.subtitle,{width: "40%"}]}>Số Căn Hộ:</Text>
                <TextInput style={[Styles.input, {width: "60%"}]} placeholder="Nhập Số Căn Hộ (0000)"/>
            </View>
            <Button title="Lưu"/>
        </View>
    );
}
export default Create_Fee;