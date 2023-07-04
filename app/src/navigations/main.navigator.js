import { NavigationContainer } from "@react-navigation/native";
import { useAppState } from "@react-native-community/hooks";
import { useEffect, useContext } from "react";
import { SafeAreaView, Platform, StatusBar, Modal } from "react-native";
import { AuthNavigator } from "./auth.navigator";
import { AuthenticationContext } from "../providers/authentication.context";
import { AppNavigator } from "./app.navigator";
import PlayerScreen from "../screens/MusicPlayer/Player.screen";
import { AudioContext } from "../providers/audio.context";
import WelcomeScreen from "../screens/Authentication/Welcome.screen";
import { Colors } from "../theme/color";
import { AdminNavigator } from "./admin.navigator";
import { AdminContextProvider } from "../providers/admin.context";

const STATUS_BAR_HEIGHT = StatusBar.currentHeight;
const Navigator = () => {
  const { isAuthenticated, isCheckingLoggedin, isLoading, user } = useContext(
    AuthenticationContext
  );
  if (isCheckingLoggedin) {
    return <WelcomeScreen></WelcomeScreen>;
  }
  if (user != null && user.isAdmin) {
    return (
      <NavigationContainer>
        <AdminContextProvider>
          <SafeAreaView style={{ flex: 1, marginTop: STATUS_BAR_HEIGHT }}>
            <AdminNavigator></AdminNavigator>
          </SafeAreaView>
        </AdminContextProvider>
      </NavigationContainer>
    );
  } else
    return (
      <>
        {/* <Modal
          animationType="fade"
          transparent={false}
          visible={isPlayerVisible}
          onRequestClose={() => {
            setPlayerVisbile(!isPlayerVisible);
          }}
        >
          <PlayerScreen></PlayerScreen>
        </Modal> */}
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
      </>
    );
};

export default Navigator;
