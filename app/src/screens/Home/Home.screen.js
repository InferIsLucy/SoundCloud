import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  memo,
  useCallback,
  useRef,
} from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Text,
  TextInput,
  ImageBackground,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import COLORS from "../../consts/colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AudioContext } from "../../providers/audio.context";
import { AuthenticationContext } from "../../providers/authentication.context";
import { ArtistContext } from "../../providers/artist.context";
import ArtistScreen from "../Artist.Screen";
import { Colors } from "../../theme/color";
import HomeCardItemComponent from "./components/HomeCardItem.component";
import RecommendCard from "./components/RecommendCard.component";

const { width } = Dimensions.get("screen");
const HomeScreen = ({ navigation }) => {
  const {
    songs,
    currentSong,
    setPlaylist,
    isBottomBarVisible,
    setCurrentSong,
    addSongToHistory,
    isFetchingData,
  } = useContext(AudioContext);
  const { artists } = useContext(ArtistContext);
  const { user } = useContext(AuthenticationContext);
  const [filterdData, setfilterdData] = useState([]);
  const [filterdArtistData, setfilterdArtistData] = useState([]);
  const [search, setsearch] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newReleasedSongs, setNewReleasedSongs] = useState([]);
  const [randomSongs, setRandomSongs] = useState([]);

  // const renderCount = useRef(0);
  // renderCount.current++;
  // console.log("Home", renderCount.current);

  useEffect(() => {
    if (!isFetchingData) {
      const randomSongs = getRandomSongs(5);
      const newSongs = getNewSongs();
      setRandomSongs(randomSongs);
      setNewReleasedSongs(newSongs);
    }
  }, [isFetchingData]);

  function getRandomSongs(count) {
    const shuffledSongs = [...songs].sort(() => 0.5 - Math.random());
    return shuffledSongs.slice(0, count);
  }

  function getNewSongs() {
    return songs
      .sort((a, b) => a.publishDate.toMillis() - b.publishDate.toMillis())
      .slice(0, 5);
  }
  const [isRandomSongClicked, setIsRandomSongClicked] = useState(false);
  const [isNewSongClicked, setIsNewSongClicked] = useState(false);

  const searchFilter = useCallback(
    (text) => {
      if (text !== "") {
        const newData = songs.filter((song) => {
          if (song.isLocalSong == null) {
            const itemData = song.name
              ? song.name.toUpperCase()
              : "".toLowerCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          }
        });
        const artistData = artists.filter((artist) => {
          const itemData = artist.name
            ? artist.name.toUpperCase()
            : "".toLowerCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        setfilterdData(newData);
        setfilterdArtistData(artistData);
        setsearch(text);
        setIsShow(true);
      } else {
        setfilterdData(songs);
        setfilterdArtistData(artists);
        setsearch(text);
        setIsShow(false);
      }
    },
    [songs, artists]
  );

  const refreshSearch = useCallback(() => {
    setfilterdData([]);
    setsearch("");
    setfilterdArtistData([]);
  }, []);

  const handleItemClick = useCallback(
    (song, type) => {
      switch (type) {
        case "new":
          //check if fisrt time click on item
          if (!isNewSongClicked) {
            setPlaylist(() => newReleasedSongs);
          }
          setIsNewSongClicked(false);
          setIsRandomSongClicked(true);
          break;
        case "random":
          if (!isRandomSongClicked) {
            setPlaylist(() => randomSongs);
          }
          setIsNewSongClicked(true);
          setIsRandomSongClicked(false);
          break;
        case "search":
          setPlaylist([song]);
          refreshSearch();

          break;
      }
      handlePlaySong(song);
      addSongToHistory(user.userId, song.id);
    },
    [newReleasedSongs, randomSongs]
  );

  const handlePlaySong = useCallback((song) => {
    setCurrentSong(() => song);
    navigation.navigate("Player");
  }, []);
  const ItemView = ({ song, index }) => {
    console.log("itemView");
    return (
      <View style={styles.itemStyle}>
        <View style={styles.itemContainer}>
          <Image
            style={{
              width: 40,
              borderRadius: 4,
              height: 40,
              resizeMode: "contain",
            }}
            source={{ uri: song.imageUri }}
          ></Image>
          <View style={styles.itemBody}>
            <Text style={styles.itemName}>{song.name}</Text>
            <Text style={styles.itemName}>{song.artistString}</Text>
          </View>
          <View style={styles.option}></View>
        </View>
      </View>
    );
  };
  const ArtistSearchItem = ({ artist = [], index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          refreshSearch();
          setSelectedArtist(artist);
          setModalVisible(true);
        }}
        style={styles.itemStyle}
      >
        <View style={styles.itemContainer}>
          <Image
            style={{
              width: 40,
              borderRadius: 25,
              height: 40,
              resizeMode: "contain",
            }}
            source={{ uri: artist.avtUri }}
          ></Image>
          <View style={styles.itemBody}>
            <Text style={styles.itemName}>{artist.name}</Text>
            <Text> Nghệ sĩ </Text>
          </View>
          <View style={styles.option}></View>
        </View>
      </TouchableOpacity>
    );
  };

  const Heading = () => {
    return (
      <View style={{ flexDirection: "row", height: 80, width: "100%" }}>
        <Image
          source={{
            uri: "https://images.pexels.com/photos/3574678/pexels-photo-3574678.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          }}
          style={{ width: 50, height: 50 }}
        ></Image>
        <View style={{ flex: 1 }}></View>
        <Image
          source={{
            uri: "https://images.pexels.com/photos/3574678/pexels-photo-3574678.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          }}
          style={{ width: 50, height: 50 }}
        ></Image>
        <Image
          source={{
            uri: "https://images.pexels.com/photos/3574678/pexels-photo-3574678.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          }}
          style={{ width: 50, height: 50 }}
        ></Image>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.authBackground,
      }}
    >
      <StatusBar translucent={false} backgroundColor={Colors.authBackground} />

      <ScrollView
        style={{ marginBottom: isBottomBarVisible ? 100 : 15 }}
        showsHorizontalScrollIndicator={false}
      >
        <ImageBackground
          source={{
            uri: "https://images.pexels.com/photos/3574678/pexels-photo-3574678.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          }}
          style={{
            backgroundColor: COLORS.dark,
            height: 180,
            paddingHorizontal: 20,
          }}
        >
          <Heading></Heading>
          <View style={{ flex: 1 }}>
            <View style={styles.inputContainer}>
              <Icon name="search" size={28} />
              <TextInput
                value={search}
                onChangeText={(text) => searchFilter(text)}
                placeholder="Search...                                                       ."
                style={{ color: "black", fontSize: 18 }}
              />
            </View>
          </View>
        </ImageBackground>
        {isShow && (
          <View
            style={{
              position: "absolute",
              top: 180,
              borderRadius: 4,
              right: 20,
              left: 20,
              zIndex: 1,
              marginTop: 50,
              backgroundColor: "#ffffff",
            }}
          >
            {filterdArtistData.map((artist, index) => {
              return (
                //Song searched Item
                <ArtistSearchItem
                  key={`as + ${index}`}
                  index={index}
                  artist={artist}
                ></ArtistSearchItem>
              );
            })}
            {filterdData.map((song, index) => {
              return (
                //Song searched Item
                <TouchableOpacity
                  key={`inas + ${index}`}
                  onPress={() => handleItemClick(song, "search")}
                >
                  <ItemView index={index} song={song}></ItemView>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <Text style={styles.sectionTitle1}>Mới phát hành</Text>
        <View>
          <FlatList
            contentContainerStyle={{ paddingLeft: 20 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={newReleasedSongs}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleItemClick(item, "new")}>
                <HomeCardItemComponent song={item} />
              </TouchableOpacity>
            )}
          />
          <Text style={styles.sectionTitle}>Tạo ngẫu nhiên</Text>
          <FlatList
            snapToInterval={width - 20}
            contentContainerStyle={{ paddingLeft: 20 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={randomSongs}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleItemClick(item, "random")}>
                <RecommendCard song={item} />
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
      <View>
        <Modal
          animationType="fade"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <ArtistScreen
            artist={selectedArtist}
            setModalVisible={setModalVisible}
          ></ArtistScreen>
        </Modal>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  header: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
  },
  headerTitle: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 23,
  },
  inputContainer: {
    height: 60,
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    position: "absolute",
    top: 80,
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "center",
    elevation: 12,
  },
  categoryContainer: {
    marginTop: 60,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconContainer: {
    height: 60,
    width: 60,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  sectionTitle: {
    marginHorizontal: 20,
    marginVertical: 20,
    fontWeight: "bold",
    fontSize: 20,
    color: Colors.defaultTextColor,
  },
  sectionTitle1: {
    marginHorizontal: 20,
    marginVertical: 20,
    marginTop: 60,
    fontWeight: "bold",
    fontSize: 20,
    color: Colors.defaultTextColor,
  },
  rmCard01: {
    width: width - 250,
    height: 200,
    marginRight: 20,
    borderRadius: 30,
    overflow: "hidden",
    padding: 10,
  },
  itemStyle: {
    padding: 10,
  },
  textInputStyle: {
    height: 50,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: "#009688",
    backgroundColor: "white",
  },
  btnTab: {
    width: Dimensions.get("window").width / 3.5,
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "#EBEBEB",
    padding: 10,
    justifyContent: "center",
  },
  itemContainer: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  itemLogo: {
    padding: 10,
    width: 50,
    height: 50,
  },
  itemBody: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  itemImage: {
    width: 50,
    height: 50,
  },
});
export default memo(HomeScreen);
