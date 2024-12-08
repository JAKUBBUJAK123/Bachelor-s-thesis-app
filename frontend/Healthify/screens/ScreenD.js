import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import BtnNavbar from "../components/BtnNavbar";

export default function ScreenD({navigation}) {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [personalData, setPersonalData] = useState({
        firstName: '',
        lastName: '',
        nickname: '',
        Gender: '',
        Weight: '',
        Height: '',
        ProfilePicture: '',
    })


    useEffect(() => {
        const fetchLoginStatus = async () => {
            const token = await AsyncStorage.getItem("AuthToken");
            setIsLoggedIn(!!token);
        };

        fetchLoginStatus();
    }, []);

    const handleSave = () => {
        setIsModalVisible(false)
        Alert.alert("Profile updated" , "Your profile has been updated")
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem("AuthToken");
        setIsLoggedIn(false);
        Alert.alert("Logged out successfully");
    };


    return (
        <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.Header}>My Profile Page</Text>

            <View style={styles.profileStyle}>
                <Image source={require('../assets/profile-picture.png')} style={styles.image}/>
                <Text style={styles.nicknameText}>{personalData.nickname === "" ? 'My nickname' : personalData.nickname}</Text>

                {isLoggedIn && (
                    <>
                    <TouchableOpacity style={[styles.EditBtn , styles.primaryBtn]} onPress={() => {setIsModalVisible(true)}}>
                       <Text style={styles.btnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.EditBtn}>
                        <Text style={styles.btnText} onPress={handleLogout}>Logout</Text>
                    </TouchableOpacity>
                    </>
                )}

                {!isLoggedIn && (
                    <>
                    <TouchableOpacity style={[styles.EditBtn , styles.secondaryBtn]}>
                        <Text style={styles.btnText} onPress={() => {navigation.navigate('RegisterScreen')}}>Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.EditBtn , , styles.secondaryBtn]}>
                        <Text style={styles.btnText} onPress={() => {navigation.navigate('LoginScreen')}}>Login</Text>
                    </TouchableOpacity>
                    </>
                )}
            </View>

            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>Edit personal informations</Text>
                        <TextInput style={styles.modalInput} placeholder="First name" value={personalData.firstName} onChangeText={(t) => setPersonalData({...personalData , firstName: t})}/>
                        <TextInput style={styles.modalInput} placeholder="Last name" value={personalData.lastName} onChangeText={(t) => setPersonalData({...personalData , lastName: t})}/>
                        <TextInput style={styles.modalInput} placeholder="Nickname" value={personalData.nickname} onChangeText={(t) => setPersonalData({...personalData , nickname: t})}/>
                        <TextInput style={styles.modalInput} placeholder="Gender" value={personalData.Gender} onChangeText={(t) => setPersonalData({...personalData , Gender: t})}/>
                        <TextInput style={styles.modalInput} placeholder="Weight" value={personalData.Weight} onChangeText={(t) => setPersonalData({...personalData , Weight: t})}/>
                        <TextInput style={styles.modalInput} placeholder="Height" value={personalData.Height} onChangeText={(t) => setPersonalData({...personalData , Height: t})}/>
                        <TextInput style={styles.modalInput} placeholder="Profile picture" value={personalData.ProfilePicture} onChangeText={(t) => setPersonalData({...personalData , ProfilePicture: t})}/>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={[styles.EditBtn , styles.primaryBtn]} onPress={handleSave}>
                                <Text style={styles.btnText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.EditBtn , styles.secondaryBtn]} onPress={() => {setIsModalVisible(false)}}>
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Text style={styles.sectionHeader}>Your Achievements</Text>
            <View style={styles.Achievements}>
                <Image source={require('../assets/running-boot.png')} style={styles.iconImage}/>
                <Image source={require('../assets/running-man.png')} style={styles.iconImage}/>
            </View>

            <Text style={styles.sectionHeader}>Your Best Achievement</Text>
            <View style={styles.bestAchievement}>
                <Image source={require('../assets/achivement.png')} style={styles.bestImage}/>
            </View>
                  </ScrollView>
        <View style={styles.navbarContainer}>
            <BtnNavbar navigation={navigation} />
        </View>
    </View>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#262322',
},
scrollContent: {
    marginTop : 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 200,
},
Header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    marginVertical: 15,
},
profileStyle: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#3A3736',
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
},
image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
},
nicknameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 5,
},
EditBtn: {
    backgroundColor: '#4287f5',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
},
primaryBtn : {
    backgroundColor: "#1e9c1c",
},
secondaryBtn : {
    backgroundColor: "#555",
},
btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
},
sectionHeader: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginTop: 15,
    marginBottom: 5,
},
Achievements: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#3A3736',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
},
iconImage: {
    width: 60,
    height: 60,
    tintColor: '#ffffff',
},
bestAchievement: {
    alignItems: 'center',
    backgroundColor: '#3A3736',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
},
bestImage: {
    width: 80,
    height: 80,
    tintColor: '#ffffff',
},
navbarContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#262322',
    paddingVertical: 10,
},
modalContainer: {
    flex : 1,
    justifyContent: 'center',
    alignItems : 'center',
    backgroundColor: "rgba(0, 0, 0, 0.7)"
},
modalContent : {
    width : '90%',
    backgroundColor : '#FFF',
    padding : 20,
    borderRadius : 10,
    alignItems: 'center'
},
modalHeader : {
    fontSize : 24,
    fontWeight : 'bold',
    marginBottom: 20
},
modalInput : {
    width : '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius : 10,
    borderColor: '#CCC',
    marginBottom: 15,
    fontSize : 15
},
buttonContainer : {
    flexDirection : 'row',
    justifyContent : 'space-between',
    width: '95%'
},
});
