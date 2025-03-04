import { View, Text, Image, Dimensions, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, addDoc } from 'firebase/firestore'; // Import `addDoc` for Firestore writes
import { db } from '../../configs/FirebaseConfig';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@clerk/clerk-expo';

const { width, height } = Dimensions.get('window');

export default function Slider() {
  const { user } = useUser(); // Get the current user from Clerk
  const navigation = useNavigation();
  const [sliderList, setSliderList] = useState([]); // List of slider items
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const translateX = useSharedValue(0); // Shared value for horizontal swipe detection
  const translateY = useSharedValue(0); // Shared value for vertical swipe detection

  // Fetch slider items
  useEffect(() => {
    GetSliderList();
  }, []);

  const GetSliderList = async () => {
    setSliderList([]);
    setLoading(true);

    try {
      const q = query(collection(db, 'Slider'));
      const querySnapshot = await getDocs(q);

      // Extract both the document data and Firestore-generated ID
      const sliderItems = querySnapshot.docs.map(doc => ({
        id: doc.id, // Firestore-generated ID
        ...doc.data(), // Document data
      }));

      console.log("Fetched slides:", sliderItems); // Log fetched data
      setSliderList(sliderItems);
    } catch (error) {
      console.error("Error fetching slider data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle swipe actions
  const handleSwipe = async (direction) => {
    if (sliderList.length === 0) return;

    let updatedSliderList = [...sliderList]; // Create a copy of the slider list
    const currentSlide = updatedSliderList[currentIndex];

    if (direction === 'right') {
      // Move to the next item (circular logic)
      const newIndex = (currentIndex + 1) % updatedSliderList.length;
      setCurrentIndex(newIndex);
    } else if (direction === 'left') {
      // Remove the current item from the list
      updatedSliderList.splice(currentIndex, 1);

      // Update the slider list
      setSliderList(updatedSliderList);

      // If the list is empty, reset it or show a fallback message
      if (updatedSliderList.length === 0) {
        console.log("No more slides available.");
        return;
      }

      // Adjust the current index after removal
      const newIndex = currentIndex % updatedSliderList.length;
      setCurrentIndex(newIndex);
    }

    // Record the swipe in Firestore
    await recordSwipe(direction, currentSlide);

    // Reset position
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
  };

  // Handle swipe up gesture
  const handleSwipeUp = () => {
    const currentSlide = sliderList[currentIndex];
    if (!currentSlide) return;

    // Check if the slide is out of stock
    if (currentSlide.stock === 0) {
      Alert.alert("Out of Stock", "This product is currently sold out.");
      return;
    }

    // Check if sizes are available
    if (!currentSlide.size || currentSlide.size.length === 0) {
      Alert.alert("No Sizes Available", "This product does not have any available sizes.");
      return;
    }

    // Prompt for quantity selection
    Alert.prompt(
      "Select Quantity",
      "Enter the quantity you want to purchase:",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: (quantity) => {
            const parsedQuantity = parseInt(quantity, 10);

            if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
              Alert.alert("Invalid Quantity", "Please enter a valid quantity.");
              return;
            }

            if (parsedQuantity > currentSlide.stock) {
              Alert.alert("Not Enough Stock", `Only ${currentSlide.stock} items are available.`);
              return;
            }

            // Prompt for size selection
            Alert.alert(
              "Select Size",
              "Available Sizes: " + currentSlide.size.join(", "),
              currentSlide.size.map((size) => ({
                text: size,
                onPress: () => addToCart(currentSlide, parsedQuantity, size),
              })),
              { cancelable: true }
            );
          },
        },
      ],
      "plain-text"
    );
  };

  // Add slide to Cart collection
  const addToCart = async (slide, quantity, size) => {
    try {
      const primaryEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress || 'Unknown';
      const userId = user.id;

      await addDoc(collection(db, 'Cart'), {
        slide_id: slide.id,
        image: slide.imageUrl,
        brand_name: slide.brand_name,
        product_name: slide.product_name,
        user_id: userId,
        email: primaryEmail,
        quantity: quantity,
        size: size,
        price: slide.price,
        timestamp: new Date(),
      });

      Alert.alert("Added to Cart", ` ${slide.brand_name} ${slide.product_name} (${size}) added to your cart.`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Error", "Failed to add the product to your cart.");
    }
  };

  // Record swipe in Firestore
  const recordSwipe = async (direction, slide) => {
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
        brand_name: slide.brand_name,
        product_name: slide.product_name,
        slide_id: slide.id, // Use the Firestore-generated ID here
        timestamp: new Date(), // Optional: Add a timestamp for when the swipe occurred
      });

      console.log(`Swipe recorded: ${direction === 'right' ? 'Liked' : 'Disliked'} ${slide.product_name}`);
    } catch (error) {
      console.error("Error recording swipe:", error);
    }
  };

  const onSwipe = (event) => {
    const { translationX, translationY } = event.nativeEvent;
    translateX.value = translationX; // Update the translateX value for horizontal swipes
    translateY.value = translationY; // Update the translateY value for vertical swipes
  };

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX, translationY } = event.nativeEvent;

      // Determine swipe direction
      if (Math.abs(translationX) > Math.abs(translationY)) {
        // Horizontal swipe (swipe right or left)
        if (translationX > 100) {
          // Swiped right
          runOnJS(handleSwipe)('right');
        } else if (translationX < -100) {
          // Swiped left
          runOnJS(handleSwipe)('left');
        }
      } else {
        // Vertical swipe (swipe up)
        if (translationY < -100) {
          // Swiped up
          runOnJS(handleSwipeUp)();
        }
      }

      // Reset position
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value }, // Horizontal animation
        { translateY: translateY.value }, // Vertical animation
      ],
    };
  });

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (sliderList.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No slides available.</Text>
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
            {/* Display the current slide */}
            <Image
              source={{ uri: sliderList[currentIndex]?.imageUrl }}
              style={styles.image}
            />
            <View style={styles.rowContainer}>
              <Text style={{ fontFamily: 'outfit-bold', marginBottom: 10, marginTop: 5 }}>
                {sliderList[currentIndex]?.brand_name}
              </Text>
              <Text style={{ fontFamily: 'outfit-bold', marginLeft: 5, marginBottom: 10, marginTop: 5 }}>
                {sliderList[currentIndex]?.product_name}
              </Text>
              <Text style={{ fontFamily: 'outfit-bold', marginLeft: 5, marginBottom: 10, marginTop: 5 }}>
                , Price: HKD {sliderList[currentIndex]?.price}
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
    paddingTop: 110,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    paddingTop: 20,
    width: 370,
    height: height * 0.6,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
    overflow: 'hidden',
  },
  loadingText: {
    fontSize: 18,
    color: 'gray',
  },
  iconContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
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