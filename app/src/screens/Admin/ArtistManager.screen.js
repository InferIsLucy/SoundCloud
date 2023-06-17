import {
  StyleSheet,
  TextInput,
  Text,
  FlatList,
  View,
  Modal,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import ItemComponent from "./components/ItemList.component";
import { AudioContext } from "../../providers/audio.context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ArtistContext } from "../../providers/artist.context";
import { ArtistRef, SongRef } from "./const";
import { AdminContext } from "../../providers/admin.context";
import { TouchableOpacity } from "react-native";
import DetailItem from "./components/DetailItem.component";
const ArtistManager = () => {
  const { getDocs, refreshFlatlist, setRefreshFlatList } =
    useContext(AdminContext);
  const { fetchSongs } = useContext(AudioContext);
  const [filterdArtistData, setFilteredArtists] = useState([]);
  const [artists, setArtists] = useState([]);
  const [search, setsearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const searchFilter = (text) => {
    if (text !== "") {
      const artistData = artists.filter((artist) => {
        const itemData = artist.name
          ? artist.name.toUpperCase()
          : "".toLowerCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredArtists(artistData);
      setsearch(text);
    } else {
      setFilteredArtists(artists);
      setsearch(text);
    }
  };
  const fetchData = async () => {
    const list = await getDocs(ArtistRef, "deletedAt", "==", null);
    setArtists(list);
    setFilteredArtists(list.filter((artist) => artist.deletedAt == null));
  };
  const onRefresh = async () => {
    setRefreshing(true);

    await fetchData();
    setRefreshing(false);
  };
  useEffect(() => {
    fetchData();
  }, [refreshFlatlist]);
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.heading}>Artist List</Text>
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
        data={filterdArtistData}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedItem(item);
              setDetailModalVisible((prev) => !prev);
            }}
          >
            <ItemComponent
              setRefreshFlatList={setRefreshFlatList}
              artist={item}
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
          artist={selectedItem}
        ></DetailItem>
      </Modal>
    </View>
  );
};

export default ArtistManager;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingTop: 60,
    backgroundColor: "#140d36",
  },
  heading: {
    fontSize: 36,
    textAlign: "center",
    color: "white",
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
    justifyContent: "center",
    paddingLeft: 24,
    elevation: 12,
  },
});
