import { StyleSheet } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "./context/AuthContext";

const RootLayout = () => {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" style={styles.container} />
        <Stack.Screen name="shopping" options={{ headerShown: false }} />
        <Stack.Screen name="todo" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
