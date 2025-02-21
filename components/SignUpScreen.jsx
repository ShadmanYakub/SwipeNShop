// SignUpScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { db } from '../../SwipeNShop/configs/FirebaseConfig'; // Import Firestore
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions

const SignUpScreen = ({ setIsSignUp }) => {
  const { signUp, isLoaded, setActive } = useSignUp();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  // Function to add user data to Firestore
  const addUserToFirestore = async (userId, userData) => {
    try {
      const userRef = doc(db, "Profile", userId); // Create a reference to the Profile collection
      await setDoc(userRef, userData); // Add the user data to Firestore
      console.log("User data added to Firestore successfully!");
    } catch (error) {
      console.error("Error adding user to Firestore:", error);
      Alert.alert("Error", "Failed to save user data.");
    }
  };

  // Function to handle user sign-up
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      // Start the sign-up process with email, password, and metadata
      const signUpResponse = await signUp.create({
        emailAddress: email,
        password,
        unsafeMetadata: {
          firstName,
          lastName,
          age,
          gender,
        },
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification();

      // Update state to indicate that verification is pending
      setPendingVerification(true);
    } catch (err) {
      console.error('Error during sign-up:', err);
      Alert.alert('Sign Up Failed', err.errors[0]?.message || 'Something went wrong.');
    }
  };

  // Function to verify the email code
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      // Attempt to verify the email with the provided code
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If successful, set the session active
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });

        // Extract user ID and metadata
        const userId = completeSignUp.createdUserId;
        const userData = {
          userId: userId,
          email: email,
          firstName: firstName,
          lastName: lastName,
          age: age,
          gender: gender,
        };

        // Add user data to Firestore
        await addUserToFirestore(userId, userData);

        // Show success message
        Alert.alert('Success', 'You have successfully signed up!');
      } else {
        throw new Error('Sign up not completed');
      }
    } catch (err) {
      console.error('Error verifying email:', err);
      Alert.alert('Verification Failed', err.errors[0]?.message || 'Invalid verification code.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {/* First Name Input */}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
      />

      {/* Last Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="words"
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Age Input */}
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      {/* Gender Input */}
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
      />

      {/* Sign Up Button */}
      {!pendingVerification && (
        <Button title="Sign Up" onPress={onSignUpPress} />
      )}

      {/* Verification Code Input */}
      {pendingVerification && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Verification Code"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
          />
          <Button title="Verify Email" onPress={onPressVerify} />
        </>
      )}

      {/* Go Back to Login Button */}
      <Button title="Go Back to Login" onPress={() => setIsSignUp(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});

export default SignUpScreen;