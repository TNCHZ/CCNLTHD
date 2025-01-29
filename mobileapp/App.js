import React , { useReducer } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity , Text, Alert, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import MyAccountReducer from './configs/MyAccountReducer';
import { MyAccountContext } from './configs/MyContext';
import Styles from './styles/Styles';

import Home from './components/Home/Home';
import Locker from './components/Resident/Locker'
import Login from './components/Resident/Login';
import Logout from './components/Resident/Logout';
import Fee from './components/Fee/Fees';
import ManagingFee_Detail from './components/Fee/ManagingFee_Detail';
import ParkingFee_Detail from './components/Fee/ParkingFee_Detail';
import ServiceFee_Detail from './components/Fee/ServiceFee_Detail';
import Profile from './components/Resident/Profile';
import FeedBack from './components/Resident/FeedBack';
import Checkin from './components/Resident/Checkin';
import Delete_Resident from './components/Admin/Delete_Resident';
import Create_Fee from './components/Admin/Create_Fee';
import Create_Resident from './components/Admin/Create_Resident';
import Create_Survey from './components/Admin/Create_Survey';
import RegisterParking from './components/Resident/RegisterParking';
import APIs from './configs/APIs';



const Drawer= createDrawerNavigator(); //tạo màn hình kéo

const App =() => {
  const [account, dispatch] = useReducer(MyAccountReducer, null);
  //Đối tượng đăng nhập, khởi gán ban đầu là null
  
  return (
    <MyAccountContext.Provider value={[account, dispatch]}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName='home' screenOptions={({ navigation }) => ({
          headerRight: () => account === null ? (
            <TouchableOpacity style={Styles.headerRight} onPress={() => navigation.navigate("login")}>
              <View style={Styles.row}>
                <Icon name="login" size={24} color="#000" />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={Styles.headerRight}
              onPress={() => {console.info(account); navigation.navigate("profile")}}>
              <View style={Styles.row}>
                <Text style={{marginHorizontal: 5, color: "#4c4c4c", fontSize: 18, fontWeight: 'bold'}}>Chào {account.username}!</Text>
              </View>
            </TouchableOpacity>
          ),
          headerTintColor: "#646464",
          headerStyle: {backgroundColor: "#64c8c8"},
        })}>
          {/* Trang Home */}
          <Drawer.Screen name="home" component={Home} options={{title: 'Giới Thiệu'}}/>
          
          {/* Trang Login khi account = null */}
          {account === null ? <>
            <Drawer.Screen name="login" component={Login} options={{title:"Đăng Nhập"}}/>
          </> : <>
            
            {/* Ẩn vì chỉ cần load nội dung*/}
            <Drawer.Screen name='profile' component={Profile} options={{title:"Trang cá nhân", drawerItemStyle:{display: 'none'}}}/>
            <Drawer.Screen name='managingFeeDetail' component={ManagingFee_Detail} options={{title: 'Phí Quản Lý', drawerItemStyle:{display: 'none'}}}/>
            <Drawer.Screen name='parkingFeeDetail' component={ParkingFee_Detail} options={{title: 'Phí Đỗ Xe', drawerItemStyle:{display: 'none'}}}/>
            <Drawer.Screen name='serviceFeeDetail' component={ServiceFee_Detail} options={{title: 'Phí Dịch Vụ', drawerItemStyle:{display: 'none'}}}/>
            
            {account.role === "Admin" ? <>
              {/* Hiện tương tác của ADMIN */}
              <Drawer.Screen name='createResident' component={Create_Resident} options={{title:'Cấp Tài Khoản'}}/>
              <Drawer.Screen name='deleteResident' component={Delete_Resident} options={{title:'Xóa Tài Khoản'}}/>
              <Drawer.Screen name='createFee' component={Create_Fee} options={{title: 'Quản Lý Chi Phí'}}/>
              <Drawer.Screen name='createSurvey'component={Create_Survey} options={{title: 'Quản Lý Khảo Sát'}}/>
            </> : <>
              {/* Hiện để tương tác của RESIDENT */}
              <Drawer.Screen name='fee' component={Fee} options={{title: 'Các Khoản Chi Phí'}}/>
              <Drawer.Screen name='locker' component={Locker} options={{title: 'Tủ Đồ Cá Nhân'}}/>
              <Drawer.Screen name='registerParking' component={RegisterParking} options={{title: 'Đăng Ký Đậu Xe'}}/>
              <Drawer.Screen name='checkin' component={Checkin} options={{title: 'Đăng Ký Ra/Vào Chung Cư'}}/>
              <Drawer.Screen name='feedBack' component={FeedBack} options={{title: 'Góp ý'}}/>
            </>}
            <Drawer.Screen name='logout' component={Logout} options={{title: "Đăng Xuất"}}/>
          </>}
          
        </Drawer.Navigator>
      </NavigationContainer>
    </MyAccountContext.Provider>
  );
}

export default App;
