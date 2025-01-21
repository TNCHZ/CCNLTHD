import React , { useReducer } from 'react';

import Home from './components/Home/Home';

import UserInterface from './components/User/UserInterface'


import MyAccountReducer from './configs/MyAccountReducer';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from './components/User/Login';
import ManagingFees from './components/Fee/ManagingFees';
import Fee from './components/Fee/Fees';
import ParkingFees from './components/Fee/ParkingFees';
import ServiceFees from './components/Fee/ServiceFees';
import Logout from './components/User/Logout';
import { MyAccountContext } from './configs/MyContext';
import { TouchableOpacity , Text } from 'react-native';

const Drawer= createDrawerNavigator(); //tạo màn hình kéo

const App =() => {
  const [account, dispatch] = useReducer(MyAccountReducer, null);
  //Đối tượng đăng nhập, khởi gán ban đầu là null

  return (
    <MyAccountContext.Provider value={[account, dispatch]}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName='home' screenOptions={({ navigation }) => ({
        headerRight: () => account === null ? (
            <TouchableOpacity onPress={() => navigation.navigate("login")}>
              <Text>Login</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                dispatch({ type: "logout" }); // Đăng xuất
                navigation.navigate("home"); // Quay lại trang Home
              }}>
              <Text>Logout</Text>
            </TouchableOpacity>
          ),
      })}>
          {/* Trang Home */}
          <Drawer.Screen name="home" component={Home} options={{title: 'Giới thiệu'}}/>

          {/* Trang Login khi account = null */}
          {account === null ? (
            <Drawer.Screen name="login" component={Login} />
          ) : (
            <Drawer.Screen name='logout' component={Logout} options={{title: "Đăng Xuất"}}/>
          )}
          
          

          <Drawer.Screen name='userInterface' component={UserInterface} options={{title: 'Trang chủ', drawerItemStyle:{display: 'none'}}}/>
          <Drawer.Screen name='fee' component={Fee} options={{title: 'Chi Phí', drawerItemStyle:{display: 'none'}}}/>
          <Drawer.Screen name='managingFees' component={ManagingFees} options={{title: 'Phí Quản Lý', drawerItemStyle:{display: 'none'}}}/>
          <Drawer.Screen name='parkingFees' component={ParkingFees} options={{title: 'Phí Đỗ Xe', drawerItemStyle:{display: 'none'}}}/>
          <Drawer.Screen name='serviceFees' component={ServiceFees} options={{title: 'Phí Dịch Vụ', drawerItemStyle:{display: 'none'}}}/>
        </Drawer.Navigator>
      </NavigationContainer>
    </MyAccountContext.Provider>
  );
}

export default App;
