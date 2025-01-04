import React from 'react';
import { Text, View } from 'react-native';
import Styles from '../../styles/Styles';

//make a Component
const Header = (props) => {
  return (
    <View style = {Styles.header}>
        <Text>Đây là Header</Text>
      {/* <Text style = { Styles.headerStyle }>{props.headerText}</Text> */}

      
    </View>
  );
};

export default Header;
