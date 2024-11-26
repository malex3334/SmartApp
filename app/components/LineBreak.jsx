import { StyleSheet, View } from "react-native";
import React from "react";

const LineBreak = () => {
  return <View style={styles.lineBreak}></View>;
};

export default LineBreak;

const styles = StyleSheet.create({
  lineBreak: {
    backgroundColor: "white",
    height: 1,
    marginVertical: 20,
    width: 300,
    alignSelf: "center",
  },
});
