import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
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
import COLORS from "../consts/colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import places from "../consts/places";
import { AudioContext } from "../providers/audio.context";
import { AuthenticationContext } from "../providers/authentication.context";
import { ArtistContext } from "../providers/artist.context";
import ArtistScreen from "./Artist.Screen";

const { width } = Dimensions.get("screen");
const HomeScreen = ({ navigation }) => {
  const { songs, currentSong, setCurrentSong, setPlayerVisbile } =
    useContext(AudioContext);
  const { artists } = useContext(ArtistContext);
  const { user } = useContext(AuthenticationContext);
  const [filterdData, setfilterdData] = useState([]);
  const [filterdArtistData, setfilterdArtistData] = useState([]);
  const [search, setsearch] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const searchFilter = (text) => {
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
  };
  const refreshSearch = () => {
    setfilterdData([]);
    setsearch("");
    setfilterdArtistData([]);
  };
  const ItemView = ({ song, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          refreshSearch();
          setCurrentSong(song);
          setPlayerVisbile((prev) => !prev);
        }}
        style={styles.itemStyle}
      >
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
      </TouchableOpacity>
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
  const ItemSeparatorView = () => {
    return (
      <View
        style={{ height: 0.8, width: "100%", backgroundColor: "#332222" }}
      />
    );
  };

  const categoryIcon = [
    <Icon name="flight" size={25} color={COLORS.primary} />,
    <Icon name="flight" size={25} color={COLORS.primary} />,
    <Icon name="flight" size={25} color={COLORS.primary} />,
    <Icon name="flight" size={25} color={COLORS.primary} />,
  ];
  const ListCategory = () => {
    return (
      <View style={styles.categoryContainer}>
        {categoryIcon.map((icon, index) => (
          <View key={index} style={styles.iconContainer}>
            {icon}
          </View>
        ))}
      </View>
    );
  };
  const Card = ({ place }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("PlaySongScreen", place)}
      >
        <ImageBackground style={styles.cardImage} source={place.image}>
          <Text
            style={{
              color: COLORS.white,
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            {place.name}
          </Text>
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Icon name="visibility" size={20} color={COLORS.white} />
              <Text style={{ marginLeft: 5, color: COLORS.white }}>
                {place.location}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Icon name="star" size={20} color={COLORS.white} />
              <Text style={{ marginLeft: 5, color: COLORS.white }}>5.0</Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };
  const RecommendCard = ({ place }) => {
    return (
      <ImageBackground style={styles.rmCard} source={place.image}>
        <Text
          style={{
            color: COLORS.white,
            fontSize: 22,
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          {place.name}
        </Text>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <View style={{ width: "100%", flexDirection: "row", marginTop: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <Icon name="visibility" size={22} color={COLORS.white} />
              <Text
                style={{
                  flexDirection: "row",
                  marginLeft: 5,
                  color: COLORS.white,
                }}
              >
                {place.location}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Icon name="star" size={22} color={COLORS.white} />
              <Text
                style={{
                  flexDirection: "row",
                  marginLeft: 5,
                  color: COLORS.white,
                }}
              >
                5.0
              </Text>
            </View>
          </View>
          <Text style={{ color: COLORS.white, fontSize: 13 }}>
            {place.default}
          </Text>
        </View>
      </ImageBackground>
    );
  };

  const Card01 = ({ place }) => {
    return (
      <ImageBackground style={styles.rmCard01} source={place.image}>
        <Text
          style={{
            color: COLORS.white,
            fontSize: 22,
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          {place.name}
        </Text>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <View style={{ width: "100%", flexDirection: "row", marginTop: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <Icon name="visibility" size={22} color={COLORS.white} />
              <Text
                style={{
                  flexDirection: "row",
                  marginLeft: 5,
                  color: COLORS.white,
                }}
              >
                {place.location}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Icon name="star" size={22} color={COLORS.white} />
              <Text
                style={{
                  flexDirection: "row",
                  marginLeft: 5,
                  color: COLORS.white,
                }}
              >
                5.0
              </Text>
            </View>
          </View>
          <Text style={{ color: COLORS.white, fontSize: 13 }}>
            {place.default}
          </Text>
        </View>
      </ImageBackground>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar translucent={false} backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <Icon name="sort" size={28} color={COLORS.white} />
        <Icon name="notifications-none" size={28} color={COLORS.white} />
      </View>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View
          style={{
            backgroundColor: COLORS.primary,
            height: 90,
            paddingHorizontal: 20,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={styles.headerTitle}
            >{`Hello ${user.displayName}`}</Text>
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
        </View>
        {isShow && (
          <View
            style={{
              position: "absolute",

              top: 80,
              right: 20,
              left: 20,
              zIndex: 1,
              marginTop: 50,
              backgroundColor: "red",
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
                <ItemView
                  key={`inas + ${index}`}
                  index={index}
                  song={song}
                ></ItemView>
              );
            })}
          </View>
        )}

        <ListCategory />
        <Text style={styles.sectionTitle}>Nổi bật</Text>
        <View>
          <FlatList
            contentContainerStyle={{ paddingLeft: 20 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={places}
            renderItem={({ item }) => <Card place={item} />}
          />
          <Text style={styles.sectionTitle}>Của bạn</Text>
          <FlatList
            snapToInterval={width - 20}
            contentContainerStyle={{ paddingLeft: 20 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={places}
            renderItem={({ item }) => <RecommendCard place={item} />}
          />
          <Text style={styles.sectionTitle}>Lựa chọn hôm nay</Text>
          <FlatList
            snapToInterval={width - 20}
            contentContainerStyle={{ paddingLeft: 20 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={places}
            renderItem={({ item }) => <Card01 place={item} />}
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
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 23,
  },
  inputContainer: {
    height: 60,
    width: "100%",
    backgroundColor: "#ece8e8",
    borderRadius: 10,
    position: "absolute",
    top: 60,
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
  },
  cardImage: {
    height: 220,
    width: width / 2,
    marginRight: 20,
    padding: 10,
    overflow: "hidden",
    borderRadius: 10,
  },
  rmCard: {
    width: width - 40,
    height: 200,
    marginRight: 20,
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
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
export default HomeScreen;
