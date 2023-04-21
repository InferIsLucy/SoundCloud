import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  console.log("appnaviagtor");
  <Stack.Navigator
    initialRouteName="Auth"
    screenOptions={{
      headerShown: false,
    }}
  ></Stack.Navigator>;
};
