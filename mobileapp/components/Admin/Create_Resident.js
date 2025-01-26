import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import Styles from '../../styles/Styles';

const Create_Resident = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const register = () => {
        if (!username || !email || !password || !confirmPassword) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Lỗi', 'Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }
        
        // Giả sử quá trình đăng ký thành công
        Alert.alert('Thông báo', 'Đăng ký thành công!');
    };

    return (
        <View style={Styles.container}>
            <Text style={Styles.title}>Đăng ký tài khoản</Text>
            <View style={Styles.row}>
                <Text>Tên người dùng</Text>
                <TextInput style={Styles.input} placeholder="Nhập tên người dùng" value={username} onChangeText={setUsername}/>
            </View>

            <View style={Styles.row}>
                <Text>Email</Text>
                <TextInput style={Styles.input} placeholder="Nhập email của bạn" value={email} onChangeText={setEmail} />
            </View>

            <View style={Styles.row}>
                <Text>Mật khẩu</Text>
                <TextInput style={Styles.input} placeholder="Nhập mật khẩu" secureTextEntry value={password} onChangeText={setPassword} />
            </View>

            <View style={Styles.row}>
                <Text>Xác nhận mật khẩu</Text>
                <TextInput style={Styles.input} placeholder="Xác nhận mật khẩu" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
            </View>

            <TouchableOpacity style={Styles.button} >
                <Text style={Styles.buttonText}>Đăng Ký</Text>
            </TouchableOpacity>
        </View>
    );
}
export default Create_Resident;