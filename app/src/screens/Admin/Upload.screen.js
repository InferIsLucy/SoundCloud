import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const UploadScreen = () => {
  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        console.log("result image picker", result);
        await updateUserInfor({ avatar: result.uri });
        setAvatarUri(result.uri);
      }
    } catch (err) {
      console.log("error when select image", err);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>UploadScreen</Text>
      <TouchableOpacity>
        <Text>Image</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UploadScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
  },
  heading: {
    fontSize: 36,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    marginBottom: 12,
  },
});
