import { View, Text , Image, TextInput} from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo'
import { Colors } from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

const Header = () => {

    const {user} = useUser();
  return (
    <View style = {{
        padding : 20,
        paddingTop : 50,
        marginTop: 5,
        marginBottom: -20,
        backgroundColor: 'white',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    }}>
        <View style = {{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginTop: 20,
        }}>
            <Image source = {{uri:user?.imageUrl}}
            
            style = {{
                width: 45,
                height: 45,
                borderRadius: 99
            }}
            />
                <View>
                <Text style = {{
                    color: 'black',
                    fontFamily: 'outfit-Bold',
                    fontSize: 19,
                }}>Welcome to S&S,</Text>
                <Text style = {{
                    fontSize: 19,
                    fontFamily: 'outfit-Bold',
                    color: 'black'
                }}>{user?.fullName}</Text>
                </View>
        </View>
        <View style = {{
            display: 'flex',
            flexDirection:'row',
            gap:10,
            alignItems:'center',
            backgroundColor:'#fff',
            padding:10,
            marginVertical:10,
            marginTop: 15,
            borderRadius:8
        }}>

            {/* Search Bar*/}
            <Ionicons name="search" size={24} color={'black'} />
            <TextInput placeholder='Search' 
            style={{
                borderWidth: 1,
                borderColor: 'black', // Border color
                borderRadius: 25, // Oval shape
                paddingHorizontal: 15, // Padding inside the input
                height: 40, // Height of the input
                marginLeft: 5, // Space between icon and input
                flex: 1, // Allow the input to take up available space
                backgroundColor: 'white', // Background color for the input
            }}/>



        </View>
        
    </View>
    
  )
}

export default Header