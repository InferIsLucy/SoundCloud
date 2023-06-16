import {
  StyleSheet,
  Text,
  Alert,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useContext, memo, useEffect } from "react";
import { EvilIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AdminContext } from "../../../providers/admin.context";
import { SongRef, ArtistRef } from "../const";
import { getSongArtistFromArray } from "../../../utils/Converters";
import { AudioContext } from "../../../providers/audio.context";
const ItemComponent = ({
  song = null,
  artist = null,
  setRefreshFlatList,
  setDetailModalVisible,
}) => {
  const { deleteDocument, restoreDocument } = useContext(AdminContext);
  const { songs } = useContext(AudioContext);
  let item = {};
  if (song) {
    item = { ...song, artistString: getSongArtistFromArray(song.artist) };
  } else {
    item = {
      imageUri: artist.avtUri,
      ...artist,
    };
  }
  const handleDeleteDocument = async () => {
    try {
      if (artist) {
        console.log(artist.id);
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
      await deleteDocument(song ? SongRef : ArtistRef, item.id);
      setRefreshFlatList((prev) => !prev);
    } catch (e) {
      console.log("error when delete", e);
    }
  };

  const handleRestoreDoc = async () => {
    try {
      await restoreDocument(song ? SongRef : ArtistRef, item.id);
      if (artist) {
        const restorePromises = songs.map(async (song) => {
          if (song.isLocalSong == null) {
            const checkIfIncluded = song.artist.filter((ar) => {
              return ar.id == artist.id;
            });
            if (checkIfIncluded.length == 1) {
              return await restoreDocument(SongRef, song.id);
            }
          }
        });
        await Promise.all(restorePromises);
      }
      setRefreshFlatList((prev) => !prev);
    } catch (e) {
      console.log("error when restoring", e);
    }
  };

  const showConfirmDialog = () => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to remove this?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            handleDeleteDocument();
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };
  return (
    <View style={styles.container}>
      {song ? (
        <Image
          source={{ uri: item.imageUri }}
          style={[styles.img, { borderRadius: 4 }]}
        ></Image>
      ) : (
        <Image source={{ uri: item.imageUri }} style={styles.img}></Image>
      )}

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text
          numberOfLines={1}
          style={{ fontSize: 16, color: "white", fontWeight: 500 }}
        >
          {item.name}
        </Text>
        <Text numberOfLines={1} style={{ color: "#cac5e5" }}>
          {item.artistString}
        </Text>
      </View>
      {item.deletedAt == null ? (
        <>
          <TouchableOpacity onPress={showConfirmDialog}>
            <Feather name="trash-2" size={24} color="white" />
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          onPress={handleRestoreDoc}
          style={{ marginRight: 12 }}
        >
          <MaterialIcons name="restore" size={28} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ItemComponent;

const styles = StyleSheet.create({
  container: {
    height: 88,
    backgroundColor: "#231b4d",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 12,
    margin: 12,
  },
  boxWithShadow: {
    shadowColor: "#000",
    borderWidth: 1,
    overflow: "hidden",
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 10,
  },
  img: {
    borderRadius: 50,
    width: 40,
    height: 40,
    resizeMode: "cover",
  },
});
