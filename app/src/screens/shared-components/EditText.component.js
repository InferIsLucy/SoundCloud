import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import React, { useState } from "react";

const EditText = ({
  value,
  iconLeft,
  placeholder,
  onChangeText,
  isPasswordType = false,
  togglePasswordVisibility,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <TextInput
      style={styles.textInput}
      value={value}
      placeholder={placeholder}
      secureTextEntry={isPasswordType && !showPassword}
      right={
        isPasswordType && (
          <TextInput.Icon
            size={20}
            style={{
              marginRight: 0,
              fontSize: 12,
            }}
            onPress={() => {
              setShowPassword(!showPassword);
            }}
            icon={showPassword ? "eye-off" : "eye"}
          />
        )
      }
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
    backgroundColor: "white",
  },
});
