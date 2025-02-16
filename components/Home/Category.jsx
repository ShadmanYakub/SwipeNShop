import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Category = () => {
  const router = useRouter();

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={() => console.log("Pressed")}>
        <MaterialIcons name="filter-list" size={9} color="white" />
        <Text style={styles.buttonText}>Filter</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/businesslist/Sales')}>
        <Text style={styles.buttonText}>Sales</Text>
        <MaterialIcons name="arrow-drop-down" size={9} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/businesslist/Brands')}>
        <Text style={styles.buttonText}>Brands</Text>
        <MaterialIcons name="arrow-drop-down" size={9} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/businesslist/Products')}>
        <Text style={styles.buttonText}>Products</Text>
        <MaterialIcons name="arrow-drop-down" size={9} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 0,
    paddingRight: 100,
    marginRight: 20,
    marginLeft: 10
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
});

export default Category;