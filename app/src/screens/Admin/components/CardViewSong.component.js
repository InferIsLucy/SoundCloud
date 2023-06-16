import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../../theme/color";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { getSongArtistFromArray } from "../../../utils/Converters";
import { AntDesign } from "@expo/vector-icons";
import { AdminContext } from "../../../providers/admin.context";
import { SongRef } from "../const";
import { convertFirebaseTimestamp } from "../../../utils/TimeFormater";
import { AudioContext } from "../../../providers/audio.context";
import { ArtistContext } from "../../../providers/artist.context";
import ArtistTag from "./ArtistTag.component";
const CardView = ({ ...props }) => {
  const { imageLeft, imageRight, song, setModalVisible } = props;
  const { artists } = useContext(ArtistContext);
  const { deleteDocument, setRefreshFlatList } = useContext(AdminContext);
  const [songArtists, setSongArtists] = useState([]);
  const handleDeleteDocument = async () => {
    try {
      await deleteDocument(SongRef, song.id);
      setRefreshFlatList((prev) => !prev);
      setModalVisible(false);
    } catch (e) {
      console.log("error when delete", e);
    }
  };
  //get song's artists
  useEffect(() => {
    const list = [];
    song.artist.forEach((songArtist) => {
      let check = {};
      artists.forEach((artist) => {
        if (artist.id == songArtist.id) {
          check = artist;
        }
      });
      list.push(check);
    });
    setSongArtists(list);
  }, []);
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
      <Image style={styles.imgLeft} source={{ uri: imageLeft }}></Image>
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
        <Text numberOfLines={2} style={styles.title}>
          {song.name}
        </Text>
        <View style={{ flexDirection: "row", marginLeft: 12, marginTop: 12 }}>
          <Ionicons name="person" size={24} color="#514b75" />
          <Text numberOfLines={1} style={styles.subtitle}>
            {getSongArtistFromArray(song.artist)}
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
          <Ionicons name="ear" size={16} color="#514b75" />
          <Text numberOfLines={1} style={styles.listens}>
            {` ${song.listens} lượt nghe`}
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
          <Ionicons name="ear" size={16} color="#514b75" />
          <Text numberOfLines={1} style={styles.listens}>
            {` ${song.likes.length} lượt thích`}
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
        {`Thời gian phát hành: ${convertFirebaseTimestamp(song.publishDate)} `}
      </Text>
      <FlatList
        style={{ marginTop: 24 }}
        horizontal={true}
        data={songArtists}
        renderItem={({ item, index }) => <ArtistTag artist={item} />}
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
    </LinearGradient>
  );
};

export default CardView;

const styles = StyleSheet.create({
  btn: {
    fontSize: 16,
    color: "#514b75",
    marginLeft: 4,
    fontWeight: "bold",
  },
  imgLeft: {
    height: 180,
    borderRadius: 20,
    width: 120,
    top: -20,
    left: -40,
    resizeMode: "contain",
    position: "absolute",
  },
  background: {
    marginTop: 60,
    marginLeft: 50,
    height: 400,
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
