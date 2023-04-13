import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import React from "react";

const EditText = ({
  value,
  iconLeft,
  placeholder,
  onChangeText,
  isPasswordType = false,
}) => {
  return (
    <TextInput
      style={styles.textInput}
      value={value}
      placeholder={placeholder}
      secureTextEntry={isPasswordType && true}
      onChangeText={onChangeText}
      left={
        <TextInput.Icon
          size={20}
          style={{
            marginRight: 0,
            fontSize: 12,
          }}
          disabled={true}
          icon={iconLeft}
        />
      }
    ></TextInput>
  );
};

export default EditText;

const styles = StyleSheet.create({
  textInput: {
    width: 300,
    marginTop: 8,
    fontSize: 14,
  },
});
