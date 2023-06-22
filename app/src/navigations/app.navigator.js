import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
import PlayerScreen from "../screens/MusicPlayer/Player.screen";
import Timer from "../screens/MusicPlayer/components/Timer";
import DetailPlaylist from "../screens/MusicPlayer/DetailPlayList.screen";
import { AudioContext } from "../providers/audio.context";
import { useContext } from "react";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const Tabs = () => {
  const { isBottomBarVisible } = useContext(AudioContext);
  return (
    <Tab.Navigator
      style={{
        marginTop: isBottomBarVisible ? 100 : 15,
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
  );
};
export const AppNavigator = () => {
  return (
    <>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="AppTabs"
      >
        <Stack.Screen name="AppTabs" component={Tabs} />
        <Stack.Screen name="Player" component={PlayerScreen} />
        <Stack.Screen name="DetailPlaylist" component={DetailPlaylist} />
      </Stack.Navigator>
      <BottomPlayer></BottomPlayer>
      <View
        style={{
          position: "absolute",
          top: 12,
          right: 12,
        }}
      >
        <Timer duration={15}></Timer>
      </View>
    </>
  );
};
