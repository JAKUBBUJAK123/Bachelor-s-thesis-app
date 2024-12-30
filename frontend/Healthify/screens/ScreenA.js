import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity , ScrollView, ProgressBarAndroidBase} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProgresBar from 'react-native-progress/Bar';
import { useEffect, useState } from 'react';
import { fetchMeals } from '../services/apiService';

import BtnNavbar from "../components/BtnNavbar";

export default function ScreenA({navigation}) {

    const [maxKcal , setMaxKcal] = useState(3000)
    const [calories , setCalories] = useState(0);
    const [fat , setFat] = useState(0);
    const [protein , setProtein] = useState(0);
    const [carbs , setCarbs] = useState(0);
    const [loading , setLoading] = useState(true)
  
    useEffect(() => {
      const fetchLoginStatus = async () => {
        const token = await AsyncStorage.getItem("AuthToken");

      };
      fetchLoginStatus();
  }, []);
  
      const fetchData = async () => {
          const data = await fetchMeals();
          console.log(data)
          const totalKcal = data.reduce((acc, meal) => acc + meal.macros.Calories, 0);
          const totalFat = data.reduce((acc, meal) => acc + meal.macros.Fat, 0);
          const totalProtein = data.reduce((acc, meal) => acc + meal.macros.Protein, 0);
          const totalCarbs = data.reduce((acc, meal) => acc + meal.macros.Carbs, 0);
          setCalories(totalKcal)
          setFat(totalFat)
          setProtein(totalProtein)
          setCarbs(totalCarbs)
          setLoading(false)
          console.log(totalKcal,totalFat,totalProtein)
      }
      
      useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData();
        });
        return unsubscribe;
    }, [navigation]);

      useEffect(() => {
          const unsubscribeBlur = navigation.addListener('blur', () => {
              resetNutritionalData(); 
          });
          return unsubscribeBlur;
      }, [navigation]);

    const resetNutritionalData = () => {
        setCalories(0);
        setFat(0);
        setProtein(0);
        setCarbs(0);
    };
  
    return (
      <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Health tracker</Text>
      </View>
  
      <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <View style={styles.component}>
          <Text style={styles.text}>Steps</Text>
          <ProgresBar progress={0.6} width={null} color={'#4caf50'} styles={styles.progresBar}/>
          <Text style={styles.text}>Time</Text>
          <Text style={styles.text}>Burned kcal</Text>
        </View>
  
        <View style={styles.component}>
          <Text style={styles.text}>Calories</Text>
          <ProgresBar progress={calories / maxKcal} width={null} height={10} color={'#c761b6'} marginBottom={10} styles={styles.progresBar}/>
          <ProgresBar progress={fat / maxKcal} width={null} height={10} color={'#fcba03'} marginBottom={10} styles={styles.progresBar}/>
          <ProgresBar progress={protein / maxKcal} width={null} height={10} color={'#3498db'} marginBottom={10} styles={styles.progresBar}/>
          <ProgresBar progress={carbs / maxKcal} width={null} height={10} color={'#8714b5'} marginBottom={10} styles={styles.progresBar}/>
        </View>
  
        <View style={styles.component}>
          <Text style={styles.text}>Recent activity</Text>
          <ProgresBar progress={0.1} width={null} color={'#f39c12'} styles={styles.progresBar}/> 
        </View>
  
        <View style={styles.component}>
          <Text style={styles.text}>Your current mood</Text>
          <ProgresBar progress={0.8} width={null} color={'#9b59b6'} styles={styles.progresBar}/> 
        </View>
      </View>
      
      </ScrollView>
  
      <BtnNavbar navigation={navigation}/>
    </View>
    )
    
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
      paddingBottom: 150,
      marginBottom : 40
  },
    title: {
      fontSize : 32,
      color : '#fff',
      marginBottom : 20
    }, 
    titleContainer : {
      paddingVertical :10,
      alignItems : 'center',
      backgroundColor : '#333',
      paddingTop : 50
    },
    content : {
      width : '90%',
      marginVertical : 10   
    },
    component : {
      marginBottom : 10,
      backgroundColor : '#3A3736',
      paddingHorizontal : 60,
      paddingVertical : 40,
      borderRadius : 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
    },
    text : {
      fontSize : 22,
      color : '#fff',
      marginVertical : 5,
    },
    progresBar: {
      marginTop: 10,
      borderRadius: 5,
      
    },
  });