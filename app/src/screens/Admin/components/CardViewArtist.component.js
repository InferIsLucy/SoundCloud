import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { Colors } from "../../../theme/color";
import { AdminContext } from "../../../providers/admin.context";
import { ArtistRef, SongRef } from "../const";
import { AudioContext } from "../../../providers/audio.context";
import { ArtistContext } from "../../../providers/artist.context";
import SongTag from "./SongTag.componet";
import { convertFirebaseTimestamp } from "../../../utils/TimeFormater";
import UpdateFieldComponent from "./UpdateFieldModal.component";
const CardViewArtist = ({ ...props }) => {
  const { imageLeft, artist, setModalVisible, listArtistSong } = props;
  const { songs } = useContext(AudioContext);
  const { deleteDocument, uploadFile, updateField, setRefreshFlatList } =
    useContext(AdminContext);
  const [listSongOfArtist, setListSong] = useState([]);
  const [isUpdateModalVisbile, setIsUpdateModalVisible] = useState(false);
  const [artistName, setArtistName] = useState(artist.name);
  const [selectedFieldName, setSelectedFieldName] = useState();
  const [selectedValue, setSelectedValue] = useState();
  const [setUIStateToNewValue, setCallbackUpdateUIState] = useState(null);
  const [avatarUri, setAvatarUri] = useState(artist.avtUri);
  const [loves, setLoves] = useState("");
  const handleDeleteDocument = async () => {
    try {
      if (artist) {
        const deletePromises = songs.map(async (song) => {
          if (song.isLocalSong == null) {
            const checkIfIncluded = song.artist.filter((ar) => {
              return ar.id == artist.id;
            });
            if (checkIfIncluded.length == 1) {
              return await deleteDocument(SongRef, song.id);
            }
          }
        });
        await Promise.all(deletePromises);
      }
      await deleteDocument(ArtistRef, artist.id);
      setRefreshFlatList((prev) => !prev);
      setModalVisible(false);
    } catch (e) {
      console.log("error when delete", e);
    }
  };
  //get song's artists
  useEffect(() => {
    let count = 0;
    const list = songs.filter((song) => {
      if (song.isLocalSong == null)
        return song.artist.some((songArtist) => songArtist.id == artist.id);
    });

    setListSong(list);
  }, []);
  const handleChangeAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        console.log("result image picker", result);

        const downloadUri = await uploadFile(result.uri, "images/");
        await updateField(ArtistRef, artist.id, "avtUri", downloadUri);
        setAvatarUri(result.uri);
      }
    } catch (err) {
      console.log("error when select image", err);
    }
  };
  const openUpdateModal = (fieldName, value, setUI) => {
    console.log({ fieldName, value, setUI });
    setIsUpdateModalVisible(true);
    setSelectedFieldName(fieldName);
    setSelectedValue(value);

    // setCallbackUpdateUIState(setUI);
    setCallbackUpdateUIState(() => setUI);
  };
  return (
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
        source={{ uri: avatarUri }}
      >
        <TouchableOpacity onPress={handleChangeAvatar} style={styles.camera}>
          <AntDesign name="camera" size={24} color="#a095cc" />
        </TouchableOpacity>
      </ImageBackground>
      <TouchableOpacity
        onPress={() => {
          setModalVisible((prev) => !prev);
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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text numberOfLines={2} style={styles.title}>
            {artistName}
          </Text>
          <TouchableOpacity
            onPress={() => openUpdateModal("name", artistName, setArtistName)}
            style={{ marginLeft: 12 }}
          >
            <FontAwesome name="pencil" size={24} color="#514b75" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 12,
            marginTop: 12,
          }}
        >
          <Entypo name="note" size={16} color="#514b75" />
          <Text numberOfLines={1} style={styles.listens}>
            {` ${listSongOfArtist.length} bài hát`}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 12,
            marginTop: 12,
          }}
        >
          <FontAwesome name="birthday-cake" size={16} color="#514b75" />
          <Text numberOfLines={1} style={styles.listens}>
            {`${convertFirebaseTimestamp(artist.dateOfBirth)}`}
          </Text>
        </View>
      </View>
      <Text
        numberOfLines={1}
        style={[
          styles.listens,
          {
            width: "100%",
            paddingHorizontal: 4,
            marginTop: 8,
            marginLeft: 24,
          },
        ]}
      >
        {/* {`Thời gian phát hành: ${convertFirebaseTimestamp(
          artist.dateOfBirth
        )} `} */}
      </Text>
      <FlatList
        style={{ marginTop: 24 }}
        horizontal={true}
        data={listSongOfArtist}
        renderItem={({ item, index }) => <SongTag song={item} />}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.btnWraper}>
        <TouchableOpacity
          onPress={handleDeleteDocument}
          style={styles.btnContainer}
        >
          <Feather name="trash-2" size={22} color="#514b75" />
          <Text style={styles.btn}>Delete</Text>
        </TouchableOpacity>
      </View>
      <UpdateFieldComponent
        visible={isUpdateModalVisbile}
        selectedFieldName={selectedFieldName}
        selectedValue={selectedValue}
        collectionName={ArtistRef}
        docId={artist.id}
        onClose={() => setIsUpdateModalVisible(false)}
        updateNewValue={setUIStateToNewValue}
      ></UpdateFieldComponent>
    </LinearGradient>
  );
};

export default CardViewArtist;

const styles = StyleSheet.create({
  btn: {
    fontSize: 16,
    color: "#514b75",
    marginLeft: 4,
    fontWeight: "bold",
  },
  imgLeft: {
    borderRadius: 20,
    resizeMode: "cover",
    position: "absolute",
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
    height: 320,
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
