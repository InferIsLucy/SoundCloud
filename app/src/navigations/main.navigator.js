import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView, Platform, StatusBar } from "react-native";
import { AuthNavigator } from "./auth.navigator";

const Navigator = () => {
  return (
    <NavigationContainer>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <AuthNavigator></AuthNavigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default Navigator;
