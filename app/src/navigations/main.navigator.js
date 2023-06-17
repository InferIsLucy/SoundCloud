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
<<<<<<< HEAD
import { Colors } from "../theme/color";
=======
import { AdminNavigator } from "./admin.navigator";
import { AdminContextProvider } from "../providers/admin.context";

const STATUS_BAR_HEIGHT = StatusBar.currentHeight;
>>>>>>> c3bdd7d941d7eb3aa125f7e667ce3de38647fc06
const Navigator = () => {
  const { isAuthenticated, isCheckingLoggedin, isLoading, user } = useContext(
    AuthenticationContext
  );
  const { isPlayerVisible, setPlayerVisbile } = useContext(AudioContext);
  if (isCheckingLoggedin) {
    return <WelcomeScreen></WelcomeScreen>;
  }
<<<<<<< HEAD
  return (
    <>
      <Modal
        animationType="fade"
        transparent={false}
        visible={isPlayerVisible}
        onRequestClose={() => {
          setPlayerVisbile(!isPlayerVisible);
        }}
      >
        <PlayerScreen></PlayerScreen>
      </Modal>
      <NavigationContainer
        style={{
          backgroundColor: Colors.authBackground,
        }}
      >
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: Colors.authBackground,
          }}
        >
          {isAuthenticated == false ? (
            <AuthNavigator
              style={{
                backgroundColor: Colors.authBackground,
              }}
            ></AuthNavigator>
          ) : (
            <AppNavigator>
              {" "}
              style=
              {{
                backgroundColor: Colors.authBackground,
              }}
            </AppNavigator>
          )}
        </SafeAreaView>
      </NavigationContainer>
    </>
  );
=======
  if (user != null && user.displayName == "admin") {
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
        <Modal
          animationType="fade"
          transparent={false}
          visible={isPlayerVisible}
          onRequestClose={() => {
            setPlayerVisbile(!isPlayerVisible);
          }}
        >
          <PlayerScreen></PlayerScreen>
        </Modal>
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
>>>>>>> c3bdd7d941d7eb3aa125f7e667ce3de38647fc06
};

export default Navigator;
