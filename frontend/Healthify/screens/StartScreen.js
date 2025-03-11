import React, { useState } from "react"
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function StartScreen({ navigation }){

    return (
        <View style={style.Container}>
            
            <Image source={require('../assets/logo.jpg')} style={style.image}/>
            <TouchableOpacity style={style.registerButton} onPress={() => navigation.navigate('RegisterScreen')}>
                    <Text style={style.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.registerButton} onPress={() => navigation.navigate('LoginScreen')}>
                    <Text style={style.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
        
    )

}
const style = StyleSheet.create({
    Container : {
        backgroundColor : '#262322',
        flex : 1,
        justifyContent: 'center',
        alignItems : 'center',
        paddingHorizontal : 20
    },
    header : {
        fontSize : 34,
        fontWeight : 'bold',
        color : '#fff',
        marginBottom : 20
    },
    registerButton : {
        backgroundColor: '#1e9c1c',
        paddingVertical: 16,
        width: '60%',
        alignItems: 'center',
        borderRadius: 12,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText : {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 20,
        letterSpacing: 1,
    },
    image : {
        width: 250,
        height: 250,
        borderRadius: 125,
        marginBottom: 30,
        borderColor : '#fff'
    }

})