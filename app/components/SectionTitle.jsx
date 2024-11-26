import { StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../constans/colors";

const SectionTitle = ({ text }) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>{text}</Text>
    </View>
  );
};

export default SectionTitle;

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 36,
    letterSpacing: 3,
    fontWeight: "500",
    color: colors.textPrimary,
    textAlign: "center",
    marginTop: 20,
  },
});
