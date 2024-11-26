import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import colors from "../constans/colors";
import mapImage from "../utils/imageMapping";
import formatTimestamp from "../utils/Helpers";

const ForeCast = ({ data }) => {
  const hour = data?.dt_txt.slice(11, -6);
  const day = data?.dt_txt.slice(8, 11);
  if (hour == "03" || hour == "15" || hour == "09") return;
  return (
    <View style={styles.forecastCard}>
      <Text style={styles.forecastBackground}>
        {formatTimestamp(data?.dt)}.
      </Text>
      <Text style={styles.text}>{data.dt_txt.slice(11, -3)}</Text>
      <View style={styles.imageTempContainer}>
        <Image
          source={mapImage(data?.weather[0].icon)}
          style={styles.currentImage}
        />
        <Text style={styles.temperature}>{data?.main.temp.toFixed(0)} C</Text>
      </View>
    </View>
  );
};

export default ForeCast;

const styles = StyleSheet.create({
  forecastCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 5,
    paddingHorizontal: 10,
    minHeight: 95,
    minWidth: 110,
    maxWidth: 110,
  },
  text: {
    color: colors.textPrimary,
    letterSpacing: 0.75,
    alignSelf: "center",
    marginVertical: 5,
  },
  currentImage: {
    width: 24,
    height: 24,
    ressizeMode: "contain",
  },

  imageTempContainer: {
    padding: 3,
    display: "flex",
    flexDirection: "row",
    // backgroundColor: "red",
    justifyContent: "space-around",
    alignItems: "center",
    // borderColor: colors.primary,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
  },
  temperature: {
    fontSize: 22,
    color: colors.textPrimary,
  },
  forecastBackground: {
    position: "absolute",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 1,
    fontSize: 20,
    right: 5,
    bottom: 3,
    fontWeight: "900",
  },
});
