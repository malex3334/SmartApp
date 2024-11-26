// shopping.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Shopping = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome to the Shopping Screen!</Text>
    </View>
  );
};

export default Shopping;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
