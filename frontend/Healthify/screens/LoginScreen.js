import React, { useState } from "react"
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const HandleLogin = async () => {
        if (!email || ! password) {
            Alert.alert("Missing fields", 'Please enter your email and password')
            return;
        
        };
        const response = await fetch('http://192.168.55.106:5000/api/login' , {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email,password}),
        });
        const result = await response.json();

        if (response.ok){
            await AsyncStorage.setItem('AuthToken' , result.token);
            Alert.alert(result.message)
            navigation.navigate('ScreenA');
        }
        else{
            Alert.alert(result.message)
        };

    }

    return (
        <View style={style.Container}>
            <TouchableOpacity style={style.goBackButton} onPress={() => navigation.goBack()}>
            <Text style={style.buttonText}>X</Text>
            </TouchableOpacity>
            <Text style={style.header}>Login</Text>
            <View style={style.form}>
                <TextInput style={style.input} placeholder="email" placeholderTextColor='#888' value={email} onChangeText={setEmail} keyboardType="email-address"/>
                <TextInput style={style.input} placeholder="password" placeholderTextColor='#888' value={password} onChangeText={setPassword} secureTextEntry={true}/>
            </View>
            <TouchableOpacity style={style.registerButton}>
                    <Text style={style.buttonText} onPress={HandleLogin}>Login</Text>
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
    },
    header : {
        fontSize : 34,
        fontWeight : 'bold',
        color : '#fff',
        marginBottom : 20
    },
    form : {
        width : '90%',
        maxWidth : 400,
    },
    input : {
        backgroundColor: "#3A3736",
        color: "#FFF",
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#555",
        fontSize: 16,
        marginBottom : 25

    },
    registerButton : {
        backgroundColor: "#1e9c1c",
        paddingVertical: 15,
        paddingHorizontal: 15,
        alignItems: "center",
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText : {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 18,
    },
    goBackButton : {
        position : 'absolute',
        top: 40,
        left : 20,
        padding: 10,
        zIndex : 1
    }
})