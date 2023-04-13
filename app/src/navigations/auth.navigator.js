import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthScreen from "../screens/Authentication.screen";
import LoginScreen from "../screens/Login.screen";
import RegisterScreen from "../screens/Register.screen";

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
