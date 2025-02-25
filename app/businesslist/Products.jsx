import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../components/Home/Header';
import Category from '../../components/Home/Category';
import ProductSlider from '../../components/ProductsSlider'; // Reusable productSlider component
import BottomTab from '../../components/Home/BottomTab';
import { useNavigation } from 'expo-router';
import { useLocalSearchParams } from 'expo-router'; // Import useLocalSearchParams

const Products = () => {
  const navigation = useNavigation();
  const { productName } = useLocalSearchParams(); // Extract query parameters
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: productName || "Products", // Dynamically set the header title
    });
    setLoading(false);
  }, [productName]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      {/* Category Buttons */}
      <Category />

      {/* Slider */}
      <View style={styles.sliderContainer}>
        {/* Pass the product name as a prop to the generic productSlider */}
        <ProductSlider productName={productName} />
      </View>

      {/* Bottom Tab */}
      <BottomTab />
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