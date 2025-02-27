import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore'; // Import Firestore utilities
import { db } from '../../configs/FirebaseConfig';
import Header from '../../components/Home/Header';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';

const Cart = () => {
  const { user } = useUser(); // Get the current user from Clerk
  const [cartItems, setCartItems] = useState([]); // List of cart items
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0); // Total price of all items

  // Fetch cart items for the logged-in user
  useEffect(() => {
    const fetchCartData = async () => {
      setCartItems([]);
      setLoading(true);

      try {
        if (!user) {
          console.error("No user is logged in.");
          return;
        }

        const userId = user.id;

        // Query the Cart collection for the logged-in user
        const q = query(collection(db, 'Cart'), where('user_id', '==', userId));
        const querySnapshot = await getDocs(q);

        // Extract both the document data and Firestore-generated ID
        const cartData = querySnapshot.docs.map(doc => ({
          id: doc.id, // Firestore-generated ID
          ...doc.data(), // Document data
        }));

        console.log("Fetched cart items:", cartData);

        // Calculate total price
        const totalPrice = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalPrice(totalPrice);

        setCartItems(cartData);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [user]);

  // Handle payment simulation
  const handlePayment = () => {
    Alert.alert(
      "Payment Confirmation",
      "Are you sure you want to proceed with the payment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Pay Now",
          onPress: () => {
            Alert.alert("Payment Successful", "Your payment has been processed successfully.");
          },
        },
      ]
    );
  };

  // Render each cart item
  const renderItem = ({ item }) => (
    <View style={styles.cartItemContainer}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productInfo}>Quantity: {item.quantity}</Text>
        <Text style={styles.productInfo}>Size: {item.size}</Text>
        <Text style={styles.productPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyCartContainer}>
        <Header />
        <Text style={styles.emptyCartText}>Your cart is empty.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      {/* Cart Items */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
      />

      {/* Total Price */}
      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPriceText}>Total: ${totalPrice.toFixed(2)}</Text>
      </View>

      {/* Payment Button */}
      <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
        <Text style={styles.paymentButtonText}>Proceed to Pay</Text>
        <MaterialIcons name="payment" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50, // Space for header
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingBottom: 100, // Space for total price and payment button
  },
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  totalPriceContainer: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 10,
  },
});

export default Cart;