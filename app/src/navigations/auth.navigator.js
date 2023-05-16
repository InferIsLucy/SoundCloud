import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthScreen from "../screens/Authentication/Authentication.screen";
import LoginScreen from "../screens/Authentication/Login.screen";
import RegisterScreen from "../screens/Authentication/Register.screen";

const Stack = createNativeStackNavigator();

export const AuthNavigator = () => (
  <Stack.Navigator
    initialRouteName="Auth"
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Auth" component={AuthScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);
