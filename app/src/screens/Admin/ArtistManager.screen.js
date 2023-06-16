import { StyleSheet, TextInput, Text, FlatList, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import ItemComponent from "./components/ItemList.component";
import { AudioContext } from "../../providers/audio.context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ArtistContext } from "../../providers/artist.context";
import { ArtistRef, SongRef } from "./const";
import { AdminContext } from "../../providers/admin.context";
const ArtistManager = () => {
  const { getDocs, refreshFlatlist, setRefreshFlatList } =
    useContext(AdminContext);
  const [filterdArtistData, setFilteredArtists] = useState([]);
  const [artists, setArtists] = useState([]);
  const [search, setsearch] = useState("");
  const [isShow, setIsShow] = useState(false);
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
      setIsShow(true);
    } else {
      setFilteredArtists(artists);
      setsearch(text);
      setIsShow(false);
    }
  };
  const refreshSearch = () => {
    setfilterdData([]);
    setsearch("");
    setFilteredArtists([]);
  };
  useEffect(() => {
    (async () => {
      const list = await getDocs(ArtistRef, "deletedAt", "==", null);
      setArtists(list);
      setFilteredArtists(list.filter((artist) => artist.deletedAt == null));
    })();
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
        extraData={refreshFlatlist}
        style={{ marginTop: 12, marginBottom: 60 }}
        data={filterdArtistData}
        renderItem={({ item, index }) => (
          <ItemComponent
            setRefreshFlatList={setRefreshFlatList}
            artist={item}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ArtistManager;

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
    justifyContent: "center",
    paddingLeft: 24,
    elevation: 12,
  },
});
