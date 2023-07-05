import React, {
  useContext,
  useEffect,
  memo,
  useLayoutEffect,
  useState,
} from "react";
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  Touchable,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { UserContext } from "../../../providers/user.context";
import EditText from "../../shared-components/EditText.component";
import { sendPasswordResetEmail } from "firebase/auth";

const ForgetPassword = ({ visible, onClose }) => {
  const { auth } = useContext(UserContext);
  const [email, setEmail] = useState();
  const handleResetPassword = () => {
    console.log("email", email);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("sended");
        Alert.alert("Success!");
      })
      .catch((er) => console.log("error", er))
      .finally(() => {
        onClose();
      });
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      onRequestClose={() => {
        onClose();
      }}
      visible={visible}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          onClose();
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }} />
          <View style={styles.subModalTimerContainer}>
            <EditText
              placeholder={"Email"}
              iconLeft={"email"}
              value={email}
              onChangeText={(newText) => {
                setEmail(newText);
              }}
            ></EditText>
            <TouchableOpacity style={styles.btn} onPress={handleResetPassword}>
              <MaterialCommunityIcons
                name="email-send-outline"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1.2 }} />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  subModalTimerContainer: {
    backgroundColor: "white",
    justifyContent: "center",
    paddingTop: 12,
    flexDirection: "row",
    margin: 12,
    alignItems: "center",
    borderRadius: 12,
    paddingBottom: 12,
  },
  btn: {
    paddingVertical: 12,
  },
});

export default ForgetPassword;
