import React from "react";
import {View, StyleSheet, ImageBackground} from "react-native";
import COLORS from "../consts/colors";
import { StatusBar } from "expo-status-bar";
const OnboardMSScreen = ({navigation}) => {
    return <View style={{flex: 1}}>
    <StatusBar/>    
    <ImageBackground
        style={{flex: 1}}
        />
    </View>
}
