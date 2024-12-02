import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Vibration } from "react-native";
import colors from "../constans/colors";
import LineBreak from "../components/LineBreak";
import SectionTitle from "../components/SectionTitle";
import {
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import TabContainer from "../components/TabContainer";

const Remote = () => {
  const tvArray = [
    { fn: "tv", label: "pwr" },
    { fn: "tv+", label: "+" },
    { fn: "tv-", label: "-" },
  ];
  const ampArray = [
    { fn: "amp", label: "pwr" },
    { fn: "amp+", label: "+" },
    { fn: "amp-", label: "-" },
  ];
  const srcArray = [
    { fn: "cd", label: "cd" },
    { fn: "pc", label: "pc" },
    { fn: "bt", label: "bt" },
  ];
  const buttonsArray4 = [{ fn: "all", label: "pwr" }];
  const [error, setError] = useState("");
  const [status, setStatus] = useState(false);

  const createButtons = (sourceArray, styling) => {
    const addIcon = (label) => {
      switch (label) {
        case "pwr":
          return <FontAwesome name="power-off" size={20} color="lightgray" />;
        case "cd":
          return <FontAwesome name="tv" size={20} color="lightgray" />;
        case "pc":
          return (
            <MaterialCommunityIcons
              name="desktop-tower"
              size={20}
              color="lightgray"
            />
          );
        case "bt":
          return <FontAwesome name="bluetooth" size={20} color="lightgray" />;
        default:
          return <Text style={styles.buttonText}>{label}</Text>;
      }
    };

    return sourceArray.map((button, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => handleButtonPress(button.fn)}
        style={[styles.button, styling]}>
        {addIcon(button?.label)}
      </TouchableOpacity>
    ));
  };

  const vibrationFailed = () => {
    Vibration.vibrate([200, 100, 500]);
  };

  const checkConnection = () => {
    const ip = "http://192.168.1.25";
    fetch(`${ip}/`)
      .then((response) => {
        if (!response.ok) {
          setStatus(false);
        }
      })
      .then((data) => {
        setStatus(true);
      })
      .catch((error) => {
        console.log(error);
        setStatus(false);
      });
  };

  const sendSignal = (signalName) => {
    const ip = "http://192.168.1.25";
    fetch(`${ip}/${signalName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response;
      })
      .then((data) => {
        console.log("Signal sent successfully:", data);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      })
      .catch((error) => {
        console.error("Error sending signal:", error);
        vibrationFailed();
        setError(error);
      });
  };

  const handleButtonPress = (e) => {
    sendSignal(e);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      checkConnection();
    }, 10000);

    checkConnection();

    return () => clearInterval(intervalId);
  }, []);

  return (
    <TabContainer>
      <SectionTitle text="Remote" />
      <LineBreak />
      <View style={styles.dotContainer}>
        <Text style={{ color: "white", fontSize: 20 }}>status:</Text>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: !status ? "red" : colors.primary },
          ]}></View>
      </View>

      <View
        style={[
          styles.borderContainer,
          { borderColor: status ? colors.primary : "red" },
        ]}>
        <View style={{ position: "absolute", top: 20 }}>
          {createButtons(buttonsArray4, styles.buttonsALL)}
        </View>
        <View style={[styles.rowContainer]}>
          <FontAwesome name="tv" size={25} color="lightgray" />
          {createButtons(tvArray, styles.buttonsTV)}
        </View>
        <View style={styles.rowContainer}>
          <MaterialCommunityIcons
            name="amplifier"
            size={25}
            color="lightgray"
          />
          {createButtons(ampArray)}
        </View>
        <View style={styles.rowContainer}>
          <MaterialIcons name="input" size={25} color="lightgray" />
          {createButtons(srcArray, styles.buttonsAMP)}
        </View>
      </View>
    </TabContainer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "black",
  },

  container: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: colors.background,
    width: "100%",
    paddingHorizontal: 20,
  },

  borderContainer: {
    position: "relative",
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 10,
    width: "100%",
    minHeight: "60%",
    padding: 30,
    paddingTop: 120,
    paddingBottom: 60,
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 30,
    flexDirection: "row",
    marginTop: 20,
    backgroundColor: "rgba(25,25,25,.9)",
  },
  rowContainer: {
    gap: 30,
    alignItems: "center",
  },
  button: {
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.primary,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: "400",
  },
  buttonsTV: {
    borderColor: "orangered",
  },
  buttonsAMP: {
    borderColor: colors.blue,
  },

  buttonsALL: {
    width: 100,
    // backgroundColor: "orangered",
    borderColor: "orangered",
  },

  buttonsHeader: {
    alignSelf: "center",
    color: colors.textPrimary,
    fontSize: 24,
  },

  dotContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
  },

  statusDot: {
    width: 20,
    height: 20,
    borderRadius: "50%",
  },
});

export default Remote;
