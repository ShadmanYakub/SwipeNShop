import { View, StyleSheet } from 'react-native';
import React from 'react';
import Header from '../../components/Home/Header';
import Slider from '../../components/Home/Slider';
import Category from '../../components/Home/Category';

const home = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />
      
      {/* Category Buttons */}
      <Category />
      
      {/* Slider */}
      <View style={styles.sliderContainer}>
        <Slider />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 0, // Add padding to top to create space
  },
  sliderContainer: {
    flex: 1,
    marginTop: 150, // Minimal margin to keep it close to the buttons
  },
});

export default home;