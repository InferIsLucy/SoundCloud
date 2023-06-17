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
    <View>
      <View>
        <TouchableOpacity
          style={{ backgroundColor: "red", padding: 12 }}
          onPress={() => {
            logout();
          }}
        >
          <Text>ClickToLogout</Text>
        </TouchableOpacity>
        <Text>Deleted Songs</Text>
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
        <Text>Deleted Artists</Text>
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
    </View>
  );
};

export default AdminInfor;

const styles = StyleSheet.create({});
