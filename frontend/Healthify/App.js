import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity , ScrollView, ProgressBarAndroidBase} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProgresBar from 'react-native-progress/Bar';
import { useEffect, useState } from 'react';

import { fetchMeals } from './services/apiService';
import ScreenA from './screens/ScreenA';
import ScreenB from './screens/ScreenB';
import ScreenD from './screens/ScreenD';
import ScreenC from './screens/ScreenC'
import BtnNavbar from './components/BtnNavbar';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import StartScreen from './screens/StartScreen';


const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='StartScreen' component={StartScreen} options={{headerShown: false}}/> 
        <Stack.Screen name='ScreenA' component={ScreenA} options={{headerShown: false}}/>
        <Stack.Screen name='ScreenB' component={ScreenB} options={{headerShown: false}}/>
        <Stack.Screen name='ScreenC' component={ScreenC} options={{headerShown: false}}/>
        <Stack.Screen name='ScreenD' component={ScreenD} options={{headerShown: false}}/>
        <Stack.Screen name='RegisterScreen' component={RegisterScreen} options={{headerShown: false}}/> 
        <Stack.Screen name='LoginScreen' component={LoginScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


