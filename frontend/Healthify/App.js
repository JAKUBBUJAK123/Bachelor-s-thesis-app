import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity , ScrollView, ProgressBarAndroidBase} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProgresBar from 'react-native-progress/Bar';


import ScreenA from './screens/ScreenA';
import ScreenB from './screens/ScreenB';
import ScreenD from './screens/ScreenD';
import ScreenC from './screens/ScreenC'
import BtnNavbar from './components/BtnNavbar';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={HomeScreen} options={{headerShown: false}}/>
        <Stack.Screen name='ScreenA' component={ScreenA} options={{headerShown: false}}/>
        <Stack.Screen name='ScreenB' component={ScreenB} options={{headerShown: false}}/>
        <Stack.Screen name='ScreenC' component={ScreenC} options={{headerShown: false}}/>
        <Stack.Screen name='ScreenD' component={ScreenD} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({navigation}) {
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
        <ProgresBar progress={0.6} width={null} color={'#3498db'} styles={styles.progresBar}/>
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
  progressBar: {
    marginTop: 10,
    borderRadius: 5,
  },
});
