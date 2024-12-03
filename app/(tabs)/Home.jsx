import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import React from "react";
import colors from "../constans/colors";
import SectionTitle from "../components/SectionTitle";
import LineBreak from "../components/LineBreak";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import TabContainer from "../components/TabContainer";

const Home = () => {
  const router = useRouter();

  const handlePress = (target) => {
    switch (target) {
      case "Shopping":
        router.push(`/shopping`);
        break;
      case "ToDo":
        router.push("/todo");
        break;
      default:
        router.push(target);
    }
  };

  const createIcon = (iconName, target) => {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress(target)}>
        <MaterialCommunityIcons
          style={styles.buttonText}
          name={iconName}
          color="white"
          size={50}
        />
        <Text style={{ color: "white", letterSpacing: 1 }}>{target}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <TabContainer>
      <SectionTitle text="Home" />
      <LineBreak />
      <View style={styles.buttonsContainer}>
        {createIcon("remote-tv", "Remote")}
        {createIcon("sun-thermometer", "Weather")}
        {createIcon("garage", "Garage")}
        {createIcon("cart", "Shopping")}
        {createIcon("calendar", "Calendar")}
        {createIcon("clipboard", "ToDo")}
      </View>
    </TabContainer>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "black",
  },
  buttonsContainer: {
    borderRadius: 10,
    flexGrow: 0,
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },

  button: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: 90,
    height: 90,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    backgroundColor: colors.background,
    elevation: 5,
  },

  buttonText: {
    color: colors.textPrimary,
    fontSize: 45,
  },
});
