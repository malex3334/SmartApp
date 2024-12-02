import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { database } from "../../FirebaseConfig";
import { onValue, ref } from "firebase/database";
import TermometerIcon from "../../assets/termometer.svg";
import HumidityIcon from "../../assets/droplet.svg";
import colors from "../constans/colors";
import { Audio } from "expo-av";
import LineBreak from "../components/LineBreak";
import GarageStatus from "../components/GarageStatus";
import SectionTitle from "../components/SectionTitle";
import { useAuth } from "../context/AuthContext";
import { formatGarageTimestamp } from "../utils/Helpers";
import TabContainer from "../components/TabContainer";

const Garage = () => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [garageLog, setGarageLog] = useState([]);
  const [openTab, setOpenTab] = useState(false);
  const [sound, setSound] = useState(null);
  const [lostSignalCounter, setLostSignalCounter] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false); // End refreshing after data is loaded
    }, 2000);
  }, []);

  const dataRef = ref(database, "log");
  const garageLogRef = ref(database, "logs");

  const handleShowLogPress = () => {
    setOpenTab(!openTab);
  };

  const renderItem = ({ item, index }) =>
    index < 20 && (
      <View
        style={
          item.status == "CLOSED"
            ? styles.itemContainer
            : styles.itemContainerRed
        }>
        <Text style={styles.itemText}>
          {formatGarageTimestamp(item.timestamp, {
            month: "numeric",
            year: "numeric",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}{" "}
          {"  "}
          {item.status}
        </Text>
      </View>
    );

  // sound
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/update.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const cleanupArray = (fixedArray) => {
    setLostSignalCounter(0);
    for (let i = 0; i < fixedArray.length - 1; i++) {
      if (fixedArray[i].status === fixedArray[i + 1].status) {
        setLostSignalCounter((prev) => prev + 1);
        fixedArray.splice(i, 1);
        i--; // Decrement to re-check at the adjusted index after removal
      }
    }
    return fixedArray;
  };

  useEffect(() => {
    setLoading(true);
    onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const snap = snapshot.val();
        setData(snap);
        setLoading(false);
      } else {
        console.log("no data to log");
      }
    });

    onValue(garageLogRef, (snapshot) => {
      if (snapshot.exists()) {
        const logSnap = snapshot.val();
        const arrayLog = Object.values(logSnap);
        let fixedArray = arrayLog.reverse();
        cleanupArray(fixedArray);
        setGarageLog(fixedArray);
        setLoading(false);
        userData?.options.allowSounds && playSound();
      } else {
        console.log("no data for logs");
      }
    });
  }, []);

  return (
    // <SafeAreaView style={[styles.safeArea]}>
    <TabContainer>
      <SectionTitle text="GARAGE" />

      <LineBreak />
      {loading ? (
        <ActivityIndicator color="#126ADC" /> // Loader animation
      ) : (
        <GarageStatus data={data} loading={loading} setLoading={setLoading} />
      )}
      <View style={styles.dataContainer}>
        <LineBreak />
        <View style={styles.dhtContainer}>
          <View style={styles.dhtCardContainer}>
            <TermometerIcon fill={"#CE49BC"} style={styles.tempIcon} />
            {loading ? (
              <ActivityIndicator color="#126ADC" />
            ) : (
              <Text style={styles.dhtText}>{data?.temp}°C</Text>
            )}
          </View>
          <View style={styles.dhtCardContainer}>
            <HumidityIcon fill={"#136ADC"} style={styles.hmdIcon} />
            {loading ? (
              <ActivityIndicator color="#126ADC" />
            ) : (
              <Text style={styles.dhtText}>{data?.hmd}%</Text>
            )}
          </View>
        </View>

        <LineBreak />
        <View style={{ marginBottom: 10 }}>
          <Button
            color="#126ADC"
            title={!openTab ? "Show Log" : "Close log"}
            onPress={handleShowLogPress}
          />
        </View>

        {openTab ? (
          <>
            <Text
              style={{
                color: "white",
                fontWeight: "300",
                letterSpacing: 2,
              }}>
              Total connection interruptions:{" "}
              {lostSignalCounter && lostSignalCounter}
            </Text>
            <FlatList
              data={garageLog}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.flatListContainer}
            />
          </>
        ) : null}
      </View>
    </TabContainer>
  );
};

export default Garage;

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
    backgroundColor: "black",
  },

  container: {
    flexGrow: 1,
    marginTop: 32,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderRadius: 10,
  },

  dataContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  dataText: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.textPrimary,
    marginVertical: 4,
  },
  highlightedText: {
    fontWeight: "700",
    color: colors.primary,
  },
  highlightedTextRed: {
    fontWeight: "700",
    color: "red", // Highlight color
  },
  flatListContainer: {
    padding: 20,
  },
  itemContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginVertical: 2,
    borderLeftColor: colors.primary,
    borderLeftWidth: 5,
    borderRadius: 5,
    // elevation: 5, // For Android
  },
  itemContainerRed: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginVertical: 2,
    // backgroundColor: 'red',
    borderLeftColor: "red",
    borderLeftWidth: 5,
    borderRadius: 5,

    // elevation: 5, // For Android
  },
  itemText: {
    fontSize: 16,
    color: colors.textPrimary,
  },

  dhtContainer: {
    width: 300,
    flex: 1,
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-evenly",
  },

  dhtText: {
    fontSize: 36,
    fontWeight: "100",
    color: colors.textPrimary,
  },

  dhtCardContainer: {
    flexDirection: "column",
    gap: 10,
  },

  tempIcon: {
    width: 60,
    height: 60,
    opacity: 0.9,
  },
  hmdIcon: {
    width: 60,
    height: 60,
    opacity: 0.9,
  },
});
