import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import {Colors} from './../../constants/Colors'

const TabLayout = () => {
  return (
    
    <Tabs style = {{background: 'black'}}screenOptions={{headerShown: false}}>
        <Tabs.Screen name = 'home'
        options={{
          tabBarLabel: 'Home',
          tabBarActiveTintColor :Colors.PRIMARY,
          tabBarIcon: ({color})=><Ionicons name="home" size={24} color={color} />
        }}
        />
        <Tabs.Screen name = 'cart'
         options={{
          tabBarLabel: 'Cart',
          tabBarActiveTintColor :Colors.PRIMARY,
          tabBarIcon: ({color})=><Ionicons name="cart" size={24} color={color} />
        }}
        />
        <Tabs.Screen name = 'profile'
        options={{
          tabBarLabel: 'Profile',
          tabBarActiveTintColor :Colors.PRIMARY,
          tabBarIcon: ({color})=><Ionicons name="people-circle" size={24} color={color} />
        }}
        />
        
        

    </Tabs>
    
  )
}

export default TabLayout