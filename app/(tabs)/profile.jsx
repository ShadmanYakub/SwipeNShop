import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, TextInput, Modal } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo'; // Clerk hooks
import { collection, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'; // Firestore utilities
import { db } from '../../configs/FirebaseConfig'; // Import your Firebase configuration

export default function ProfileScreen() {
  const { isLoaded, userId, signOut } = useAuth(); // Clerk auth hook
  const { user } = useUser(); // Clerk user hook
  const [profileData, setProfileData] = useState(null); // Firestore profile data
  const [isUpdating, setIsUpdating] = useState(false); // Modal visibility for updating profile
  const [formData, setFormData] = useState({ name: '', age: '', gender: '' }); // Form data for updates

  // Fetch profile data from Firestore
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;

      try {
        const profileRef = doc(collection(db, 'Profile'), userId);
        const profileSnapshot = await getDoc(profileRef);

        if (profileSnapshot.exists()) {
          setProfileData(profileSnapshot.data());
        } else {
          console.log('No profile data found.');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [userId]);

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

  // Open update profile modal
  const openUpdateModal = () => {
    setFormData({
      name: profileData?.name || '',
      age: profileData?.age?.toString() || '',
      gender: profileData?.gender || '',
    });
    setIsUpdating(true);
  };

  // Close update profile modal
  const closeUpdateModal = () => {
    setIsUpdating(false);
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (!userId) return;

    try {
      const profileRef = doc(collection(db, 'Profile'), userId);
      await updateDoc(profileRef, {
        name: formData.name,
        age: parseInt(formData.age, 10),
        gender: formData.gender,
      });

      setProfileData({ ...profileData, name: formData.name, age: parseInt(formData.age, 10), gender: formData.gender });
      Alert.alert('Success', 'Your profile has been updated successfully.');
      closeUpdateModal();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update your profile.');
    }
  };

  // Handle profile deletion
  const handleDeleteProfile = async () => {
    Alert.alert(
      'Delete Profile',
      'Are you sure you want to delete your profile? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              if (!userId) return;

              // Delete profile data from Firestore
              const profileRef = doc(collection(db, 'Profile'), userId);
              await deleteDoc(profileRef);

              // Delete user from Clerk
              await user.delete();

              Alert.alert('Success', 'Your profile has been deleted successfully.');
            } catch (error) {
              console.error('Error deleting profile:', error);
              Alert.alert('Error', 'Failed to delete your profile.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <Image source={{ uri: user?.imageUrl }} style={styles.profileImage} />

      {/* User Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{profileData?.name || user?.unsafeMetadata.firstName || 'N/A'}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.emailAddresses?.[0]?.emailAddress || 'N/A'}</Text>

        <Text style={styles.label}>Age:</Text>
        <Text style={styles.value}>{profileData?.age || 'N/A'}</Text>

        <Text style={styles.label}>Gender:</Text>
        <Text style={styles.value}>{profileData?.gender || 'N/A'}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {/* Update Profile Button */}
        <TouchableOpacity style={styles.button} onPress={openUpdateModal}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>

        {/* Delete Profile Button */}
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteProfile}>
          <Text style={styles.buttonText}>Delete Profile</Text>
        </TouchableOpacity>

        {/* Log Out Button */}
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Update Profile Modal */}
      <Modal visible={isUpdating} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Profile</Text>

            {/* Name Input */}
            <TextInput
              placeholder="Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              style={styles.input}
            />

            {/* Age Input */}
            <TextInput
              placeholder="Age"
              value={formData.age}
              onChangeText={(text) => setFormData({ ...formData, age: text })}
              keyboardType="numeric"
              style={styles.input}
            />

            {/* Gender Input */}
            <TextInput
              placeholder="Gender"
              value={formData.gender}
              onChangeText={(text) => setFormData({ ...formData, gender: text })}
              style={styles.input}
            />

            {/* Save and Cancel Buttons */}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleUpdateProfile}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={closeUpdateModal}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Light gray background
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
    borderColor: '#fff', // White border
  },
  infoContainer: {
    width: '100%',
    marginBottom: 40,
  },
  label: {
    color: '#333', // Dark gray text
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    color: '#666', // Medium gray text
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
  },
  button: {
    backgroundColor: '#007bff', // Blue button
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d', // Red button
  },
  logoutButton: {
    backgroundColor: '#6c757d', // Gray button
  },
  buttonText: {
    color: '#fff', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});