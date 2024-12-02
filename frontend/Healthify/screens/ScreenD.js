import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";

import BtnNavbar from "../components/BtnNavbar";

export default function ScreenD({navigation}) {
    return (
        <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.Header}>My Profile Page</Text>

            <View style={styles.profileStyle}>
                <Image source={require('../assets/profile-picture.png')} style={styles.image}/>
                <Text style={styles.nicknameText}>My Nickname</Text>
                <TouchableOpacity style={styles.EditBtn}>
                    <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>
            </View>

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
    paddingBottom: 80,
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
});
