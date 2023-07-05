import {
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

import { AudioContext } from "../../providers/audio.context";
import ItemComponent from "./components/ItemList.component";
import { AdminContext } from "../../providers/admin.context";
import { ArtistRef, SongRef } from "./const";
import { UserContext } from "../../providers/user.context";
import { StatisticContext } from "../../providers/statistic.context";
import { ArtistContext } from "../../providers/artist.context";

const HistoryAndStatistic = () => {
  const { songs } = useContext(AudioContext);
  const { logout } = useContext(UserContext);
  const { artists } = useContext(ArtistContext);
  const { getAllListenDoc } = useContext(StatisticContext);
  const { getDeleteDocs, refreshFlatlist, setRefreshFlatList } =
    useContext(AdminContext);
  const [deletedSongs, setDeletedSongs] = useState([]);
  const [deletedArtists, setDeletedArtists] = useState([]);
  const [dataChart, setDataChart] = useState([]);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const getRandomColor = (usedColors) => {
    let color = "";
    do {
      color =
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0");
    } while (usedColors.includes(color));
    return color;
  };

  const loadDataChart = async (month, year) => {
    try {
      const listenList = await getAllListenDoc();
      const newDataChart = [];
      const usedColors = [];

      artists.forEach((artist, index) => {
        const count = listenList.filter((item) => {
          const createdAt = new Date(item.createdAt.seconds * 1000);
          return (
            item.artistIds.includes(artist.id) &&
            createdAt.getMonth() + 1 === month &&
            createdAt.getFullYear() === year
          );
        });
        if (count.length != 0) {
          const color = getRandomColor(usedColors);
          usedColors.push(color);
          newDataChart.push({
            name: artist.name,
            population: count.length,
            color: color,
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          });
        }
      });
      setDataChart(newDataChart);
    } catch (er) {
      console.log("err when load data chart", er);
    }
  };
  useEffect(() => {
    loadDataChart(date.getMonth() + 1, date.getFullYear());
  }, []);
  useEffect(() => {
    (async () => {
      const listSong = await getDeleteDocs(SongRef);

      setDeletedSongs(() => listSong);
      const listArtist = await getDeleteDocs(ArtistRef);

      setDeletedArtists(() => listArtist);
    })();
  }, [songs, refreshFlatlist]);
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={{
          backgroundColor: "#19022b",
          padding: 12,
          borderRadius: 25,
          width: 100,
        }}
        onPress={() => {
          setShow(true);
        }}
      >
        <Text style={styles.date}>{moment(date).format("MMM YYYY")}</Text>
      </TouchableOpacity>
      <PieChart
        data={[...dataChart]}
        width={Dimensions.get("window").width - 16}
        height={220}
        chartConfig={{
          backgroundColor: "#1cc910",
          backgroundGradientFrom: "#eff3ff",
          backgroundGradientTo: "#efefef",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute //for the absolute number remove if you want percentage
      />
      <View>
        <Text style={styles.heading}>Deleted Songs</Text>
        <FlatList
          horizontal
          pagingEnabled
          extraData={refreshFlatlist}
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
          horizontal
          pagingEnabled
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
      {show && (
        <RNDateTimePicker
          maximumDate={new Date()}
          mode="date"
          onChange={(event, selectedDate) => {
            if (event.type === "set") {
              setDate(selectedDate);
              const month = selectedDate.getMonth() + 1;
              const year = selectedDate.getFullYear();
              loadDataChart(month, year);
            }
            setShow(false);
          }}
          value={date}
        />
      )}
    </ScrollView>
  );
};

export default HistoryAndStatistic;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    padding: 20,
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
  date: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
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
