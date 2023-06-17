import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { getSongArtistFromArray } from "../../../utils/Converters";
import CardView from "./CardViewSong.component";
import CardViewArtist from "./CardViewArtist.component";

const DetailItem = ({ song = null, artist = null, setDetailModalVisible }) => {
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
      {song ? (
        <CardView
          song={song}
          imageLft={item.imageUri}
          setModalVisible={setDetailModalVisible}
        ></CardView>
      ) : (
        <CardViewArtist
          artist={artist}
          imageLeft={item.imageUri}
          setModalVisible={setDetailModalVisible}
        ></CardViewArtist>
      )}
    </View>
  );
};

export default DetailItem;

const styles = StyleSheet.create({});
