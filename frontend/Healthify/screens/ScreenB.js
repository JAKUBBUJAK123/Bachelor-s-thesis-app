import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import * as Location from 'expo-location';
import { Accelerometer } from "expo-sensors";
import MapView, { Marker,Polyline } from 'react-native-maps';
import {getDistance} from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchPersonalUserInfomations, fetchWalkingData } from "../services/apiService";
import BtnNavbar from "../components/BtnNavbar";

export default function ScreenB({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);
  const [coords, setCoords] = useState([]);
  const [distance, setDistance] = useState(0);

  const [batchedSteps, setBatchedSteps] = useState(0);
  const [batchedDistance, setBatchedDistance] = useState(0);

  const [steps, setSteps] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [lastTimeStamp , setLastTimeStamp] = useState(0);

//login system
useEffect(() => {
  const fetchData = async () => {
    const data = await fetchWalkingData();
    setSteps(data.steps);
  };
  fetchData();
}, []);


//fetchiing data

const handleSave = async (totalSteps, totalDistance) => {
    const token = await AsyncStorage.getItem("AuthToken");

    const response = await fetch('http://192.168.0.227:5000/api/walking', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        steps: totalSteps,
        distance: totalDistance/1000,
        burned_kcal: totalSteps * 0.04,
      }),
    });
    const data = await response.json();
    return data;
};


  //counting steps
  useEffect(() => {
    let subscription;
    
    const checkAccelerometerAvailability = async () => {
      const result = await Accelerometer.isAvailableAsync();
      if (result) {
        subscription = Accelerometer.addListener((accelerometerData) => {
          const { y } = accelerometerData;
          const threshold = 0.1;
          const timestamp = new Date().getTime();

          
          if (Math.abs(y - lastY) > threshold && !isCounting && (timestamp - lastTimeStamp > 800)) {
            setIsCounting(true);
            setLastY(y);
            setLastTimeStamp(timestamp);

            setSteps(prevSteps => prevSteps + 1);
            setBatchedSteps((prevBatchedSteps) => prevBatchedSteps + 1);

            setTimeout(() => {
              setIsCounting(false);
            }, 300);
          }
        });
      }
    };

    checkAccelerometerAvailability();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [lastY, lastTimeStamp, isCounting]); 


  //getting map permissions
  useEffect(() => {
    const startLocationTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      const locationSubscription = Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          setLocation(newLocation);
          setCoords((prevCoords) => {
            const updatedCoords = [...prevCoords, newLocation.coords];
            const totalDistance = calculateDistance(updatedCoords);
            setDistance(totalDistance);
            setBatchedDistance(totalDistance);
            return updatedCoords;
          });
        }
      );

      return () => {
        locationSubscription.then((sub) => sub.remove());
      };
    };

    startLocationTracking();
  }, []);

  const calculateDistance = (coords) => {
    let totalDistance = 0;
    for (let i = 1; i < coords.length; i++) {
      const start = { latitude: coords[i - 1].latitude, longitude: coords[i - 1].longitude };
      const end = { latitude: coords[i].latitude, longitude: coords[i].longitude };
      totalDistance += getDistance(start, end);
    }
    return totalDistance;
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (batchedSteps > 0 || batchedDistance > 0) {
        await handleSave(steps, distance);
        setBatchedSteps(0);
        setBatchedDistance(0);
      }
    }, 6000); 
    return () => clearInterval(interval);
  }, [batchedSteps, batchedDistance, steps, distance]);


//  useEffect(() => {
//    const simulateMovement = () => {
//      const newLocation = {
//        coords: {
//          latitude: location ? location.coords.latitude + 0.0001 : 37.78825,
//          longitude: location ? location.coords.longitude + 0.0001 : -122.4324,
//        },
//      };
//      setLocation(newLocation);
//      setCoords(prevCoords => [...prevCoords, newLocation.coords]);
//    };//

//    const interval = setInterval(simulateMovement, 2000);//

//    return () => clearInterval(interval);
//  }, [location]);




  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your Current Localization</Text>
      {location && (
        <MapView
          style={styles.map}
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here!"
            description="This is your current location."
          />
          <Polyline
            coordinates={coords}
            strokeColor="#de001e"
            strokeWidth={6}
          />

        </MapView>
      )}
      <View styles={styles.infoCont}>
      <Text style={styles.text}>Steps: {steps}</Text>
      <Text style={styles.text}>Distance: {(distance.toFixed(1))/1000} km</Text>
      </View>

      <BtnNavbar navigation={navigation}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor : '#262322',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  map: {
    width: '90%',
    height: '60%',
    borderRadius : 15,
    marginBottom : 20
  },
  infoCont : {
    width: '90%',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,

  },
  text : {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  steps: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});
