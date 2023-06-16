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
const Navigator = () => {
  const { isAuthenticated, isLoading } = useContext(AuthenticationContext);
  const { isPlayerVisible, setPlayerVisbile } = useContext(AudioContext);
  if (isLoading) {
    return <WelcomeScreen></WelcomeScreen>;
  }
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
};

export default Navigator;
