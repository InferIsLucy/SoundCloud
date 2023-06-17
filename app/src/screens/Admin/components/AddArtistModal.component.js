import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../../theme/color";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import RNDateTimePicker from "@react-native-community/datetimepicker";

import { ArtistRef, SongRef } from "../const";
import { AdminContext } from "../../../providers/admin.context";
import { formatDate } from "../../../utils/TimeFormater";
import { isStringNullOrEmpty, isValidAge } from "../../../utils/Validator";

//Modal add an artist to database
const AddArtistModal = ({ visible, onClose }) => {
  const { uploadFile, addDocument } = useContext(AdminContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [avatarUri, setAvatarUri] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleAddNewArtist = async () => {
    try {
      if (
        isStringNullOrEmpty(name) ||
        isStringNullOrEmpty(email) ||
        isStringNullOrEmpty(avatarUri) ||
        !isValidAge(dateOfBirth)
      ) {
        Alert.alert("Invalid information");
        return;
      }
      const downloadUri = await uploadFile(avatarUri, "images/");
      const newArtist = {
        name,
        email,
        dateOfBirth,
        deletedAt: null,
        avtUri: downloadUri,
      };
      addDocument(ArtistRef, newArtist);
      Alert.alert("Success!");
      onClose();
    } catch (er) {
      console.log(er);
    }
  };
  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setAvatarUri(result.uri);
      }
    } catch (err) {
      console.log("error when select image", err);
    }
  };
  return (
    <Modal
      animationType="fade"
      transparent={false}
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}
    >
      <LinearGradient
        colors={[
          "#231b4d",
          "rgba(255, 99, 71, 0.6)",
          "rgba(255, 99, 71, 0.4)",
          "rgba(255, 99, 71, 0.3)",
          "rgba(255, 99, 71, 0)",
        ]}
        style={styles.background}
      >
        <ImageBackground
          style={styles.bgImage}
          imageStyle={styles.imgLeft}
          source={
            avatarUri
              ? { uri: avatarUri }
              : require("../../../../assets/noImage.jpg")
          }
        >
          <TouchableOpacity onPress={selectImage} style={styles.camera}>
            <AntDesign name="camera" size={24} color="#a095cc" />
          </TouchableOpacity>
        </ImageBackground>

        <TouchableOpacity
          onPress={() => {
            onClose();
          }}
          style={{ position: "absolute", right: 12, top: 12 }}
        >
          <AntDesign name="close" size={24} color="#a095cc" />
        </TouchableOpacity>
        <View
          style={{
            marginTop: 32,
            marginLeft: 150,
            width: "100%",
          }}
        >
          <Text numberOfLines={2} style={styles.title}>
            Add New Artist
          </Text>
          <View style={{ flexDirection: "row", marginLeft: 12, marginTop: 12 }}>
            <Ionicons name="person" size={24} color="#514b75" />
            <TextInput
              value={name}
              placeholder="Artist Nickname"
              onChangeText={(text) => setName(text)}
              numberOfLines={1}
              style={styles.subtitle}
            ></TextInput>
          </View>
          <View style={styles.item}>
            <Ionicons name="ear" size={16} color="#514b75" />
            <TextInput
              value={email}
              placeholder="Email"
              onChangeText={(text) => setEmail(text)}
              numberOfLines={1}
              style={styles.listens}
            ></TextInput>
          </View>
          <TouchableOpacity
            onPress={() => {
              setShowDatePicker(true);
            }}
            style={styles.item}
          >
            <Ionicons name="calendar" size={16} color="#514b75" />
            <Text numberOfLines={1} style={styles.listens}>
              {formatDate(dateOfBirth)}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <RNDateTimePicker
              maximumDate={new Date()}
              mode="date"
              onChange={(e, date) => {
                if (e.type == "set") {
                  setDateOfBirth(date);
                }
                setShowDatePicker(false);
              }}
              value={dateOfBirth}
            ></RNDateTimePicker>
          )}
        </View>

        <View style={styles.btnWraper}>
          <TouchableOpacity
            onPress={handleAddNewArtist}
            style={styles.btnContainer}
          >
            <Ionicons name="add" size={22} color="#514b75" />
            <Text style={styles.btn}>Create</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Modal>
  );
};

export default AddArtistModal;

const styles = StyleSheet.create({
  btn: {
    fontSize: 16,
    color: "#514b75",
    marginLeft: 4,
    fontWeight: "bold",
  },
  imgLeft: {
    borderRadius: 20,
  },
  bgImage: {
    position: "absolute",
    height: 180,
    width: 120,
    top: -20,
    left: -40,
  },
  camera: {
    position: "absolute",
    left: 50,
    bottom: 12,
  },
  background: {
    marginTop: 60,
    marginLeft: 50,
    height: 280,
    margin: 24,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: "white",
    alignItems: "center",
  },
  title: {
    color: Colors.textColor,
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 26,
    width: 200,
    marginLeft: 12,
  },
  subtitle: {
    color: "#514b75",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 20,
    width: 200,
  },
  listens: {
    color: "#514b75",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 16,
    width: 200,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
    marginTop: 12,
  },
  btnContainer: {
    width: 90,
    borderWidth: 4,
    borderColor: Colors.textColor,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: 12,
  },
  btnWraper: {
    flexDirection: "row",
    position: "absolute",
    bottom: 12,
    right: 12,
  },
});
