import { View, Text, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from "react-native";
import Styles from "../../styles/Styles";
import FeeStyles from "./FeeStyles";
import Items from "./Items";
import { Chip, Searchbar } from "react-native-paper";
import { useEffect, useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";


const Fee = ({navigation}) => {
    const [managingFees, setManagingFees] = useState([]);
    const [parkingFees, setParkingFees] = useState([]);
    const [serviceFees, setServiceFees] = useState([]);
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
        let timer = setTimeout(() => {
            loadParks()
        }, 500);
        return () => clearTimeout(timer);
    }, [q, page]);


    //====================================================
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
            <Text style={Styles.title}>Số Phòng: ___ </Text>
            <Text style={Styles.title}>DANH SÁCH CHI PHÍ</Text>
            <View style={Styles.row}>
                <TouchableOpacity onPress={() => navigation.navigate("managingFees")}>
                    <Chip icon="clipboard-text">Phí Quản Lí</Chip>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("parkingFees")}>
                    <Chip icon="clipboard-text">Phí Đỗ Xe</Chip> 
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("serviceFees")}>
                    <Chip icon="clipboard-text">Phí Dịch Vụ</Chip> 
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("fee")}>
                    <Chip icon="label-outline">Tất cả</Chip> 
                </TouchableOpacity>
            </View>
            
            <Searchbar style={{marginVertical: 10}} placeholder="Tìm kiếm ..." value={q} onChange={t => search(t, setQ)}/>
            {loading && <ActivityIndicator />}

            <Text style={Styles.text}>Danh sách Phí Quản Lý</Text>
            <FlatList refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
            onEndReached={loadMore} data={managingFees} 
            renderItem={({item}) => <Items item={item} routeName="managingFees" params={{'manageID': item.id}} />} />

            <Text style={Styles.text}>Danh sách Phí Đỗ Xe</Text>
            <FlatList refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
            onEndReached={loadMore} data={parkingFees} 
            renderItem={({item}) => <Items item={item} routeName="parkingFees" params={{'parkID': item.id}}/>} />

            <Text style={Styles.text}>Danh sách Phí Dịch Vụ</Text>
            <FlatList refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
            onEndReached={loadMore} data={serviceFees} 
            renderItem={({item}) => <Items item={item} routeName="serviceFees" params={{'serviceID': item.id}}/>} />
        </View>
    );
}
export default Fee;