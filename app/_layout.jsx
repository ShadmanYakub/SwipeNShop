import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { Text } from "react-native";
import LoginScreen from "../components/LoginScreen";
import { TokenCache } from '@clerk/clerk-expo/dist/cache'
import * as SecureStore from "expo-secure-store";

const tokenCache = {
    async getToken(key){
      try {
        return SecureStore.getItemAsync(key);
      } catch (err) {
        return null
      }
    },
    async saveToken(key, token){
      try{
        return SecureStore.setItemAsync(key, token)
      }catch(err){
        return;
      }
    },
  
}

export default function RootLayout() {
  useFonts({
    'outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('./../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold': require('./../assets/fonts/Outfit-Bold.ttf'),
  });

  return (
    <ClerkProvider 
    tokenCache={tokenCache}
    publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <SignedIn>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SignedIn>
      <SignedOut>
        <LoginScreen/>
      </SignedOut>
    </ClerkProvider>
  );
}