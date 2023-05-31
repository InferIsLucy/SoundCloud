import { NavigationContainer } from "@react-navigation/native";
import { useAppState } from "@react-native-community/hooks";
import { useEffect, useContext } from "react";
import { SafeAreaView, Platform, StatusBar, Modal } from "react-native";
import { AuthNavigator } from "./auth.navigator";
import { AuthenticationContext } from "../providers/authentication.context";
import { AppNavigator } from "./app.navigator";
import PlayerScreen from "../screens/MusicPlayer/Player.screen";
import { AudioContext } from "../providers/audio.context";

const Navigator = () => {
  const { isAuthenticated } = useContext(AuthenticationContext);
  const { isPlayerVisible, setPlayerVisbile } = useContext(AudioContext);

  // const appState = useAppState();
  // useEffect(() => {
  //   const handleAppClose = async () => {
  //     await handleReact();
  //     console.log("App close");
  //   };
  //   if (appState !== "active") {
  //     handleAppClose();
  //   }
  // }, [appState]);

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
};

export default Navigator;
