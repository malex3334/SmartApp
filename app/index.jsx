import {
  StyleSheet,
  View,
  ScrollView,
  useColorScheme,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import colors from "./constans/colors";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "./context/AuthContext";
import SectionTitle from "./components/SectionTitle";
import LineBreak from "./components/LineBreak";
import constans from "./constans/styling";
import HeroImg from "../assets/Hero.jpg";
import { auth, FirebaseError } from "../FirebaseConfig";

const Index = () => {
  const { user, setUser, signOut } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)/Garage");
    }
  }, [user, router]);

  useEffect(() => {
    if (!auth.currentUser || auth.currentUser == "undefined") {
      signOut();
    }
  }, []);

  if (!user) {
    return (
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={constans.scrollContainer}>
        <View style={[constans.container]}>
          <StatusBar
            barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
            backgroundColor={colorScheme === "dark" ? "black" : "white"}
            translucent={true}
          />
          <SectionTitle text="Smart APP" />
          <LineBreak />
          <View style={styles.imgContainer}>
            <Image source={HeroImg} style={styles.image} />
            <Text style={[styles.heroText, {}]}>log in... |</Text>
          </View>
          <Text
            style={{
              color: "red",
              fontSize: 25,
              zIndex: 999,
              textAlign: "center",
            }}>
            {FirebaseError ? FirebaseError.message : "fb ok"}
          </Text>
          <TouchableOpacity
            style={constans.touchableButton}
            onPress={() => router.replace("LoginForm")}>
            <Text style={constans.touchableButtonText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: colors.background,
  },

  cardContainer: {
    maxWidth: "100%",
    margin: 5,
    borderColor: "gray",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  imgContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
  },

  heroText: {
    position: "absolute",
    bottom: 75,
    right: 110,
    fontSize: 40,

    color: "white",
    fontWeight: "bold",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderLeftColor: "white",
    borderLeftWidth: 4,
    borderRightColor: "white",
    borderRightWidth: 2,
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  image: {
    width: "100%",
    height: 400,

    borderRadius: 10,
    borderColor: colors.primary,
  },
});
