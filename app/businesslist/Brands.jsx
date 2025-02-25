import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../components/Home/Header';
import Category from '../../components/Home/Category';
import BrandSlider from '../../components/BrandsSlider'; // Reusable BrandSlider component
import BottomTab from '../../components/Home/BottomTab';
import { useNavigation } from 'expo-router';
import { useLocalSearchParams } from 'expo-router'; // Import useLocalSearchParams

const Brands = () => {
  const navigation = useNavigation();
  const { brandName } = useLocalSearchParams(); // Extract query parameters
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: brandName || "Brands", // Dynamically set the header title
    });
    setLoading(false);
  }, [brandName]);

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
        {/* Pass the brand name as a prop to the generic BrandSlider */}
        <BrandSlider brandName={brandName} />
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

export default Brands;