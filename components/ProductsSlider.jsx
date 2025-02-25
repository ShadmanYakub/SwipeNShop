import { View, Text, Image, Dimensions, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../configs/FirebaseConfig';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function ProductSlider({ productName }) {
    const navigation = useNavigation(); // Get navigation object
    const [productList, setproductList] = useState([]); // List of filtered items
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const translateX = useSharedValue(0); // Shared value for animated translation

    useEffect(() => {
        GetproductList();
    }, [productName]); // Re-fetch data if the productName changes

    // Fetch items based on the provided productName
    const GetproductList = async () => {
        setproductList([]);
        setLoading(true);

        try {
            // Query Firestore to filter items where `name` matches the provided productName
            const q = query(collection(db, 'Products'), where('type', '==', productName));
            const querySnapshot = await getDocs(q);

            // Extract data from the query results
            const productItems = querySnapshot.docs.map(doc => doc.data());
            setproductList(productItems);
        } catch (error) {
            console.error("Error fetching product data:", error);
        } finally {
            setLoading(false);
        }
    };

    const onSwipe = (event) => {
        const { translationX } = event.nativeEvent;
        translateX.value = translationX; // Update the translateX value based on the translation
    };

    const onHandlerStateChange = (event) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            const { translationX } = event.nativeEvent;

            // Handle swipe gestures
            if (translationX > 100 || translationX < -100) {
                const randomIndex = Math.floor(Math.random() * productList.length);
                console.log(randomIndex);
                runOnJS(setCurrentIndex)(randomIndex);
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

    return (
        <View style={{ backgroundColor: 'white' }}>
            <GestureHandlerRootView style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : productList.length > 0 ? (
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
                                    {productList[currentIndex]?.name}
                                </Text>
                                <Text style={{ fontFamily: 'outfit-bold', marginLeft: 5, marginBottom: 60, marginTop: 10 }}>
                                    {productList[currentIndex]?.product_id}
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
                ) : (
                    <Text style={styles.loadingText}>No items available for {productName}.</Text>
                )}
            </GestureHandlerRootView>
        </View>
    );
}

// Reuse the same styles as productsSlider
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
        height: height * 0.6, // Adjust the height as needed
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        borderRadius: 20,
        padding: 5,
    },
    rowContainer: {
        flexDirection: 'row', // Aligns children horizontally
        alignItems: 'center', // Vertically centers the items
    },
});