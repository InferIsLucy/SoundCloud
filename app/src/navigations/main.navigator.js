import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView, Platform, StatusBar, Modal } from "react-native";
import { AuthNavigator } from "./auth.navigator";
import { useContext } from "react";
import { AuthenticationContext } from "../providers/authentication.context";
import { AppNavigator } from "./app.navigator";
import PlayerScreen from "../screens/MusicPlayer/Player.screen";
import { AudioContext } from "../providers/audio.context";

const Navigator = () => {
  const { isAuthenticated } = useContext(AuthenticationContext);
  const { isPlayerVisible, setIsPlayerVisible } = useContext(AudioContext);
  return (
    <>
      <Modal
        animationType="fade"
        transparent={false}
        visible={isPlayerVisible}
        onRequestClose={() => {
          setIsPlayerVisible(!isPlayerVisible);
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
