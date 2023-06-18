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

import { ArtistRef, SongRef } from "./const";
import { AdminContext } from "../../providers/admin.context";
import { formatDate } from "../../utils/TimeFormater";
import { isStringNullOrEmpty, isValidAge } from "../../utils/Validator";
import ArtistListModal from "./components/ArtistListModal.component";
import AddArtistModal from "./components/AddArtistModal.component";
import ArtistItem from "./components/ArtistItem.component";
import { AuthenticationContext } from "../../providers/authentication.context";
import { NotificationContext } from "../../providers/notification.context";

const UploadScreen = () => {
  const { uploadFile, addDocument } = useContext(AdminContext);
  const { getListUser } = useContext(AuthenticationContext);
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
      const allUserId = selectedArtists.reduce(
        (acc, artist) => acc.concat(artist.followers),
        []
      );
      const uniqueIds = allUserId.filter(
        (value, index, self) => self.indexOf(value) === index
      );
      console.log("uniqueIds", uniqueIds);

      const users = await getListUser(uniqueIds);
      const userTokens = users.map((user) => {
        if (user.expoNotifyToken) return user.expoNotifyToken;
      });
      console.log("notifiedUserTokens", userTokens);

      const newSong = {
        name,
        publishDate,
        deletedAt: null,
        uri: downloadSongUri,
        imageUri: downloadImageUri,
        likes: [],
        artist: selectedArtists,
        listens: 0,
        duration: 0,
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
      {isLoading && (
        <ActivityIndicator
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
        ></ActivityIndicator>
      )}
      <ImageBackground
        style={styles.bgImage}
        imageStyle={styles.imgLeft}
        source={
          imageSongUri
            ? { uri: imageSongUri }
            : require("../../../assets/noImage.jpg")
        }
      >
        <TouchableOpacity onPress={selectImage} style={styles.camera}>
          <AntDesign name="camera" size={24} color="#a095cc" />
        </TouchableOpacity>
      </ImageBackground>

      <View
        style={{
          marginTop: 32,
          width: "100%",
        }}
      >
        <Text numberOfLines={2} style={styles.title}>
          UploadSong
        </Text>
        <View style={{ flexDirection: "row", marginLeft: 12, marginTop: 12 }}>
          <Ionicons name="person" size={24} color="#514b75" />
          <TextInput
            value={name}
            placeholder="Song name"
            onChangeText={(text) => setName(text)}
            numberOfLines={1}
            style={styles.subtitle}
          ></TextInput>
        </View>
        <View style={{ flexDirection: "row", marginLeft: 12, marginTop: 12 }}>
          <Ionicons name="person" size={24} color="#514b75" />
          <Text style={styles.subtitle}>
            {mp3Name == "" ? "Empty mp3 file" : mp3Name}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setShowDatePicker(true);
          }}
          style={styles.item}
        >
          <Ionicons name="calendar" size={16} color="#514b75" />
          <Text style={styles.listens}>
            {`Pick publish date: ${formatDate(publishDate)}`}
          </Text>
        </TouchableOpacity>
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
        style={[styles.btnContainer, { width: 210 }]}
      >
        <AntDesign name="clouduploado" size={22} color="#514b75" />
        <Text style={styles.btn}>Open Artist List</Text>
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
          <AntDesign name="clouduploado" size={22} color="#514b75" />
          <Text style={styles.btn}>GetMp3FileFromDevice</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleUploadSong}
          style={styles.btnContainer}
        >
          <AntDesign name="clouduploado" size={22} color="#514b75" />
          <Text style={styles.btn}>Upload</Text>
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
    flex: 1,
  },
  heading: {
    fontSize: 36,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    marginBottom: 12,
  },
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
    width: 100,
    height: 100,
  },
  background: {
    marginTop: 60,
    marginLeft: 50,
    height: 280,
    margin: 24,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: "gray",
    alignItems: "center",
  },
  camera: {
    position: "absolute",
    left: 40,
    bottom: 12,
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
