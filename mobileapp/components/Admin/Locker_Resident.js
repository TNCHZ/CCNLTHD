import { ScrollView, View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Styles from "../../styles/Styles";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { authApis, endpoints } from "../../configs/APIs";


const CheckLocker = () => {
    const [selectedLocker, setSelectedLocker] = useState(null);
    const [loadingLocker, setLoadingLocker] = useState(false);
    const [lockerList, setLockerList] = useState([]);
    const [items, setItems] = useState([]);
    const [newItemName, setNewItemName] = useState(""); // Tên vật phẩm mới
    const [addingItem, setAddingItem] = useState(false); // Trạng thái thêm vật phẩm
    const [loadingAdd, setLoadingAdd] = useState(false); // Trạng thái đang lưu

    // Lấy danh sách tủ từ API
    const fetchLocker = async () => {
        setLoadingLocker(true);
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await authApis(token).get(endpoints["locker"]);
            setLockerList(response.data.results);
        } catch (error) {
            console.error("Lỗi khi tải danh sách tủ:", error.response?.data || error);
        } finally {
            setLoadingLocker(false);
        }
    };

    // Khi chọn một tủ, lấy danh sách items trong tủ đó
    const handleLockerChange = (lockerId) => {
        setSelectedLocker(lockerId);
        const selected = lockerList.find((locker) => locker.id === lockerId);
        setItems(selected ? selected.items_in_locker : []);
    };

    // Gửi vật phẩm mới lên API
    const handleAddItem = async () => {
        if (!newItemName.trim()) {
            alert("Vui lòng nhập tên vật phẩm!");
            return;
        }

        setLoadingAdd(true);
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await authApis(token).post(endpoints["item-in-locker"], {
                name: newItemName,
                locker: selectedLocker, // ID của tủ đã chọn
            });

            // Cập nhật danh sách vật phẩm sau khi thêm
            setItems([...items, response.data]);
            setNewItemName(""); // Reset input
            setAddingItem(false); // Ẩn input sau khi thêm thành công
        } catch (error) {
            console.error("Lỗi khi thêm vật phẩm:", error.response?.data || error);
            alert("Thêm vật phẩm thất bại!");
        } finally {
            setLoadingAdd(false);
        }
    };

    // Xử lý khi nhấn vào vật phẩm
    const handleItemPress = (item) => {
        if (item.status) return; // Nếu đã lấy thì không cho nhấn

        Alert.alert(
            "Xác nhận",
            `Bạn có chắc đã lấy vật phẩm "${item.name}" không?`,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Đã lấy",
                    onPress: () => updateItemStatus(item.id),
                    style: "destructive",
                },
            ]
        );
    };

    // Cập nhật trạng thái vật phẩm (status = true)
    const updateItemStatus = async (itemId) => {
        try {
            const token = await AsyncStorage.getItem("token");
            await authApis(token).patch(`${endpoints["item-in-locker"]}${itemId}/`, {
                status: true,
            });

            // Cập nhật danh sách vật phẩm sau khi cập nhật thành công
            setItems(items.map((item) => (item.id === itemId ? { ...item, status: true } : item)));
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái vật phẩm:", error.response?.data || error);
            alert("Cập nhật trạng thái thất bại!");
        }
    };

    useEffect(() => {
        fetchLocker();
    }, []);

    return (
        <View style={Styles.container}>
            <Text style={Styles.title}>Danh sách tủ</Text>
            {/* Picker để chọn tủ */}
            <Picker style={Styles.input} selectedValue={selectedLocker} onValueChange={handleLockerChange}>
                <Picker.Item label="Chọn tủ" value={null} />
                {loadingLocker ? (
                    <Picker.Item label="Đang tải..." value="loading" />
                ) : (
                    lockerList.map((locker) => (
                        <Picker.Item key={locker.id} label={locker.name} value={locker.id} />
                    ))
                )}
            </Picker>
            
            {/* Hiển thị danh sách item trong tủ */}
            <ScrollView style={[Styles.scrollView, {width: "100%"}]}>
                <View style={[Styles.containerNoCenter,{padding:5}]}>
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => handleItemPress(item)} disabled={item.status}
                            style={{ padding: 10, marginBottom: 10, borderRadius: 5, borderColor: "#ccc", borderWidth: 1,
                                backgroundColor: item.status ? "#d3d3d3" : "#e6f7ff",
                        }}>
                            <Text style={[Styles.text,{color:"#000"}]}>Tên vật phẩm: {item.name}</Text>
                            <Text style={[Styles.text,{color:"#000"}]}>Trạng thái: {item.status ? "Đã lấy" : "Chưa lấy"}</Text>
                            <Text style={[Styles.text,{color:"#000"}]}>Ngày gửi: {new Date(item.created_date).toLocaleDateString()}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text>Không có vật phẩm nào trong tủ.</Text>
                )}
                </View>
            </ScrollView>

            {/* Form nhập vật phẩm mới */}
            {addingItem && (
                <View style={{ marginTop: 10 }}>
                    <TextInput style={Styles.input} placeholder="Nhập tên vật phẩm"
                        value={newItemName} onChangeText={setNewItemName}
                    />
                    <TouchableOpacity style={Styles.button}disabled={loadingAdd} onPress={handleAddItem}>
                        <Text style={Styles.buttonText}>{loadingAdd ? "Đang lưu..." : "Lưu vật phẩm"}</Text>
                    </TouchableOpacity>
                </View>
            )}
           
            {/* Nút thêm vật phẩm */}
            {!addingItem && selectedLocker && (
                <TouchableOpacity
                    style={Styles.button}
                    onPress={() => setAddingItem(true)}
                >
                    <Text style={Styles.buttonText}>Thêm vật phẩm</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default CheckLocker;
