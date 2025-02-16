import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from './../../constants/Colors';
import { useRouter } from 'expo-router';

const BottomTab = ({ navigation }) => {
    const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tab} onPress={() => router.push('/(tabs)/home')}>
        <Ionicons name="home" size={24} color={Colors.PRIMARY} />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => router.push('/(tabs)/explore')}>
        <Ionicons name="search" size={24} color={Colors.PRIMARY} />
        <Text style={styles.label}>Explore</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => router.push('/(tabs)/profile')}>
        <Ionicons name="people-circle" size={24} color={Colors.PRIMARY} />
        <Text style={styles.label}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    elevation: 5, // Optional: Adds shadow for Android
    borderWidth: 1, // Add this line for border width
    borderColor: 'lightgray', // Change this to your desired border color
    borderRadius: 10, // Optional: Rounded corners
    shadowColor: '#000', // Optional: Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Optional: Shadow offset
    shadowOpacity: 0.1, // Optional: Shadow opacity
    shadowRadius: 4, // Optional: Shadow radius
  },
  tab: {
    alignItems: 'center',
  },
  label: {
    color: 'white',
    fontSize: 12,
  },
});

export default BottomTab;