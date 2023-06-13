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
import React from "react";
import FollowingItem from "./components/FollowingItem.component";
const FollowingDetail = ({ artists = [], setModalVisible }) => {
  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={{ paddingLeft: 8, paddingRight: 4 }}
        >
          <Ionicons name="chevron-back" size={32} color="black" />
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
        data={artists}
        renderItem={({ item }) => <FollowingItem />}
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
  },
});
