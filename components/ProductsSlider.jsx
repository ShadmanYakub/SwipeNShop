import { View, Text, Image, Dimensions, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore'; // Import `addDoc` for Firestore writes
import { db } from '../configs/FirebaseConfig';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@clerk/clerk-expo';

const { width, height } = Dimensions.get('window');

export default function ProductSlider({ productName }) {
  const { user } = useUser(); // Get the current user from Clerk
  const navigation = useNavigation();
  const [productList, setProductList] = useState([]); // List of filtered items
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const translateX = useSharedValue(0); // Shared value for animated translation

  // Fetch items based on the provided productName
  useEffect(() => {
    GetProductList();
  }, [productName]);

  const GetProductList = async () => {
    setProductList([]);
    setLoading(true);

    try {
      const q = query(collection(db, 'Products'), where('type', '==', productName));
      const querySnapshot = await getDocs(q);

      // Extract both the document data and Firestore-generated ID
      const productItems = querySnapshot.docs.map(doc => ({
        id: doc.id, // Firestore-generated ID
        ...doc.data(), // Document data
      }));

      console.log("Fetched products:", productItems); // Log fetched data
      setProductList(productItems);
    } catch (error) {
      console.error("Error fetching product data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle swipe actions
  const handleSwipe = async (direction) => {
    if (productList.length === 0) return;

    let updatedProductList = [...productList]; // Create a copy of the product list
    const currentProduct = updatedProductList[currentIndex];

    if (direction === 'right') {
      // Move to the next item (circular logic)
      const newIndex = (currentIndex + 1) % updatedProductList.length;
      setCurrentIndex(newIndex);
    } else if (direction === 'left') {
      // Remove the current item from the list
      updatedProductList.splice(currentIndex, 1);

      // Update the product list
      setProductList(updatedProductList);

      // If the list is empty, reset it or show a fallback message
      if (updatedProductList.length === 0) {
        console.log("No more products available.");
        return;
      }

      // Adjust the current index after removal
      const newIndex = currentIndex % updatedProductList.length;
      setCurrentIndex(newIndex);
    }

    // Record the swipe in Firestore
    await recordSwipe(direction, currentProduct);

    // Reset position
    translateX.value = withTiming(0);
  };

  // Function to record swipe in Firestore
  const recordSwipe = async (direction, product) => {
    try {
      // Validate user session
      if (!user) {
        console.error("No user is logged in.");
        return;
      }

      // Retrieve user data (email and user ID)
      const primaryEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress || 'Unknown';
      const userId = user.id;

      // Determine Like/Dislike based on swipe direction
      const like = direction === 'right' ? 1 : 0;
      const dislike = direction === 'left' ? 1 : 0;

      // Add the swipe record to the Swipes collection
      await addDoc(collection(db, 'Swipes'), {
        Like: like,
        Dislike: dislike,
        email: primaryEmail,
        user_id: userId,
        product_name: product.type,
        brand_name: product.brand_id,
        product_id: product.id, // Use the Firestore-generated ID here
        timestamp: new Date(), // Optional: Add a timestamp for when the swipe occurred
      });

      console.log(`Swipe recorded: ${direction === 'right' ? 'Liked' : 'Disliked'} ${product.name}`);
    } catch (error) {
      console.error("Error recording swipe:", error);
    }
  };

  const onSwipe = (event) => {
    const { translationX } = event.nativeEvent;
    translateX.value = translationX; // Update the translateX value based on the translation
  };

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;

      // Determine swipe direction
      if (translationX > 100) {
        // Swiped right
        runOnJS(handleSwipe)('right');
      } else if (translationX < -100) {
        // Swiped left
        runOnJS(handleSwipe)('left');
      }

      // Reset position
      translateX.value = withTiming(0);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (productList.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No products available.</Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: 'white' }}>
      <GestureHandlerRootView style={styles.container}>
        <PanGestureHandler
          onGestureEvent={onSwipe}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View style={[styles.imageContainer, animatedStyle]}>
            {/* Display the current product item */}
            <Image
              source={{ uri: productList[currentIndex]?.imageUrl }}
              style={styles.image}
            />
            <View style={styles.rowContainer}>
              <Text style={{ fontFamily: 'outfit-bold', marginBottom: 60, marginTop: 10 }}>
                {productList[currentIndex]?.brand_id}
              </Text>
              <Text style={{ fontFamily: 'outfit-bold', marginLeft: 5, marginBottom: 60, marginTop: 10 }}>
                {productList[currentIndex]?.type}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity style={[styles.iconButton, { flexDirection: 'row', alignItems: 'center' }]}>
                <MaterialIcons name="arrow-left" size={15} color="white" />
                <MaterialIcons name="delete" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconButton, { flexDirection: 'row', alignItems: 'center' }]}>
                <MaterialIcons name="favorite" size={24} color="white" />
                <MaterialIcons name="arrow-right" size={15} color="white" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 150,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    paddingTop: 70,
    width: width,
    height: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 370,
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 25,
  },
  loadingText: {
    fontSize: 18,
    color: 'gray',
  },
  iconContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 200,
  },
  iconButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});