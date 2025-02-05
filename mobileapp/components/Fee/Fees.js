import { View, Text, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator, ScrollView } from "react-native";
import Styles from "../../styles/Styles";
import Items from "./Items";
import { Chip, Searchbar } from "react-native-paper";
import React, { useContext, useEffect, useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { MyAccountContext } from "../../configs/MyContext";


const Fee = ({ navigation }) => {
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
            let url = `${endpoints['managing-fees'](accountState)}`

            if (q) {
                url = `${url}q=${q}`;
            }

            let res = await APIs.get(url);
            setManagingFees(res.data);

        } catch (ex) {
            console.error("Lỗi Managingfees: ", ex);
        } finally {
            setLoading(false);
        }
    }

    const loadParkingFees = async () => {
        setLoading(true);
        try {
            let url = `${endpoints['parking-fees'](accountState)}`

            if (q) {
                url = `${url}q=${q}`;
            }

            let res = await APIs.get(url);

            setParkingFees(res.data);

        } catch (ex) {
            console.error("Lỗi ParkingFees", ex);
        } finally {
            setLoading(false);
        }
    }

    const loadServiceFees = async () => {
        setLoading(true);
        try {
            let url = `${endpoints['service-fees'](accountState)}`

            if (q) {
                url = `${url}q=${q}`;
            }

            let res = await APIs.get(url);

            setServiceFees(res.data);

        } catch (ex) {
            console.error("Lỗi ServiceFee", ex);
        } finally {
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
            if (accountState?.id) {
                if (feeType === 'managingFees') {
                    loadManagingFees();
                }
                if (feeType === 'parkingFees') {
                    loadParkingFees();
                }
                if (feeType === 'serviceFees') {
                    loadServiceFees();
                }
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [feeType, accountState, q]);
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
                return [...managingFees, ...parkingFees, ...serviceFees].filter(fee => fee.status === false && fee.fee_image === "");
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
        <View style={Styles.containerNoCenter}>
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
                    <Chip style={Styles.chip} icon="label-outline">Các Phí Chưa Thanh Toán</Chip>
                </TouchableOpacity>
            </View>

            <Searchbar style={{ marginVertical: 2 }} placeholder="Tìm kiếm ..." value={q} onChangeText={t => search(t, setQ)} />
            {loading && <ActivityIndicator />}

            <Text style={Styles.text}>Danh sách chi phí</Text>
            <FlatList refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
                data={getFeeData()}
                keyExtractor={(item) => `${item.id}-${item.name}`}
                renderItem={({item}) => <Items item={item} routeName={'momo'} params={{ 'FeeID': item.id, 'FeeName': item.name, 'FeeValue': item.fee_value, 'FeeStatus': item.status}} />}
            />
        </View>
    );
}
export default Fee;