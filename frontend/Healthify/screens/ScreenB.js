import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Location from 'expo-location';
import { Accelerometer } from "expo-sensors";
import MapView, { Marker } from 'react-native-maps';

import BtnNavbar from "../components/BtnNavbar";

export default function ScreenB({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);

  const [steps, setSteps] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [lastTimeStamp , setLastTimeStamp] = useState(0);


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

  const resetSteps = () => {
    setSteps(0);
  };

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      let reverseGeocode = await Location.reverseGeocodeAsync(location.coords);
      setAddress(reverseGeocode[0]);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Lat: ${location.coords.latitude}, Long: ${location.coords.longitude}`;
  }

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
        </MapView>
      )}
      <View styles={styles.infoCont}>
      <Text style={styles.text}>Steps</Text>
      <Text style={styles.steps}>{steps}</Text>
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
