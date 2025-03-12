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
          <Text style={styles.title}>Health Tracker</Text>
        </View>
  
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Activity</Text>
              <View style={styles.metricContainer}>
                <Icon name="rocket" size={20} color="#4caf50" />
                <Text style={styles.metricText}>Steps: {steps} /</Text>
                <Text style={styles.metricText2}>10000 </Text>
              </View>
              <ProgresBar progress={steps / 10000} width={null} height={15} color={'#4caf50'} />
              <View style={styles.metricContainer}>
                <Icon name="map-marker" size={20} color="#25c1d9" />
                <Text style={styles.metricText}>Distance: {distance} km /</Text>
                <Text style={styles.metricText2}>10 km</Text>
              </View>
              <ProgresBar progress={distance / 10} width={null} height={15} color={'#25c1d9'} />
              <View style={styles.metricContainer}>
                <Icon name="fire" size={20} color="#d44e1e" />
                <Text style={styles.metricText}>Burned: {burnedKcal} /</Text>
                <Text style={styles.metricText2}>1000 kcal</Text>
              </View>
              <ProgresBar progress={burnedKcal / 1000} width={null} height={15} color={'#d44e1e'} />
            </View>
  
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Nutrition</Text>
              <View style={styles.metricContainer}>
                <Icon name="fire" size={20} color="#c761b6" />
                <Text style={styles.metricText}>Calories: {calories} /</Text>
                <Text style={styles.metricText2}>{maxKcal} kcal </Text>
              </View>
              <ProgresBar progress={calories / maxKcal} width={null} height={15} color={'#c761b6'} />
              <View style={styles.metricContainer}>
                <Icon name="tint" size={20} color="#fcba03" />
                <Text style={styles.metricText}>Fat: {fat} /</Text>
                <Text style={styles.metricText2}>{maxFat}g </Text>
              </View>
              <ProgresBar progress={fat / maxFat} width={null} height={15} color={'#fcba03'} />
              <View style={styles.metricContainer}>
                <Icon name="leaf" size={20} color="#3498db" />
                <Text style={styles.metricText}>Protein: {protein} /</Text>
                <Text style={styles.metricText2}>{maxProtein}g </Text>
              </View>
              <ProgresBar progress={protein / maxProtein} width={null} height={15} color={'#3498db'} />
              <View style={styles.metricContainer}>
                <Icon name="pagelines" size={20} color="#8714b5" />
                <Text style={styles.metricText}>Carbs: {carbs} /</Text>
                <Text style={styles.metricText2}>{maxCarbs}g </Text>
              </View>
              <ProgresBar progress={carbs / maxCarbs} width={null} height={15} color={'#8714b5'} />
            </View>
  
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Mood</Text>
              <ProgresBar progress={mood / 100} width={null} height={15} color={'#9b59b6'} />
              <MoodComponent style={styles.moodIcon} mood={mood} />
            </View>
          </View>
        </ScrollView>
  
        <BtnNavbar navigation={navigation} />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#262322',
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 150,
    },
    titleContainer: {
      paddingVertical: 10,
      alignItems: 'center',
      backgroundColor: '#333',
      paddingTop: 50,
    },
    title: {
      fontSize: 32,
      color: '#fff',
      fontWeight: 'bold',
    },
    content: {
      width: '100%',
      marginVertical: 10,
    },
    card: {
      backgroundColor: '#3A3736',
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
    },
    cardTitle: {
      fontSize: 24,
      color: '#fff',
      fontWeight: 'bold',
      marginBottom: 15,
    },
    metricContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      marginTop: 15
    },
    metricText: {
      fontSize: 18,
      color: '#fff',
      marginLeft: 10,
      fontWeight: 'bold',
    },
    metricText2: {
      fontSize: 20,
      color: '#a8a7a3',
      marginLeft: 10,
      fontWeight: 'bold',
    },
    moodIcon: {
      alignSelf: 'center',
      marginTop: 20,
    },
  });