import {
  StyleSheet,
  TextInput,
  Text,
  FlatList,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import ItemComponent from "./components/ItemList.component";
import { AudioContext } from "../../providers/audio.context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";

import { ArtistContext } from "../../providers/artist.context";
import { SongRef } from "./const";
import { AdminContext } from "../../providers/admin.context";
import DetailItem from "./components/DetailItem.component";
const SongManager = () => {
  const { getDocs, refreshFlatlist, setRefreshFlatList } =
    useContext(AdminContext);
  const { artists } = useContext(ArtistContext);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [songs, setSongs] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setsearch] = useState("");
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const searchFilter = (text) => {
    if (text !== "") {
      const newData = songs.filter((song) => {
        if (song.isLocalSong == null) {
          const itemData = song.name
            ? song.name.toUpperCase()
            : "".toLowerCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        }
      });
      setFilteredSongs(newData);
      setsearch(text);
    } else {
      setFilteredSongs(songs.filter((song) => song.isLocalSong == null));
      setsearch(text);
    }
  };
  const refreshSearch = () => {
    setfilterdData([]);
    setsearch("");
    setFilteredArtists([]);
  };
  useEffect(() => {
    (async () => {
      const list = await getDocs(SongRef, "deletedAt", "==", null);
      setSongs(list);
      setFilteredSongs(
        list.filter(
          (song) => song.isLocalSong == null && song.deletedAt == null
        )
      );
    })();
  }, [refreshFlatlist]);
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.heading}>Song List</Text>
      </View>
      <View style={styles.inputContainer}>
        <Icon name="search" size={28} />
        <TextInput
          value={search}
          onChangeText={(text) => searchFilter(text)}
          placeholder="Search...                                                       ."
          style={{ color: "black", fontSize: 18 }}
        />
      </View>
      <FlatList
        extraData={refreshFlatlist}
        style={{ marginTop: 12, marginBottom: 60 }}
        data={filteredSongs}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedItem(item);
              setDetailModalVisible((prev) => !prev);
            }}
          >
            <ItemComponent
              setDetailModelVisible={setDetailModalVisible}
              setRefreshFlatList={setRefreshFlatList}
              song={item}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={detailModalVisible}
        onRequestClose={() => {
          setDetailModalVisible(!detailModalVisible);
        }}
      >
        <DetailItem
          setDetailModelVisible={setDetailModalVisible}
          song={selectedItem}
        ></DetailItem>
      </Modal>
    </View>
  );
};

export default SongManager;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingTop: 60,
  },
  heading: {
    fontSize: 36,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 12,
  },
  inputContainer: {
    height: 60,
    width: "100%",
    backgroundColor: "#ece8e8",
    borderRadius: 10,
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "center",
    elevation: 12,
    paddingLeft: 12,
  },
});
