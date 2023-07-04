import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Modal,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AntDesign } from "@expo/vector-icons";

import { ArtistContext } from "../../../providers/artist.context";
import { Colors } from "../../../theme/color";
import ArtistTag2 from "./ArtistTag2.component";

//Modal rendering artist list to select

const ArtistListModal = ({
  visible,
  onClose,
  selectedArtists,
  setSelectedArtists,
}) => {
  const { artists } = useContext(ArtistContext);
  const [filterdArtistData, setfilterdArtistData] = useState(artists);
  const [selectedArtistIds, setSelectedArtistIds] = useState([]);
  const [search, setsearch] = useState("");
  const searchFilter = (text) => {
    if (text !== "") {
      const artistData = artists.filter((artist) => {
        const itemData = artist.name
          ? artist.name.toUpperCase()
          : "".toLowerCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setfilterdArtistData(artistData);
      setsearch(text);
    } else {
      setfilterdArtistData(artists);
      setsearch(text);
    }
  };
  function toggleAddArtist(newArtist) {
    setSelectedArtists((artistList) => {
      const index = artistList.findIndex(
        (artist) => artist.id === newArtist.id
      );
      if (index !== -1) {
        artistList.splice(index, 1);
      } else {
        artistList.push(newArtist);
      }
      return artistList;
    });
  }
  useEffect(() => {
    const list = selectedArtists.map((artist) => {
      return artist.id;
    });
    setSelectedArtistIds(() => list);
  }, [visible]);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}
    >
      <View style={styles.container}>
        <View style={styles.body}>
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
            style={{ marginVertical: 12 }}
            data={filterdArtistData}
            renderItem={({ item, index }) => {
              const defaultSelectedValue = selectedArtistIds.includes(item.id);
              if (defaultSelectedValue) console.log("Item.Id", item.id);
              return (
                <ArtistTag2
                  toggleAddArtist={toggleAddArtist}
                  artist={item}
                  defaultSelectedValue={defaultSelectedValue}
                ></ArtistTag2>
              );
            }}
            keyExtractor={(item) => item.id}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={onClose} style={[styles.btnContainer]}>
              <AntDesign name="clouduploado" size={22} color="#514b75" />
              <Text style={styles.btn}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ArtistListModal;

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    width: "100%",
    height: 500,
  },
  body: {
    flex: 1,
    margin: 30,
    padding: 20,
    borderRadius: 15,
    backgroundColor: "white",
  },
  btn: {
    fontSize: 16,
    marginLeft: 8,
  },
  inputContainer: {
    height: 50,
    backgroundColor: "#ece8e8",
    borderRadius: 10,
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "center",
    elevation: 12,
  },
  btnContainer: {
    width: 90,
    borderWidth: 4,
    borderColor: Colors.textColor,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: 12,
  },
});
