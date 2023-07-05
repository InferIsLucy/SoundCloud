import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ImageBackground } from "react-native";
import { Colors } from "../../theme/color";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import { Audio } from "expo-av";
import { FontAwesome5 } from "@expo/vector-icons";

import { AdminContext } from "../../providers/admin.context";
import { isStringNullOrEmpty, isValidAge } from "../../utils/Validator";
import ArtistListModal from "./components/ArtistListModal.component";
import ArtistItem from "./components/ArtistItem.component";
import { UserContext } from "../../providers/user.context";
import { NotificationContext } from "../../providers/notification.context";
import { SongRef } from "./const";
const UploadScreen = () => {
  const playbackObject = new Audio.Sound();
  const { uploadFile, addDocument } = useContext(AdminContext);
  const { getListUser } = useContext(UserContext);
  const { sendNotificationToListUser } = useContext(NotificationContext);
  const [imageSongUri, setImageSongUri] = useState(null);
  const [mp3Uri, setMp3Uri] = useState(null);
  const [mp3Name, setMp3Name] = useState("");
  const [name, setName] = useState("");
  const [publishDate, setPublishDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [isArtistListVisible, setIsArtistListVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadSong = async () => {
    setIsLoading(true);
    try {
      if (
        isStringNullOrEmpty(name) ||
        selectedArtists.length == 0 ||
        isStringNullOrEmpty(mp3Uri) ||
        isStringNullOrEmpty(imageSongUri)
      ) {
        setIsLoading(false);
        Alert.alert("Invalid information");
        return;
      }
      const downloadImageUri = await uploadFile(imageSongUri, "images/");
      const downloadSongUri = await uploadFile(mp3Uri, "songs/");

      const { sound: playbackObject } = await Audio.Sound.createAsync({
        uri: downloadSongUri,
      });
      const status = await playbackObject.getStatusAsync();
      const allUserId = selectedArtists.reduce(
        (acc, artist) => acc.concat(artist.followers),
        []
      );
      const uniqueIds = allUserId.filter(
        (value, index, self) => self.indexOf(value) === index
      );

      const users = await getListUser(uniqueIds);
      const userTokens = users.map((user) => {
        if (user.expoNotifyToken) return user.expoNotifyToken;
      });
      console.log("status", status.durationMillis);

      const newSong = {
        name,
        publishDate,
        deletedAt: null,
        uri: downloadSongUri,
        imageUri: downloadImageUri,
        likes: [],
        artist: selectedArtists,
        listens: 0,
        duration: status.durationMillis,
      };
      await addDocument(SongRef, newSong);
      await sendNotification(
        userTokens,
        "THÔNG BÁO MỚI",
        `Bài hát ${name} vừa được phát hành.`
      );
      Alert.alert("Success!");
      refreshForm();
      setIsLoading(false);
    } catch (er) {
      console.log(er);
      setIsLoading(false);
    }
  };
  const sendNotification = async (userTokens, title, message) => {
    await sendNotificationToListUser(userTokens, title, message);
  };
  const refreshForm = () => {
    setImageSongUri(null);
    setMp3Uri(null);
    setName("");
    setSelectedArtists([]);
    setMp3Name("");
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
        console.log("result image picker", result);
        setImageSongUri(result.uri);
      }
    } catch (err) {
      console.log("error when select image", err);
    }
  };
  const getMp3FileFromDevice = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/mpeg", // Chỉ chọn các tệp MP3
      });
      if (result.type === "success") {
        console.log("Selected mp3 file:", result);
        setMp3Uri(result.uri);
        setMp3Name(result.name);
      }
    } catch (err) {
      console.log("Error selecting mp3 file:", err);
    }
  };

  return (
    <View
      style={
        isLoading ? [styles.container, { opacity: 0.5 }] : styles.container
      }
    >
      <View>
        <Text style={styles.heading}>Upload Song</Text>
      </View>
      {isLoading && (
        <ActivityIndicator
          size={"large"}
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
        ></ActivityIndicator>
      )}
      <TouchableOpacity onPress={selectImage}>
        <ImageBackground
          style={styles.bgImage}
          imageStyle={styles.imgLeft}
          source={
            imageSongUri
              ? { uri: imageSongUri }
              : require("../../../assets/noImage.jpg")
          }
        ></ImageBackground>
      </TouchableOpacity>
      <View
        style={{
          marginTop: 32,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Text numberOfLines={2} style={styles.title}>
          Upload Image
        </Text>
        <View style={{ flexDirection: "row", marginTop: 12 }}>
          <FontAwesome5 name="compact-disc" size={24} color="#ffffff" />
          <TextInput
            value={name}
            placeholder="Song name ..."
            placeholderTextColor={"#b0aeae"}
            color="#ffffff"
            textColor="white"
            onChangeText={(text) => setName(text)}
            numberOfLines={1}
            style={styles.subtitle}
          ></TextInput>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 12,
          }}
        >
          <AntDesign name="file1" size={24} color="white" />
          <Text numberOfLines={1} style={styles.subtitle}>
            {mp3Name == "" ? "File is not uploaded" : mp3Name}
          </Text>
        </View>
        {/* <TouchableOpacity
          onPress={() => {
            setShowDatePicker(true);
          }}
          style={styles.item}
        >
          <Ionicons name="calendar" size={24} color="#ffffff" />
          <Text style={styles.listens}>
            {`Pick publish date: ${formatDate(publishDate)}`}
          </Text>
        </TouchableOpacity> */}
        {showDatePicker && (
          <RNDateTimePicker
            maximumDate={new Date()}
            mode="date"
            onChange={(e, date) => {
              if (e.type == "set") {
                setPublishDate(date);
              }
              setShowDatePicker(false);
            }}
            value={publishDate}
          ></RNDateTimePicker>
        )}
      </View>

      <TouchableOpacity
        onPress={() => setIsArtistListVisible(true)}
        style={[
          styles.btnContainer,
          { width: 210, marginTop: 12, marginBottom: 12 },
        ]}
      >
        <AntDesign name="addusergroup" size={22} color="white" />
        <Text style={styles.btn}> Add Artist</Text>
      </TouchableOpacity>

      <FlatList
        data={selectedArtists}
        horizontal={true}
        renderItem={({ item, index }) => (
          <ArtistItem artist={item}></ArtistItem>
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.btnWraper}>
        <TouchableOpacity
          onPress={getMp3FileFromDevice}
          style={[styles.btnContainer, { width: 210 }]}
        >
          <AntDesign name="addfile" size={24} color="white" />

          <Text style={styles.btn}>GetMp3FileFromDevice</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleUploadSong}
          style={styles.btnContainer}
        >
          <AntDesign name="clouduploado" size={22} color="white" />
          <Text style={styles.btn}>Upload </Text>
        </TouchableOpacity>
      </View>

      <ArtistListModal
        visible={isArtistListVisible}
        onClose={() => {
          setIsArtistListVisible(false);
        }}
        selectedArtists={selectedArtists}
        setSelectedArtists={setSelectedArtists}
      ></ArtistListModal>
    </View>
  );
};

export default UploadScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingTop: 60,
    alignItems: "center",
    flex: 1,
    backgroundColor: "#140d36",
  },
  heading: {
    fontSize: 36,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    marginBottom: 0,
    bottom: 25,
  },

  btn: {
    fontSize: 16,
    color: "#ffffff",
    marginLeft: 4,
    fontWeight: "bold",
  },
  imgLeft: {
    borderRadius: 200,
  },
  bgImage: {
    width: 250,
    height: 250,
  },
  background: {
    marginTop: 60,
    marginLeft: 50,
    height: 280,
    margin: 24,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  camera: {
    position: "absolute",
    left: 40,
    bottom: 12,
  },
  title: {
    color: Colors.defaultTextColor,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
    width: 200,
    bottom: 20,
  },
  subtitle: {
    color: Colors.defaultTextColor,
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 20,
    width: 200,
    marginLeft: 12,
  },
  listens: {
    color: "#ffffff",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 12,
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
    marginBottom: 20,
    right: 12,
  },
});
