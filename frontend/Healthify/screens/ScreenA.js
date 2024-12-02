import React from "react";
import { View, Text, StyleSheet } from "react-native";

import BtnNavbar from "../components/BtnNavbar";

export default function ScreenA({ navigation }) {
    return (
        <View style={style.Container}>
            <Text>Some thext i love tiwtch  </Text>
            <BtnNavbar navigation={navigation}/>
        </View>
        
    );
}
const style = StyleSheet.create(
    {
        Container : {
            flex : 1,
            textAlign : 'center',
            justifyContent : 'center',
        }
    }
)