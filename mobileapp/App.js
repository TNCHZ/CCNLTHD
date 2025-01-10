import React , { useReducer } from 'react';

import Home from './components/Home/Home';

import UserInterface from './components/Home/User/UserInterface'
import MyContext, { MyAccountContext } from './configs/MyContext'
import MyAccountReducer from './configs/MyAccountReducer';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from './components/User/Login';

const Drawer= createDrawerNavigator(); //tạo màn hình kéo

const App =() => {
  const [account, dispatch] = useReducer(MyAccountReducer, null);
  //Đối tượng đăng nhập, khởi gán ban đầu là null

  return (
    <MyAccountContext.Provider value={[account, dispatch]}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName='Home'>
          <Drawer.Screen name='Home' component={Home}/>
          <Drawer.Screen name='UserInterface' component={UserInterface}/>
          <Drawer.Screen name='Login' component={Login}/>

        </Drawer.Navigator>
      </NavigationContainer>
    </MyAccountContext.Provider>
  );
}

export default App;
