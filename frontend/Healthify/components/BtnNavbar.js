import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { ThemeProvider } from "../services/ThemeContext";
import { useTheme } from "../services/ThemeContext";


export default function BtnNavbar ({navigation}) {

    const { theme } = useTheme();

    return (
        <View style={[styles.buttonContainer , {backgroundColor : theme.background}]}>
        <View style={styles.wrapper}>
          <TouchableOpacity style={[styles.button , {backgroundColor : theme.cardBackground}]} onPress={() => {navigation.navigate('ScreenA')}}>
            <Image source={require('../assets/home-icon.png')}  style={[styles.homeIcon, {tintColor : theme.text}]}/>
          </TouchableOpacity>
        </View>
        <View style={styles.wrapper}>
          <TouchableOpacity style={[styles.button , {backgroundColor : theme.cardBackground}]} onPress={() => {navigation.navigate('ScreenB')}}>
            <Image source={require('../assets/localization.png')} style={[styles.homeIcon , {tintColor : theme.text}]}/>
          </TouchableOpacity>
        </View>
        <View style={styles.wrapper}>
          <TouchableOpacity style={[styles.button, {backgroundColor : theme.cardBackground} ]} onPress={() => {navigation.navigate('ScreenC')}}>
            <Image source={require('../assets/food-icon.png')} style={[styles.icons , {}]}/>
          </TouchableOpacity>
        </View>
        <View style={styles.wrapper}>
          <TouchableOpacity style={[styles.button , {backgroundColor : theme.cardBackground}]} onPress={() => {navigation.navigate('ScreenD')}}>
            <Image source={require('../assets/profile-picture.png')} style={[styles.homeIcon , {tintColor : theme.text}]}/>
          </TouchableOpacity>
        </View>
      </View>
    )
}
const styles = StyleSheet.create({
    buttonContainer : {
        position : 'absolute',
        bottom : 0,
        flexDirection : 'row',
        paddingVertical : 20,
        justifyContent : 'space-around',
        backgroundColor : '#000'
      },
      wrapper : {
        flex : 1,
        marginHorizontal : 5,
      },
      button : {
        backgroundColor: '#21201f',
        paddingHorizontal: 15,
        paddingVertical : 15,
        borderRadius : 10,
        alignItems: 'center'
      },
      buttonText : {
        fontSize : 16,
        color : '#fff'
      },
      icons : {
        width: 28,
        height: 28,
        
      },
      homeIcon : {
        tintColor : '#fff',
        width: 28,
        height: 28,
      }
})