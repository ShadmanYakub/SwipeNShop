// LoginScreen.jsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useWarmUpBrowser } from "../hooks/useWarmUPBrowser";
import * as WebBrowser from "expo-web-browser";
import { useOAuth, useSignIn, useUser } from "@clerk/clerk-expo"; // Import useUser
import { db } from "../../SwipeNShop/configs/FirebaseConfig"; // Import Firestore
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import Icon from "react-native-vector-icons/FontAwesome5";
import SignUpScreen from "./SignUpScreen"; // Import SignUpScreen


WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [isSignUp, setIsSignUp] = useState(false); // State to toggle between Login and SignUp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  // Clerk hooks
  const { signIn, setActive } = useSignIn(); // Use the useSignIn hook for email/password login
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { user, isLoaded } = useUser(); // Use the useUser hook to get the current user

  // Handle Google OAuth login
  const onPressGoogle = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive} = await startOAuthFlow();
      if (createdSessionId) {
        await setActive({ session: createdSessionId });

        // Wait for the user object to load
        if (!isLoaded) {
          console.log("User data is still loading...");
          return;
        }
         console.log(user);
        // Fetch the current user's details
        const userData = {
          userId: createdSessionId, // Use the user's ID from Clerk
          email: user?.emailAddresses[0]?.emailAddress || null, // Extract primary email address
          firstName: user?.firstName || null, // Extract first name
          lastName: user?.lastName || null, // Extract last name
        };

        // Add user data to Firestore
        await addUserToFirestore(userData);

        console.log("User added to Firestore:", userData);
      } else {
        console.log("Sign-in or sign-up required.");
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [user, isLoaded]);

  // Handle email/password login
  const onLoginPress = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      // Attempt to sign in with email and password
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });

      // If successful, set the session active
      if (completeSignIn.status === "complete") {
        await setActive({ session: completeSignIn.createdSessionId });
        Alert.alert("Success", "You have successfully logged in!");
      } else {
        throw new Error("Sign in not completed");
      }
    } catch (err) {
      //console.error("Error during login:", err);
      Alert.alert("Login Failed", err.errors[0]?.message || "Invalid email or password.");
    }
  };

  // Add user data to Firestore
  const addUserToFirestore = async (userData) => {
    try {
      const userRef = doc(db, "Profile_Google_SignIn", userData.userId);
      await setDoc(userRef, userData);
      console.log("User data added to Firestore successfully!");
    } catch (error) {
      console.error("Error adding user to Firestore:", error);
    }
  };

  return (
    <View style={styles.container}>
      {isSignUp ? (
        // Render SignUpScreen when isSignUp is true
        <SignUpScreen setIsSignUp={setIsSignUp} />
      ) : (
        // Render LoginScreen when isSignUp is false
        <>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={onLoginPress}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setIsSignUp(true)}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonGoogle} onPress={onPressGoogle}>
            <Icon name="google" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ marginTop: 10 }}>Sign up with Google</Text>
          <TouchableOpacity onPress={() => Alert.alert("Forgot Password", "Redirect to forgot password flow.")}>
            <Text style={styles.link}>Forgot Password?</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    color: "black",
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: "underline",
  },
  buttonGoogle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#db4437",
    justifyContent: "center",
    alignItems: "center",
  },
});