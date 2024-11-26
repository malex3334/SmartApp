import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../context/AuthContext";
import colors from "../constans/colors";
import { USER_NAME, USER_PASSWORD } from "@env";

const SignIn = () => {
  const { user, signIn, signOut } = useAuth();
  const email = USER_NAME;
  const password = USER_PASSWORD;
  //testingLogin321!

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.greetingContainer}>
        {user && (
          <>
            <Text
              style={
                (styles.greetingText,
                {
                  color: colors.primary,
                  fontSize: 35,
                  fontWeight: "500",
                  marginBottom: 10,
                })
              }>
              Welcome,{" "}
            </Text>
            <Text style={styles.greetingText}>{user.email}</Text>
          </>
        )}
      </View>
      <View style={styles.buttonContainer}>
        {!user && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => signIn(email, password)}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        )}
        {user && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "orangered" }]}
            onPress={signOut}>
            <Text style={[styles.buttonText, { color: "white" }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },

  greetingContainer: {
    padding: 15,
    flex: 1,
    flexDirection: "column",
    alignSelf: "flex-start",
  },

  greetingText: {
    color: "white",
    fontSize: 20,
    marginBottom: 20, // Adds some spacing
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 15,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    width: 200, // Make button width consistent
    alignItems: "center", // Align text in the center
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    letterSpacing: 2,
    fontSize: 18,
  },
});
