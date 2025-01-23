import { View, Text, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from "react-native";
import Styles from "../../styles/Styles";
import FeeStyles from "./FeeStyles";
import Items from "./Items";
import { Chip, Searchbar } from "react-native-paper";
import React, { useEffect, useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";


const Fee = ({navigation, route}) => {
    const [managingFees, setManagingFees] = useState([]);
    const [parkingFees, setParkingFees] = useState([]);
    const [serviceFees, setServiceFees] = useState([]);
    const [feeType, setFeeType] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [q, setQ] = useState("");

    const loadManages = async () => {
        if (page > 0) {
            setLoading(true);
            try {
                let url = `${endpoints['managing-fees']}?page=${page}`;
                //Tìm managing_fee nếu q có giá trị
                if (q){
                    url = `${url}&managing_fee&q=${q}`;
                }
                let res = await APIs.get(url);
                if (page > 1){
                    setManagingFees(current => [...current, ...res.data.results]);
                }else{
                    setManagingFees(res.data.results);
                }

                if (res.data.next === null){
                    setPage(0);
                }
            }catch(ex){
                console.error(ex);
            }finally{
                setLoading(false);
            }
        }
    }
    useEffect(() => {
        let timer = setTimeout(() => loadManages() , 500);
        
        return () => clearTimeout(timer);
    }, [q, page]);

    const loadParks = async () => {
        if (page > 0) {
            setLoading(true);
            try {
                let url = `${endpoints['parking-fees']}?page=${page}`;
                //Tìm parking_fee nếu q có giá trị
                if (q){
                    url = `${url}&parking_fee&q=${q}`;
                }
                let res = await APIs.get(url);
                if (page > 1){
                    setParkingFees(current => [...current, ...res.data.results]);
                }else{
                    setParkingFees(res.data.results);
                }

                if (res.data.next === null){
                    setPage(0);
                }
            }catch(ex){
                console.error(ex);
            }finally{
                setLoading(false);
            }
        }
    }
    useEffect(() => {
        let timer = setTimeout(() => {
            loadParks()
        }, 500);
        return () => clearTimeout(timer);
    }, [q, page]);


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

    const loadMore = () => {
        if (page > 0 && !loading)
            setPage(page + 1);
    }

    const search = (value, callback) => {
        setPage(1);
        callback(value);
    }

    const refresh = () => {
        setPage(1);
        loadManages();
        loadParks();
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
                onEndReached={loadMore} data={getFeeData()} 
                renderItem={({item}) => <Items item={item} routeName={feeType === 'managingFees' ? 'managingFeeDetail'
                    : feeType === 'parkingFees' ? 'parkingFeeDetail' : 'serviceFeeDetail'
                } params={{'manageID': item.id, 'parkID': item.id, 'serviceID': item.id, }} />}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}
export default Fee;