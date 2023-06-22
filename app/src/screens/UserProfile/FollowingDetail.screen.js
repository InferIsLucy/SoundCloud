import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fontSizes } from "../../theme/fontSizes";
import React, { useContext, useEffect, useState } from "react";
import FollowingItem from "./components/FollowingItem.component";
import { ArtistContext } from "../../providers/artist.context";
import { Colors } from "../../theme/color";
const FollowingDetail = ({ artistIds = [], setModalVisible }) => {
  const { artists } = useContext(ArtistContext);
  const [followArtists, setFollowArtists] = useState([]);
  useEffect(() => {
    setFollowArtists(
      artists.filter((artist) => {
        return artistIds.includes(artist.id);
      })
    );
  }, []);
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: Colors.authBackground,
      }}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={{ paddingLeft: 8, paddingRight: 4 }}
        >
          <Ionicons name="chevron-back" size={32} color="#ffffff" />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            marginRight: 36,
          }}
        >
          <Text style={styles.heading}>Following</Text>
        </View>
      </View>
      <FlatList
        data={followArtists}
        renderItem={({ item }) => <FollowingItem artist={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default FollowingDetail;

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,

    justifyContent: "flex-start",
  },
  heading: {
    fontSize: fontSizes.heading3,
    fontWeight: 500,
    textAlign: "center",
    color: Colors.defaultTextColor,
  },
});
