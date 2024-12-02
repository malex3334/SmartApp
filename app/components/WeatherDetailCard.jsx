import { StyleSheet, Text, View, ActivityIndicator } from "react-native"; // Import ActivityIndicator
import React from "react";
import colors from "../constans/colors";

const WeatherDetailCard = ({ icon: Icon, value, unit, color, loading }) => {
  return (
    <View style={styles.currentDetailsCard}>
      <Icon style={[{ fill: color || "gray" }, styles.currentdetailsIcon]} />
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Text style={styles.currentDetailsCardText}>
          {value} {unit}
        </Text>
      )}
    </View>
  );
};

export default WeatherDetailCard;

const styles = StyleSheet.create({
  currentDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  currentDetailsCard: {
    flexDirection: "column",
    flex: 0.3,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    gap: 15,
  },

  currentDetailsCardText: {
    color: colors.textPrimary,
    fontSize: 18,
  },

  currentdetailsIcon: {
    width: 40,
    height: 40,
  },
});
