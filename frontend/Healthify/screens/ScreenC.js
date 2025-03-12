import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity , ScrollView, TextInput , Modal, Button} from "react-native";
import { useState, useEffect } from "react";
import { fetchMeals, updateMeals, addMeals } from "../services/apiService";
import AsyncStorage from '@react-native-async-storage/async-storage';

import BtnNavbar from "../components/BtnNavbar";
import { handleSearchFood, handleLogout } from "../services/apiService";


export default function ScreenC({navigation}) {
    const [foodQuery , setFoodQuery] = useState("");
    const [results, setResults] = useState(null);
    const [meals, setMeals] = useState([
      {id:1,name : "Breakfast" , macros : {Calories : 0, Carbs : 0 ,Protein: 0, Fat: 0 }},
      {id:2,name : "Dinner" , macros : {Calories : 0, Carbs : 0 ,Protein: 0, Fat: 0 }},
      {id:3,name : "Lunch" , macros : {Calories : 0, Carbs : 0 ,Protein: 0, Fat: 0 }},
      {id:4,name : "Supper" , macros : {Calories : 0, Carbs : 0 ,Protein: 0, Fat: 0 }},
  ]);
    const [modal , setModal] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState(null)
    const [gram, setGram] = useState('100')

    const [debounceTimeout, setDebounceTimeout] = useState(null);


    const fetchData = async () => {
          const data = await fetchMeals();
          setMeals(data);
        };
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
          fetchData();
      });
      return unsubscribe;
  }, [navigation]);


  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
  
    const timeout = setTimeout(() => {
      handleUpdateMeal(meals);
    }, 500);
  
    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [meals]);
 

    const handleUpdateMeal = async (updatedMeal) => {
        const token = await AsyncStorage.getItem("AuthToken");
        if (!token) {
            throw new Error("User not authicanted")};
        
        const responsesList =[]    
        for (const meal of meals) {
          const updatedData = {
              id: meal.id,
              Calories: meal.macros.Calories,
              Carbs: meal.macros.Carbs,
              Protein: meal.macros.Protein,
              Fat: meal.macros.Fat,
              };
          const response = await fetch(`http://192.168.0.158:5000/api/meals` , {
              method : 'PUT',
              headers : {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(updatedData)
        });
        const data = await response.json();
        responsesList.push(data)
        };
        return responsesList;
    };


    const addMacrosToMeal = (mealId, foodDescription, gram) => {
        const match = foodDescription.match(/Calories: (\d+)kcal \| Fat: ([\d.]+)g \| Carbs: ([\d.]+)g \| Protein: ([\d.]+)g/);
  if (match) {
    const [, calories, fat, carbs, protein] = match;
    const gramFactor = parseFloat(gram)/ 100
    setMeals((prevMeals) =>
      prevMeals.map((meal) =>
        meal.id === mealId
          ? {
              ...meal,
              macros: {
                Calories: Math.round((meal.macros.Calories + parseFloat(calories))* gramFactor),
                Fat: Math.round(meal.macros.Fat + parseFloat(fat) * gramFactor),
                Carbs: Math.round(meal.macros.Carbs + parseFloat(carbs)* gramFactor),
                Protein: Math.round(meal.macros.Protein + parseFloat(protein) * gramFactor),
              },
            }
          : meal
      )
    );
  } else {
    console.error("Failed to parse food description:", foodDescription);
  }
};



const handleAddMeal = async (newMeal) =>{
  await addMeals(newMeal)
  const updatedMeal = await fetchMeals();
  setMeals(updatedMeal)
}





    return (
<View style={style.Container}>
  <Text style={style.Header}>Food Tracker</Text>

  <View style={style.wrapper}>
    <ScrollView contentContainerStyle={style.scrollContent}>
    {meals.map((meal) => (
        <View key={meal.id} style={style.ListComponent}>
          <View>
            <Text style={style.listText}>{meal.name}</Text>
            <Text style={style.macroText}>
              Calories: {meal.macros.Calories} kcal, C: {meal.macros.Carbs} g, P: {meal.macros.Protein} g, F: {meal.macros.Fat} g
            </Text>
          </View>
          <TouchableOpacity
            style={style.PlusBtn}
            onPress={() => {
              setSelectedMeal(meal.id);
              setModal(true);
            }}
          >
            <Text style={style.PlusText}>+</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Modal visible={modal} animationType="slide" transparent={true} onRequestClose={() => setModal(false)}>
        <View style={style.modalOverlay}>
          <View style={style.modalContent}>
            <TextInput
              style={style.searchInput}
              placeholder="Search for food"
              placeholderTextColor="#000"
              textAlign="center"
              value={foodQuery}
              onChangeText={setFoodQuery}
            />
            <TouchableOpacity style={style.searchButton} onPress={() => handleSearchFood(foodQuery,setResults)}>
              <Text style={style.searchButtonText}>Search</Text>
            </TouchableOpacity>

            <View style={style.resultsContainer}>
            <TextInput style={style.gramInput} placeholder="g" value={gram} onChangeText={setGram} keyboardType="numeric"></TextInput>
              <ScrollView contentContainerStyle={style.scrollResults}>
                {results && results.descriptions && results.descriptions.length > 0 ? (
                  results.descriptions.map((description, index) => (
                    <View key={index} style={style.resultItem}>
                      <Text style={style.jsonText}>{description}</Text>
                      <TouchableOpacity
                        style={style.addButton}
                        onPress={() => {
                          addMacrosToMeal(selectedMeal, description, gram || 100);
                          setModal(false);
                        }}
                      >
                        <Text style={style.addButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text style={style.noResultsText}>No results found</Text>
                )}
              </ScrollView>
            </View>
            <TouchableOpacity style={style.closeButton} onPress={() => setModal(false)}>
              <Text style={style.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  </View>
  <BtnNavbar navigation={navigation} />
</View>

)}
const style = StyleSheet.create({
    Container: {
      flex: 1,
      padding: 0,
      backgroundColor: '#262322',
    },
    wrapper: {
      flex: 1,
      width: '100%',
    },
    scrollContent: {
      alignItems: 'center',
      paddingBottom: 150,
    },
    ListComponent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      maxWidth: 350,
      backgroundColor: '#3A3736',
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 15,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    PlusBtn: {
      backgroundColor: '#fff',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 25,
    },
    Header: {
      fontSize: 24,
      textAlign: 'center',
      marginBottom: 20,
      paddingTop: 30,
      color: '#fff',
    },
    listText: {
      fontSize: 18,
      color: '#fff',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#262322',
      padding: 20,
      borderRadius: 10,
      width: '90%',
      alignItems: 'center',
      maxHeight: '80%',
    },
    searchInput: {
      width: '100%',
      padding: 10,
      marginBottom: 10,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: '#CCC',
      backgroundColor: '#FFF',
    },
    gramInput : {
      width: '30%',
      padding: 10,
      marginBottom: 10,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: '#CCC',
      backgroundColor: '#FFF',
    },
    searchButton: {
      backgroundColor: '#1e9c1c',
      paddingVertical: 16,
      width: '100',
      height: '60',
      alignItems: 'center',
      borderRadius: 12,
      marginTop: 20,
      marginBottom:10,
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    searchButtonText:{
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 20,
      letterSpacing: 1,
    },
    resultsContainer: {
        maxHeight: 300,
        width: '100%',
        marginVertical: 10
    },
    scrollResults: {
        paddingVertical: 10,
        alignItems: 'center',
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 350,
        backgroundColor: '#3A3736',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 5,
    },
    jsonText: {
      flex : 1,
      color: '#FFF',
      fontSize: 14,
      marginBottom: 5,
    },
    noResultsText: {
      color: '#CCC',
      textAlign: 'center',
      marginTop: 10,
      fontSize: 16,
    },
    addButton: {
      backgroundColor: '#1e9c1c',
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderRadius: 5,
    },
    addButtonText: {
      color: '#FFF',
      fontWeight: 'bold',
    },
    closeButton: {
      marginTop: 10,
      backgroundColor: '#FF4C4C',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 5,
    },
    closeButtonText: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 16,
    },
    macroText : {
        fontSize : 12,
        color : '#FFF'
    }
  });
  