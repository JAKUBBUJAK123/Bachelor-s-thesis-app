import {React, useState, useEffect} from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Alert} from "react-native";

export default function RegisterScreen({navigation}) {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        resetForm()
      }, []);
    
    const resetForm = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    };

    const validateForm = () => {
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            Alert.alert("Missing Fields", "Please fill in all the fields.");
            return;
          }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) || !email.endsWith(".com")) {
          Alert.alert("Invalid Email", "Please enter a valid email address.");
          return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match please verify it!")
            return
        }

    }

    const fetchData = async () => {
        const response = await fetch('http://192.168.55.105:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body:JSON.stringify({
                firstName:firstName,
                lastName:lastName,
                email:email,
                password:password
            }),
        });
        const data = await response.json();
        if (response.ok){
            Alert.alert("Succesfully created an account")
            resetForm()
            navigation.navigate('LoginScreen')
        }else{
            Alert.alert(data.error)
            resetForm()
        }
    }

    return (
        <View style={style.Container}>
            <TouchableOpacity style={style.goBackButton} onPress={() => navigation.goBack()}>
            <Text style={style.buttonText}>X</Text>
            </TouchableOpacity>
            <Text style={style.header}>Register</Text>
            <View style={style.form}>
                <TextInput style={style.input} placeholder="First name" placeholderTextColor='#888' value={firstName} onChangeText={setFirstName}/>
                <TextInput style={style.input} placeholder="Last name" placeholderTextColor='#888' value={lastName} onChangeText={setLastName}/>
                <TextInput style={style.input} placeholder="email" placeholderTextColor='#888' value={email} onChangeText={setEmail} keyboardType="email-address"/>
                <TextInput style={style.input} placeholder="password" placeholderTextColor='#888' value={password} onChangeText={setPassword} secureTextEntry={true}/>
                <TextInput style={style.input} placeholder="confirm password" placeholderTextColor='#888' value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={true}/>
            </View>
            <TouchableOpacity style={style.registerButton} onPress={() => {validateForm() , fetchData()}}>
                    <Text style={style.buttonText}>Register</Text>
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