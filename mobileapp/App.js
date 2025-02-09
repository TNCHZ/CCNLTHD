import React , { useReducer } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity , Text, Alert, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import MyAccountReducer from './configs/MyAccountReducer';
import { MyAccountContext } from './configs/MyContext';
import Styles from './styles/Styles';
import APIs from './configs/APIs';

import Home from './components/Home/Home';
import Locker from './components/Resident/Locker'
import Login from './components/Resident/Login';
import Logout from './components/Resident/Logout';
import Fee from './components/Fee/Fees';
import Profile from './components/Resident/Profile';
import FeedBack from './components/Resident/FeedBack';
import Delete_Resident from './components/Admin/Delete_Resident';
import Create_Fee from './components/Admin/Create_Fee';
import Create_Resident from './components/Admin/Create_Resident';
import Create_Survey from './components/Admin/Create_Survey';
import RegisterParking from './components/Resident/RegisterParking';
import UpdateInfo from './components/Resident/UpdateInfo';
import Momo from './components/Home/Momo';
import Surveys from './components/Resident/Surveys';
import Resident_Feedback from './components/Admin/Resident_Feedback'
import CheckSurvey from './components/Admin/CheckSurvey';
import Locker_Resident from './components/Admin/Locker_Resident'
import Check_RelativeResident from './components/Admin/Check_RelativeResident'
import Check_Fee from './components/Admin/Check_Fee'

const Drawer= createDrawerNavigator(); //tạo màn hình kéo


const App =() => {
  //Đối tượng đăng nhập, khởi gán ban đầu là null
  const [account, dispatch] = useReducer(MyAccountReducer, null);

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
            account.role === "Resident" && account.change_password_image === true ? (
              <TouchableOpacity style={Styles.headerRight}
                onPress={() => { console.info(account); navigation.navigate("profile"); }}
              >
                <View style={Styles.row}>
                  <Text style={{ marginHorizontal: 5, color: "#4c4c4c", fontSize: 18, fontWeight: "bold", }}>
                    Chào {account.last_name}!
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <Text style={Styles.title}>JpHome</Text>
            )
          ),
          headerTintColor: "#646464",
          headerStyle: {backgroundColor: "#64c8c8"},
        })}>
          {/* Trang Home */}
          <Drawer.Screen name="home" component={Home} options={{title: "Giới Thiệu"}}/>
          
          <Drawer.Screen name='updateInfo' component={UpdateInfo} 
          options={() => account === null || account.change_password_image === true
              ? { title: "Cập nhật dữ liệu", drawerItemStyle: { display: "none" } }
              : { title: "Cập nhật dữ liệu" }
          }/>

          {/* Trang Login khi account = null */}
          {account === null ? (
            <Drawer.Screen name="login" component={Login} options={{ title: "Đăng Nhập" }} />
          ) : (
            <>
              {account.change_password_image === true && ( <>
                {/* Ẩn vì chỉ cần load nội dung */}
                <Drawer.Screen name="profile" component={Profile} options={{ title: "Trang cá nhân", drawerItemStyle: {display: 'none'}}}/>

                {account.role === "Admin" ? (<>
                  {/* Hiện tương tác của ADMIN */}
                  <Drawer.Screen name="createResident" component={Create_Resident} options={{ title: "Cấp Tài Khoản" }} />
                  <Drawer.Screen name="deleteResident" component={Delete_Resident} options={{ title: "Xóa Tài Khoản" }} />
                  <Drawer.Screen name="registerRelative" component={Check_RelativeResident} options={{ title: "Xem đăng kí người thân" }} />
                  <Drawer.Screen name="createFee" component={Create_Fee} options={{ title: "Tạo Chi Phí" }} />
                  <Drawer.Screen name="checkFee" component={Check_Fee} options={{title: "Kiểm Tra Đóng Phí"}}/>
                  <Drawer.Screen name="LockerResident" component={Locker_Resident} options={{ title: "Quản lý tủ điện tử" }} />
                  <Drawer.Screen name="residentFeedback" component={Resident_Feedback} options={{ title: "Xem Góp Ý" }} />
                  <Drawer.Screen name="createSurvey" component={Create_Survey} options={{ title: "Tạo Khảo Sát" }} />
                  <Drawer.Screen name="checkSurvey" component={CheckSurvey} options={{ title: "Xem Khảo Sát" }} />
                </>) : (<>
                  {/* Hiện để tương tác của RESIDENT */}
                  <Drawer.Screen name="fee" component={Fee} options={{ title: "Các Khoản Chi Phí" }} />
                  <Drawer.Screen name="momo" component={Momo} options={{ title: "Thanh toán" , drawerItemStyle: {display: 'none'} }} />
                  <Drawer.Screen name="locker" component={Locker} options={{ title: "Tủ Đồ Cá Nhân" }} />
                  <Drawer.Screen name="registerParking" component={RegisterParking} options={{ title: "Đăng Ký Đậu Xe" }} />
                  <Drawer.Screen name="survey" component={Surveys} options={{ title: "Khảo sát" }} />
                  <Drawer.Screen name="feedBack" component={FeedBack} options={{ title: "Góp ý" }} />
                </>)}
              </>)}
              {/* Hiển thị nút Đăng Xuất khi đã đăng nhập */}
              <Drawer.Screen name="logout" component={Logout} options={{ title: "Đăng Xuất"}} />
            </>
          )}
        </Drawer.Navigator>
      </NavigationContainer>
    </MyAccountContext.Provider>
  );
}

export default App;
