import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView, Platform, StatusBar } from "react-native";
import { AuthNavigator } from "./auth.navigator";
import { useContext } from "react";
import { AuthenticationContext } from "../providers/authentication.context";
import { AppNavigator } from "./app.navigator";

const Navigator = () => {
  const { isAuthenticated } = useContext(AuthenticationContext);
  return (
    <NavigationContainer>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        {isAuthenticated == false ? (
          <AuthNavigator></AuthNavigator>
        ) : (
          <AppNavigator></AppNavigator>
        )}
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default Navigator;
