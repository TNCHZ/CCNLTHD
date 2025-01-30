import { View, Text, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator, ScrollView } from "react-native";
import Styles from "../../styles/Styles";
import FeeStyles from "./FeeStyles";
import Items from "./Items";
import { Chip, Searchbar } from "react-native-paper";
import React, { useContext, useEffect, useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { MyAccountContext } from "../../configs/MyContext";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Fee = ({navigation}) => {
    const [accountState] = useContext(MyAccountContext);
    const [managingFees, setManagingFees] = useState([]);
    const [parkingFees, setParkingFees] = useState([]);
    const [serviceFees, setServiceFees] = useState([]);
    const [feeType, setFeeType] = useState('');
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState("");

//==========================================================================================
    const loadManagingFees = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) throw new Error("Không tìm thấy token");
            
            const url = `${endpoints['resident-information']}${accountState.id}/managing-fees/`;
            //Tìm managing_fee nếu q có giá trị
            if (q){
                url = `${url}&managing_fee&q=${q}`;
            }

            let res = await APIs.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setManagingFees(res.data);
            
        }catch(ex){
            console.error("Lỗi managingfees: ", ex);
        }finally{
            setLoading(false);
        }
    }

    const loadParkingFees = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) throw new Error("Không tìm thấy token");
            
            const url = `${endpoints['resident-information']}${accountState.id}/parking-fees/`;
            
            if (q){
                url = `${url}&parking_fee&q=${q}`;
            }

            let res = await APIs.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setParkingFees(res.data);

        }catch(ex){
            console.error("Lỗi ParkingFees",ex);
        }finally{
            setLoading(false);
        }
    }

    const loadServiceFees = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) throw new Error("Không tìm thấy token");
            
            const url = `${endpoints['resident-information']}${accountState.id}/service-fees/`;
            
            if (q){
                url = `${url}&service_fee&q=${q}`;
            }
            
            let res = await APIs.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setServiceFees(res.data);

        }catch(ex){
            console.error("Lỗi ParkingFees",ex);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        loadManagingFees();
        loadParkingFees();
        loadServiceFees();
    }, []);

    useEffect(() => {
        let timer = setTimeout(() => {
            if (accountState?.id){
                if (feeType === 'managingFees') {
                    loadManagingFees(); }
                if (feeType === 'parkingFees') {
                    loadParkingFees(); }
                if (feeType === 'serviceFees') {
                    loadManagingFees(); }
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [feeType, accountState , q]);
    //====================================================

    const getFeeData = () => {
        switch (feeType) {
            case 'managingFees':
                return managingFees;
            case 'parkingFees':
                return parkingFees;
            case 'serviceFees':
                return serviceFees;
            default:
                return [...managingFees, ...parkingFees, ...serviceFees]; // Tất cả dữ liệu
        }
    };

    const search = (value, callback) => {
        callback(value);
    }

    const refresh = () => {
        loadManagingFees();
        loadParkingFees();
        loadServiceFees();
    }


    return (
        <View style={FeeStyles.container}>
            <View style={Styles.row}>
                <TouchableOpacity style={Styles.touchable} onPress={() => setFeeType('managingFees')}>
                    <Chip style={Styles.chip} icon="clipboard-text">Phí Quản Lí</Chip>
                </TouchableOpacity>
                <TouchableOpacity style={Styles.touchable} onPress={() => setFeeType('parkingFees')}>
                    <Chip style={Styles.chip} icon="clipboard-text">Phí Đỗ Xe</Chip> 
                </TouchableOpacity>
                <TouchableOpacity style={Styles.touchable} onPress={() => setFeeType('serviceFees')}>
                    <Chip style={Styles.chip} icon="clipboard-text">Phí Dịch Vụ</Chip> 
                </TouchableOpacity>
                <TouchableOpacity style={Styles.touchable} onPress={() => setFeeType('')}>
                    <Chip style={Styles.chip} icon="label-outline">Tất cả chi phí</Chip> 
                </TouchableOpacity>
            </View>
            
            <Searchbar style={{marginVertical: 2}} placeholder="Tìm kiếm ..." value={q} onChange={t => search(t, setQ)}/>
            {loading && <ActivityIndicator />}

            <Text style={Styles.text}>Danh sách chi phí</Text>
            <FlatList refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
                data={getFeeData()} 
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => <Items item={item} routeName={feeType === 'managingFees' ? 'managingFeeDetail'
                    : feeType === 'parkingFees' ? 'parkingFeeDetail' : 'serviceFeeDetail'
                } params={{'managingFeeID': item.id, 'parkingFeeID': item.id, 'serviceFeeID': item.id, }} />}
            />
        </View>
    );
}
export default Fee;