import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useState, useContext } from "react";
import { AdminContext } from "../../../providers/admin.context";
const color = {
  APP_BG: "#fff",
  FONT: "#303d49",
  FONT_MEDIUM: "#636363",
  FONT_LIGHT: "#b6b8b9",
  MODAL_BG: "rgba(0,0,0,0.2)",
  ACTIVE_BG: "#5252ad",
  ACTIVE_FONT: "#fff",
};
const UpdateFieldComponent = ({
  visible,
  onClose,
  collectionName,
  docId,
  selectedFieldName,
  selectedValue,
  updateNewValue,
}) => {
  const [newValue, setNewValue] = useState(selectedValue);
  const { updateField } = useContext(AdminContext);
  const handleUpdateField = async () => {
    try {
      await updateField(collectionName, docId, selectedFieldName, newValue);
      updateNewValue(newValue);
      onClose();
    } catch (er) {
      console.log(er);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}
    >
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={() => onClose()} style={{ flex: 1 }}>
          <View style={[StyleSheet.absoluteFillObject, styles.modalBG]} />
        </TouchableWithoutFeedback>
        <View style={styles.inputContainer}>
          <Text style={{ color: color.ACTIVE_BG }}>{`Input new value`}</Text>
          <TextInput
            value={newValue}
            defaultValue={selectedValue}
            onChangeText={(text) => setNewValue(text)}
            style={styles.input}
          />
          <TouchableOpacity onPress={handleUpdateField}>
            <Feather
              style={styles.submitIcon}
              name="save"
              size={24}
              color={color.ACTIVE_FONT}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableWithoutFeedback onPress={() => onClose()} style={{ flex: 1 }}>
        <View style={[styles.modalBG]} />
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default UpdateFieldComponent;

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: width - 20,
    height: 200,
    borderRadius: 10,
    backgroundColor: color.ACTIVE_FONT,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: width - 40,
    borderBottomWidth: 1,
    borderBottomColor: color.ACTIVE_BG,
    fontSize: 18,
    paddingVertical: 5,
  },
  submitIcon: {
    padding: 10,
    backgroundColor: color.ACTIVE_BG,
    borderRadius: 50,
    marginTop: 15,
  },
  modalBG: {
    backgroundColor: color.MODAL_BG,
  },
});
