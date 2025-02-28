import React, { useState } from 'react';
import { View, PanResponder, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ColorPicker = ({ onColorSelected }) => {
  const [selectedColor, setSelectedColor] = useState('#ff0000');
  
  const handleColorChange = (x, width) => {
    const ratio = x / width;
    const hue = Math.round(ratio * 360);
    const color = `hsl(${hue}, 100%, 50%)`;
    setSelectedColor(color);
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
      <LinearGradient
        colors={['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000']}
        start={[0, 0.5]}
        end={[1, 0.5]}
        style={styles.gradient}
        {...panResponder.panHandlers}
      />
      <View style={[styles.selectedColor, { backgroundColor: selectedColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  gradient: {
    width: 300,
    height: 40,
    borderRadius: 20,
  },
  selectedColor: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#000',
  },
});

export default ColorPicker;
