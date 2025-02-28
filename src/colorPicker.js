import React, { useState } from 'react';
import { View, PanResponder, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';

const ColorPicker = ({ onColorSelected }) => {  
  const handleColorChange = (x, width) => {
    const ratio = x / width;
    const hue = Math.round(ratio * 360);
    const color = `hsl(${hue}, 100%, 50%)`;
    onColorSelected(color);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      handleColorChange(gestureState.moveX, 300);
    },
    onPanResponderRelease: (evt, gestureState) => {
      handleColorChange(gestureState.moveX, 300);
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.selectedColor]} onPress={()=>{
        onColorSelected('#000')
      }}/>
      <LinearGradient
        colors={['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000']}
        start={[0, 0.5]}
        end={[1, 0.5]}
        style={styles.gradient}
        {...panResponder.panHandlers}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent:'center',
    flexDirection:'row'    
  },
  gradient: {
    width: widthPercentageToDP(70),
    height: widthPercentageToDP(9),
    borderRadius: 20,
    marginLeft:widthPercentageToDP(3)
  },
  selectedColor: {
    width: widthPercentageToDP(9),
    height: widthPercentageToDP(9),
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor:'#000'
  }
});

export default ColorPicker;
