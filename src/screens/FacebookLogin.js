import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const FacebookLogin = () => {
  const {mainContainer} = styles;
  return (
    <View style={mainContainer}>
      <Text>Facebook</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FacebookLogin;
