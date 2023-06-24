import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { AudioContext } from "../../providers/audio.context";
import ItemComponent from "./components/ItemList.component";
import { AdminContext } from "../../providers/admin.context";
import { ArtistRef, SongRef } from "./const";
import { AuthenticationContext } from "../../providers/authentication.context";
const AdminInfor = () => {
  const { songs } = useContext(AudioContext);
  const { logout } = useContext(AuthenticationContext);
  const { getDeleteDocs, refreshFlatlist, setRefreshFlatList } =
    useContext(AdminContext);
  const [deletedSongs, setDeletedSongs] = useState([]);
  const [deletedArtists, setDeletedArtists] = useState([]);

  useEffect(() => {
    (async () => {
      const listSong = await getDeleteDocs(SongRef);

      setDeletedSongs(() => listSong);
      const listArtist = await getDeleteDocs(ArtistRef);

      setDeletedArtists(() => listArtist);
    })();
  }, [songs, refreshFlatlist]);
  return (
    <View style={styles.container}>
      <Text style={styles.heading1}>History Deleted</Text>
      <View>
        <Text style={styles.heading}>Deleted Songs</Text>
        <FlatList
          extraData={refreshFlatlist}
          style={{ marginTop: 12, marginBottom: 60 }}
          data={deletedSongs}
          renderItem={({ item, index }) => (
            <ItemComponent
              setRefreshFlatList={setRefreshFlatList}
              song={item}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View>
        <Text style={styles.heading}>Deleted Artists</Text>
        <FlatList
          extraData={refreshFlatlist}
          style={{ marginTop: 12, marginBottom: 60 }}
          data={deletedArtists}
          renderItem={({ item, index }) => (
            <ItemComponent
              setRefreshFlatList={setRefreshFlatList}
              artist={item}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={styles.btnWraper}>
        <TouchableOpacity
          style={{ backgroundColor: "#19022b", padding: 12, borderRadius: 25 }}
          onPress={() => {
            logout();
          }}
        >
          <Text style={styles.text}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdminInfor;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",

    backgroundColor: "#140d36",
  },

  heading: {
    fontSize: 20,
    textAlign: "left",
    color: "white",
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
  },
  heading1: {
    fontSize: 34,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    marginBottom: 0,
  },
  btnWraper: {
    flexDirection: "row",
    position: "absolute",

    bottom: 12,
    right: 12,
  },
  text: {
    fontSize: 20,

    textAlign: "left",
    color: "white",
    fontWeight: "bold",
  },
});
