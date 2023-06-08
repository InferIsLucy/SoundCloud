import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import HomeScreen from "../screens/Home.screen";
import UserProfile from "../screens/UserProfile/UserProfile.screen";
import BottomPlayer from "../screens/MusicPlayer/BottomPlayerBar.screen";
import PlayList from "../screens/Libarary.screen";

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "User") {
              iconName = "user";
            } else if (route.name === "Settings") {
              iconName = "settings";
            }
            // You can return any component that you like here!
            return <Feather name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen
          name="Home"
          options={{ headerShown: false }}
          component={HomeScreen}
        />
        {/* <Tab.Screen name="Library" options={{ headerShown: false }} component={Library} /> */}
        <Tab.Screen
          name="User"
          options={{ headerShown: false }}
          component={UserProfile}
        />
        <Tab.Screen
          name="Settings"
          options={{ headerShown: false }}
          component={PlayList}
        />
      </Tab.Navigator>
      <View style={{ position: "absolute", bottom: 48, left: 0, right: 0 }}>
        <BottomPlayer></BottomPlayer>
      </View>
    </>
  );
};
