import {
  StyleSheet,
  TextInput,
  Text,
  FlatList,
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import ItemComponent from "./components/ItemList.component";
import Icon from "react-native-vector-icons/MaterialIcons";

import { ArtistContext } from "../../providers/artist.context";
import { SongRef } from "./const";
import { AdminContext } from "../../providers/admin.context";
import DetailItem from "./components/DetailItem.component";
const SongManager = () => {
  const { getDocs, refreshFlatlist, isLoading, setRefreshFlatList } =
    useContext(AdminContext);
  const { artists, isFetchingArtist } = useContext(ArtistContext);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [songs, setSongs] = useState([]);
  const [search, setsearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [isSongLoading, setIsSongLoading] = useState(false);

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
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };
  const fetchData = async () => {
    setIsSongLoading(true);
    try {
      const list = await getDocs(SongRef, "deletedAt", "==", null);
      const modifiedList = list.map((song) => {
        if (song.isLocalSong == null) {
          const artistListFromSong = song.artist;
          const artistList = artists.filter((artist) => {
            return artistListFromSong.some((item) => item.id == artist.id);
          });
          return { ...song, artist: artistList };
        }
      });
      setSongs(() => modifiedList);
      setFilteredSongs(() => modifiedList);
      setIsSongLoading(false);
    } catch (er) {
      console.log("Err when loading songs", er);
    }
  };
  useEffect(() => {
    if (!isFetchingArtist) fetchData();
  }, [refreshFlatlist, isFetchingArtist]);
  return (
    <View
      style={
        isSongLoading || detailModalVisible
          ? [styles.container, { opacity: 0.7 }]
          : styles.container
      }
    >
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
        refreshing={refreshing}
        onRefresh={onRefresh}
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
              setDetailModalVisible={setDetailModalVisible}
              setRefreshFlatList={setRefreshFlatList}
              song={item}
              setIsSongLoading={setIsSongLoading}
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
          setDetailModalVisible={setDetailModalVisible}
          song={selectedItem}
        ></DetailItem>
      </Modal>

      {isSongLoading && (
        <ActivityIndicator
          size={"large"}
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
        ></ActivityIndicator>
      )}
    </View>
  );
};

export default SongManager;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingTop: 60,
    flex: 1,
    backgroundColor: "#140d36",
  },
  heading: {
    fontSize: 36,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
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
