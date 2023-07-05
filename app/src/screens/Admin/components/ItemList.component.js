import {
  StyleSheet,
  Text,
  Alert,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useContext, memo, useEffect, useState } from "react";
import { EvilIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import { AdminContext } from "../../../providers/admin.context";
import { SongRef, ArtistRef } from "../const";
import {
  formatListenNumber,
  getSongArtistFromArray,
} from "../../../utils/Converters";
import { AudioContext } from "../../../providers/audio.context";
const ItemComponent = ({
  song = null,
  artist = null,
  setRefreshFlatList,
  setIsSongLoading,
}) => {
  const { deleteDocument, restoreDocument } = useContext(AdminContext);
  const { songs, fetchSongs } = useContext(AudioContext);
  const [listSongOfArtist, setListSong] = useState([]);
  let item = {};
  if (song) {
    item = { ...song, text: getSongArtistFromArray(song.artist) };
  } else {
    item = {
      imageUri: artist.avtUri,
      ...artist,
      text: `${listSongOfArtist.length} bài hát`,
    };
  }
  useEffect(() => {
    if (artist) {
      const list = songs.filter((song) => {
        if (song.isLocalSong == null)
          return song.artist.some((songArtist) => songArtist.id == artist.id);
      });
      setListSong(() => list);
    }
  }, [songs]);
  const handleDeleteDocument = async () => {
    setIsSongLoading(true);
    try {
      if (artist) {
        // delete songs of artist
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
        setIsSongLoading(false);
      }
      await deleteDocument(song ? SongRef : ArtistRef, item.id);
      setRefreshFlatList((prev) => !prev);
      //refetch songs from db
      fetchSongs();
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
      fetchSongs();
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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 16,
              color: "white",
              fontWeight: 500,
              maxWidth: 120,
            }}
          >
            {item.name}
          </Text>
          {song && (
            <>
              <Text
                numberOfLines={1}
                style={{ color: "#cac5e5", marginLeft: 4 }}
              >
                {`${formatListenNumber(song.listens)} `}
              </Text>
              <Feather name="headphones" size={18} color="#cac5e5" />
            </>
          )}
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text numberOfLines={1} style={{ color: "#cac5e5" }}>
            {item.text}
          </Text>
          {artist && (
            <Text
              numberOfLines={1}
              style={{ marginLeft: 12, color: "#cac5e5" }}
            >
              {`${artist.followers.length} người theo dõi`}
            </Text>
          )}
        </View>
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
