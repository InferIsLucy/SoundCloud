import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { getSongArtistFromArray } from "../../../utils/Converters";
import CardView from "../../../components/CardView";
const DetailItem = ({ song = null, artist = null, setDetailModelVisible }) => {
  if (song == null && artist == null) return;
  let item = {};
  if (song) {
    item = { ...song, artistString: getSongArtistFromArray(song.artist) };
  } else {
    item = {
      imageUri: artist.avtUri,
      ...artist,
    };
  }
  return (
    <View>
      <CardView
        song={song}
        imageLeft={item.imageUri}
        imageRight={item.imageUri}
        setModalVisible={setDetailModelVisible}
      ></CardView>
    </View>
  );
};

export default DetailItem;

const styles = StyleSheet.create({});
