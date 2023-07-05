import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";
import HistoryAndStatistic from "../screens/Admin/HistoryAndStatistic.screen";
import SongManager from "../screens/Admin/SongManager.screen";
import ArtistManager from "../screens/Admin/ArtistManager.screen";
import UploadScreen from "../screens/Admin/Upload.screen";
import { Modal } from "react-native";
import DetailItem from "../screens/Admin/components/DetailItem.component";
const Tab = createBottomTabNavigator();

export const AdminNavigator = () => {
  return (
    <>
      <Tab.Navigator
        initialRouteName="SongManager"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            let src;
            switch (route.name) {
              case "SongManager":
                src = require("../../assets/music_list.png");
                break;
              case "ArtistManager":
                src = require("../../assets/artist.png");
                break;
              case "HistoryAndStatistic":
                src = require("../../assets/user.png");
                break;
              case "Upload":
                src = require("../../assets/upload.png");
                break;
              default:
                src = null;
                break;
            }
            // You can return any component that you like here!
            return (
              <Image
                style={{ width: 26, height: 26, resizeMode: "contain" }}
                source={src}
              ></Image>
            );
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen
          name="SongManager"
          options={{ headerShown: false }}
          component={SongManager}
        />
        <Tab.Screen
          name="ArtistManager"
          options={{ headerShown: false }}
          component={ArtistManager}
        />
        <Tab.Screen
          name="Upload"
          options={{ headerShown: false }}
          component={UploadScreen}
        />
        <Tab.Screen
          name="HistoryAndStatistic"
          options={{ headerShown: false }}
          component={HistoryAndStatistic}
        />
      </Tab.Navigator>
    </>
  );
};
