import { View, Text, Image, Dimensions, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler'; // Import State here
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function Slider() {
    const [sliderList, setSliderList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const translateX = useSharedValue(0); // Shared value for animated translation

    useEffect(() => {
        GetSliderList();
    }, []);

    const GetSliderList = async () => {
        setSliderList([]);
        setLoading(true);
        const q = query(collection(db, 'Slider'));
        const querySnapshot = await getDocs(q);
        const images = querySnapshot.docs.map(doc => doc.data());
        setSliderList(images);
        setLoading(false);
    };

    const onSwipe = (event) => {
        const { translationX } = event.nativeEvent;
        translateX.value = translationX; // Update the translateX value based on the translation
    };

    const onHandlerStateChange = (event) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            const { translationX } = event.nativeEvent;
            if (translationX > 100) {
                const randomIndex = Math.floor(Math.random() * sliderList.length);
                console.log(randomIndex);
                runOnJS(setCurrentIndex)(randomIndex);
            } else if (translationX < -100) {
                const randomIndex = Math.floor(Math.random() * sliderList.length);
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
        
        <View style={{
            backgroundColor: 'white',
        }}>
            <GestureHandlerRootView style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : sliderList.length > 0 ? (
                    <PanGestureHandler
                        onGestureEvent={onSwipe}
                        onHandlerStateChange={onHandlerStateChange}
                    >
                        <Animated.View style={[styles.imageContainer, animatedStyle]}>
                            <Image
                                source={{ uri: sliderList[currentIndex].imageUrl }}
                                style={styles.image}
                            />
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
                    <Text style={styles.loadingText}>No images available.</Text>
                )}
            </GestureHandlerRootView>
        </View>
        
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginTop: 5,
        paddingRight: 100,
        marginRight: 20
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
    container: {
        
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 110,
        
        
    },
    title: {
        fontFamily: 'outfit-bold',
        fontSize: 20,
        padding: 20,
    },
    imageContainer: {
        paddingTop: 20,
        width: 370,
        height: height * 0.6, // Adjust the height as needed
        borderRadius: 20, // Add rounded corners
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 20, // Add rounded corners
        overflow: 'hidden', // Ensure content respects border radius
    },
    loadingText: {
        fontSize: 18,
        color: 'gray',
    },
    swipeIndicator: {
        fontSize: 16,
        color: 'green',
        marginTop: 10,
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        borderRadius: 20,
        padding: 5,
    },
});
