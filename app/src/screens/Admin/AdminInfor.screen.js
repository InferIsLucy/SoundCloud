import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { AudioContext } from "../../providers/audio.context";
import ItemComponent from "./components/ItemList.component";
import { AdminContext } from "../../providers/admin.context";
import { ArtistRef, SongRef } from "./const";
const AdminInfor = () => {
  const { songs, fetchSongs } = useContext(AudioContext);
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
