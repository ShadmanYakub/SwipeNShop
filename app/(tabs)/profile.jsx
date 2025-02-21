import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '@clerk/clerk-expo'; // Clerk hook to access user data
import { useUser } from '@clerk/clerk-expo';

export default function ProfileScreen() {
  const { isLoaded, userId, sessionId, getToken, signOut } = useAuth();

  const {user} = useUser();

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          onPress: () => signOut(),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      {(
        <Image source = {{uri:user?.imageUrl}} style={styles.profileImage} />
      )}

      {/* User Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user?.firstName || ''} {user?.lastName || ''}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.emailAddresses?.[0]?.emailAddress || 'N/A'}</Text>

      </View>

      {/* Log Out Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Black background
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60, // Makes it circular
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'white', // White border
  },
  infoContainer: {
    width: '100%',
    marginBottom: 40,
  },
  label: {
    color: 'black', // White text
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    color: 'black', // Light gray text
    fontSize: 16,
    marginBottom: 5,
  },
  logoutButton: {
    backgroundColor: 'black', // White button
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: 'white', // Black text
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});