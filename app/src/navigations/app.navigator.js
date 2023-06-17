import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/Home.screen";
import UserProfile from "../screens/UserProfile/UserProfile.screen";
import BottomPlayer from "../screens/MusicPlayer/BottomPlayerBar.screen";

//Library Screen

import { Colors } from "../theme/color";
import PlayList from "../screens/Library.screen";

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <>
      <Tab.Navigator
        style={{
          backgroundColor: Colors.authBackground,
        }}
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "User") {
              iconName = "user";
            } else if (route.name === "Settings") {
              iconName = "settings";
              return <Ionicons name="library" size={size} color={color} />;
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
      <View
        style={{
          position: "absolute",
          bottom: 48,
          left: 0,
          right: 0,
          backgroundColor: Colors.authBackground,
        }}
      >
        <BottomPlayer
          style={{
            backgroundColor: Colors.authBackground,
          }}
        ></BottomPlayer>
      </View>
    </>
  );
};
