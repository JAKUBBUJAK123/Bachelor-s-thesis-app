import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Modal, TextInput} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import { updatePersonalUserInformations, fetchPersonalUserInfomations, handleLogout , getDailyProgress } from "../services/apiService";

import BtnNavbar from "../components/BtnNavbar";

export default function ScreenD({navigation}) {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [personalData, setPersonalData] = useState({
        firstName: '',
        lastName: '',
        nickname: '',
        age: 0,
        Gender: '',
        Weight: 0,
        Height: 0,
        ProfilePicture: '',
    })


    useEffect(() => {
        const fetchLoginStatus = async () => {
            const token = await AsyncStorage.getItem("AuthToken");
            if (token) {
                setIsLoggedIn(true);
            }
        };
        fetchLoginStatus();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchPersonalUserInfomations();
            setPersonalData(data);
        };
        if (isLoggedIn) {
            fetchData();
        }
    }, [isLoggedIn]);


    useEffect(() => {
        const fetchProgress = async () => {
            const data = await getDailyProgress();
            console.log(data);
        };
        if (isLoggedIn) {
            fetchProgress();
        }
    }) , [isLoggedIn];

    useEffect(() => {
          const unsubscribe = navigation.addListener('focus', () => {
          });
          return unsubscribe;
      }, [navigation]);
      
    useEffect(() => {
          const unsubscribeBlur = navigation.addListener('blur', () => {
          });
          return unsubscribeBlur;
      }, [navigation]);

    const handleSave = async () => {
        const token = await AsyncStorage.getItem("AuthToken");
        const response = await fetch('http://10.0.2.2:5000/api/user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(personalData)
        });
        if (response.ok){   
            setIsModalVisible(false)
            Alert.alert("Profile updated" , "Your profile has been updated")
        }else{
            Alert.alert("Cannot update the profile")
        }
        
    };

    const handleUserLogout = async () => {
        const data= await handleLogout();
        setPersonalData({
            firstName: '',
            lastName: '',
            nickname: '',
            age: '',
            Gender: '',
            Weight: '',
            Height: '',
            ProfilePicture: '',
        });
        setIsLoggedIn(false);
        Alert.alert("Logged out successfully");
        navigation.navigate('StartScreen')
    };



    return (
        <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.Header}>My Profile Page</Text>
            <View style={styles.profileStyle}>
                <Image source={require('../assets/profile-picture.png')} style={styles.image}/>
                <Text style={styles.nicknameText}>{personalData.nickname === "" ? 'My nickname' : personalData.nickname}</Text>
                <Text style={styles.nicknameText}>Name: {personalData.firstName === "" ? '' : personalData.firstName} {personalData.lastName === "" ? '' : personalData.lastName}</Text>
                <Text style={styles.nicknameText}>Age: {personalData.age === "" ? '' : personalData.age}</Text>
                <Text style={styles.nicknameText}>Gender: {personalData.Gender === "" ? '' : personalData.Gender}</Text>
                <Text style={styles.nicknameText}>Weight: {personalData.Weight === "" ? '' : personalData.Weight} kg</Text>
                <Text style={styles.nicknameText}>Height: {personalData.Height === "" ? '' : personalData.Height} cm</Text>

                {isLoggedIn && (
                    <>
                    <TouchableOpacity style={[styles.EditBtn , styles.primaryBtn]} onPress={() => {setIsModalVisible(true)}}>
                       <Text style={styles.btnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.EditBtn}>
                        <Text style={styles.btnText} onPress={handleUserLogout}>Logout</Text>
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
                        <TextInput style={styles.modalInput} placeholder="age" value={personalData.age} keyboardType="numeric" onChangeText={(t) => {setPersonalData({...personalData , age: t})}}/>
                        <View style={styles.pickerContainer}>
                        <Picker
                                selectedValue={personalData.Gender}
                                onValueChange={(itemValue) => setPersonalData({...personalData, Gender: itemValue})}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select Gender" value="" />
                                <Picker.Item label="Male" value="Male" />
                                <Picker.Item label="Female" value="Female" />
                            </Picker>
                        </View>
                        <TextInput style={styles.modalInput} placeholder="Weight" value={personalData.Weight} keyboardType="numeric" onChangeText={(t) => setPersonalData({...personalData , Weight: t})}/>
                        <TextInput style={styles.modalInput} placeholder="Height" value={personalData.Height} keyboardType="numeric" onChangeText={(t) => setPersonalData({...personalData , Height: t})}/>
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
pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
},
picker: {
    width: "100%",
    height: 60,
},
});
