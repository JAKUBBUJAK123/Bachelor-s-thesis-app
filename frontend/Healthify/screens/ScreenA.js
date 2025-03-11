import { StyleSheet, Text, View, Button, TouchableOpacity , ScrollView, ProgressBarAndroidBase} from 'react-native';
import ProgresBar from 'react-native-progress/Bar';
import { useEffect, useRef, useState } from 'react';
import { fetchMeals, fetchPersonalUserInfomations, fetchWalkingData } from '../services/apiService';
import { calculateMoodScore } from '../services/MoodCalculator';
import { MoodComponent } from '../services/MoodCalculator';
import Icon from 'react-native-vector-icons/FontAwesome';

import BtnNavbar from "../components/BtnNavbar";

export default function ScreenA({navigation}) {

    const [maxKcal , setMaxKcal] = useState(3000)
    const [maxFat, setMaxFat] = useState(3000)
    const [maxProtein, setMaxProtein] = useState(3000)
    const [maxCarbs, setMaxCarbs] = useState(3000)
    const [height, setHeight] = useState(1)
    const [weight, setWeight] = useState(1)
    const [age, setAge] = useState(1)

    const [calories , setCalories] = useState(0);
    const [fat , setFat] = useState(0);
    const [protein , setProtein] = useState(0);
    const [carbs , setCarbs] = useState(0);
    const [steps, setSteps] = useState(0);
    const [distance, setDistance] = useState(0);
    const [burnedKcal, setBurnedKcal] = useState(0);
    const [mood, setMood] = useState(0);
  
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
  
      const fetchData = async () => {
          const data = await fetchMeals();
          const walkingData = await fetchWalkingData();
          const userData = await fetchPersonalUserInfomations();

          const totalKcal = data.reduce((acc, meal) => acc + meal.macros.Calories, 0);
          const totalFat = data.reduce((acc, meal) => acc + meal.macros.Fat, 0);
          const totalProtein = data.reduce((acc, meal) => acc + meal.macros.Protein, 0);
          const totalCarbs = data.reduce((acc, meal) => acc + meal.macros.Carbs, 0);
          
          
          setWeight(userData.Weight);
          setHeight(userData.Height);
          setAge(userData.age);
          setCalories(totalKcal);
          setFat(totalFat);
          setProtein(totalProtein);
          setCarbs(totalCarbs);
          setSteps(walkingData.steps);
          setDistance(walkingData.distance);
          setBurnedKcal(walkingData.burned_kcal);

          calculateDailyIntake(userData.Weight, userData.Height, userData.age);
          const cmood = calculateMoodScore(
            walkingData.steps,
            walkingData.distance,
            walkingData.burned_kcal,
            totalKcal,
            totalFat,
            totalProtein,
            totalCarbs
          );
          setMood(cmood);
      }
      
    const resetNutritionalData = () => {
        setCalories(0);
        setFat(0);
        setProtein(0);
        setCarbs(0);
    };

    //calculating daily kcal intake
    const calculateDailyIntake= (weight, height, age)=> {
      const dkcal = Math.round(88.362 + 13.397*weight + 4.799*height - 5.677* age);
      setMaxKcal(dkcal) 
      setMaxProtein(Math.round((dkcal*0.25)/4))
      setMaxFat(Math.round((dkcal*0.25)/9))
      setMaxCarbs(Math.round((dkcal*0.5)/4))
    }



    return (
      <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Health tracker</Text>
      </View>
  
      <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <View style={styles.component}>
          <Text style={styles.text}>Steps {steps}/10000</Text>
          <ProgresBar progress={steps/6000} width={null} height={10} color={'#4caf50'} styles={styles.progresBar}/>
          <Text style={styles.text}>Total Distance {distance}km/10km</Text>
          <ProgresBar progress={distance} width={null} height={10} color={'#25c1d9'} styles={styles.progresBar}/>
          <Text style={styles.text}>Burned kcal {burnedKcal}/1000 kcal</Text>
          <ProgresBar progress={burnedKcal/2000} width={null} height={10} color={'#d44e1e'} styles={styles.progresBar}/>
        </View>
  
        <View style={styles.component}>
          <Text style={styles.text}>Calories {calories}/ {maxKcal} kcal </Text>
          <ProgresBar progress={calories / maxKcal} width={null} height={10} color={'#c761b6'} marginBottom={10} styles={styles.progresBar}/>
          <Text style={styles.text}>Fat {fat}/ {maxFat}g</Text>
          <ProgresBar progress={fat / maxFat} width={null} height={10} color={'#fcba03'} marginBottom={10} styles={styles.progresBar}/>
          <Text style={styles.text}>Protein {protein}/ {maxProtein}g</Text>
          <ProgresBar progress={protein / maxProtein} width={null} height={10} color={'#3498db'} marginBottom={10} styles={styles.progresBar}/>
          <Text style={styles.text}>Carbs {carbs}/ {maxCarbs}g</Text>
          <ProgresBar progress={carbs / maxCarbs} width={null} height={10} color={'#8714b5'} marginBottom={10} styles={styles.progresBar}/>
        </View>
  
  
        <View style={styles.component}>
          <Text style={styles.text}>Your current mood</Text>
          <ProgresBar progress={mood/100} width={null} color={'#9b59b6'} height={10} styles={styles.progresBar}/> 
          <MoodComponent mood={mood}/>
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