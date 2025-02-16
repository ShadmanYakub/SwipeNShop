import { View, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import Header from '../../components/Home/Header';
import Category from '../../components/Home/Category';
import ProductsSlider from '../../components/ProductsSlider';
import BottomTab from '../../components/Home/BottomTab';
import { useNavigation } from 'expo-router';

const Products = () => {
    const navigation = useNavigation();
    useEffect(()=>{
        navigation.setOptions({
            headerShown: true,
        })
    }, [])
    
  return (
    <View style={styles.container}>
      {/* Header */}
      <Header/>
      
      {/* Category Buttons */}
      <Category />
      
      {/* Slider */}
      <View style={styles.sliderContainer}>
        <ProductsSlider />
      </View>

      <BottomTab/>
      

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 10, // use it when no header shown
    marginTop: -50,
  },
  sliderContainer: {
    flex: 1,
    marginTop: 100, // Remove or set to a small value to bring it closer
  },
});

export default Products;