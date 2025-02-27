import { View, StyleSheet ,Text} from 'react-native';
import React from 'react';
import Header from '../../components/Home/Header';


const cart = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />
      <Text>Cart</Text>
      
      
      
    
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

export default cart;