import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Category = () => {
  const router = useRouter();

  // State for dropdown visibility
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isBrandsDropdownOpen, setIsBrandsDropdownOpen] = useState(false);

  // List of product categories
  const productCategories = [
    { name: 'Jeans', category: 'jeans' },
    { name: 'Jacket', category: 'jacket' },
    { name: 'Shoe', category: 'shoe' },
  ];

  // List of brands
  const brandCategories = [
    { name: 'Zara', category: 'Zara' },
    { name: 'Uniqlo', category: 'Uniqlo' },
  ];

  return (
    <View style={styles.buttonContainer}>
      {/* Filter Button */}
      <TouchableOpacity style={styles.button} onPress={() => console.log("Pressed")}>
        <MaterialIcons name="filter-list" size={9} color="white" />
        <Text style={styles.buttonText}>Filter</Text>
      </TouchableOpacity>

      {/* Sales Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/businesslist/Sales')}>
        <Text style={styles.buttonText}>Sales</Text>
        <MaterialIcons name="arrow-drop-down" size={9} color="white" />
      </TouchableOpacity>

      {/* Brands Button with Dropdown */}
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsBrandsDropdownOpen(!isBrandsDropdownOpen)} // Toggle dropdown visibility
        >
          <Text style={styles.buttonText}>Brands</Text>
          <MaterialIcons
            name={isBrandsDropdownOpen ? 'arrow-drop-up' : 'arrow-drop-down'} // Change icon based on dropdown state
            size={9}
            color="white"
          />
        </TouchableOpacity>

        {/* Dropdown Menu for Brands */}
        {isBrandsDropdownOpen && (
          <View style={styles.dropdown}>
            {brandCategories.map((brand, index) => (
              <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => {
                router.push({
                  pathname: '/businesslist/Brands',
                  params: { brandName: brand.category }, // Pass the brand name as a query parameter
                });
                setIsBrandsDropdownOpen(false); // Close the dropdown after selection
              }}
            >
              <Text style={styles.dropdownText}>{brand.name}</Text>
            </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Products Button with Dropdown */}
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)} // Toggle dropdown visibility
        >
          <Text style={styles.buttonText}>Products</Text>
          <MaterialIcons
            name={isProductsDropdownOpen ? 'arrow-drop-up' : 'arrow-drop-down'} // Change icon based on dropdown state
            size={9}
            color="white"
          />
        </TouchableOpacity>

        {/* Dropdown Menu for Products */}
        {isProductsDropdownOpen && (
          <View style={styles.dropdown}>
            {productCategories.map((product, index) => (
              <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => {
                router.push({
                  pathname: '/businesslist/Products',
                  params: { productName: product.category }, // Pass the brand name as a query parameter
                });
                setIsProductsDropdownOpen(false); // Close the dropdown after selection
              }}
            >
              <Text style={styles.dropdownText}>{product.name}</Text>
            </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 0,
    paddingRight: 100,
    marginRight: 20,
    marginLeft: 10,
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
  },
  dropdown: {
    position: 'absolute',
    top: 45, // Position below the button
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownText: {
    fontSize: 14,
    color: 'black',
  },
});

export default Category;