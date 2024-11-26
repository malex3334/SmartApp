import { StyleSheet, View, ScrollView, Switch, Text } from "react-native";
import React from "react";
import constans from "../constans/styling";
import SectionTitle from "../components/SectionTitle";
import LineBreak from "../components/LineBreak";
import SignIn from "../components/SignIn";
import { AuthProvider, useAuth } from "../context/AuthContext";
import colors from "../constans/colors";

const Profile = () => {
  const { allowSound, setAllowSound } = useAuth(AuthProvider);

  return (
    <ScrollView
      contentContainerStyle={constans.scrollContainer}
      style={{ backgroundColor: colors.background }}>
      <View style={[constans.container]}>
        <SectionTitle text="Profile" />
        <LineBreak />
        <SignIn />
        <View style={styles.optionsContainer}>
          <View style={styles.singleOptionContainer}>
            <Text style={styles.label}>Allow sounds:</Text>
            <Switch
              value={allowSound}
              onValueChange={() => setAllowSound((prev) => !prev)}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  optionsContainer: {
    flex: 1,
    marginVertical: 30,
    // backgroundColor: "red",
  },
  singleOptionContainer: {
    // backgroundColor: "red",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 25,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 20,
  },
});
