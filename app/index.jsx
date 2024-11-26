import {
  StyleSheet,
  View,
  ScrollView,
  useColorScheme,
  Image,
  Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import colors from "./constans/colors";
import { StatusBar } from "expo-status-bar";
import SignIn from "./components/SignIn";
import { useAuth } from "./context/AuthContext";
import SectionTitle from "./components/SectionTitle";
import LineBreak from "./components/LineBreak";
import constans from "./constans/styling";
import HeroImg from "./assets/Hero.jpg";

const Index = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)/Garage");
    }
  }, [user, router]); // The effect will run when `user` changes

  if (!user) {
    return (
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={constans.scrollContainer}>
        <View style={[constans.container]}>
          <StatusBar
            barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} // Sets text/icon color
            backgroundColor={colorScheme === "dark" ? "black" : "white"} // Sets background color
            translucent={true} // Ensure status bar doesn't overlap content
          />
          <SectionTitle text="Smart APP" />
          <LineBreak />
          <View style={styles.imgContainer}>
            <Image source={HeroImg} style={styles.image} />
            <Text style={[styles.heroText, {}]}>log in... |</Text>
          </View>
          <SignIn />
        </View>
      </ScrollView>
    );
  }

  // if (user) {
  //   router.replace("/(tabs)/Garage");
  // }
  //   if (user) {
  //     return (
  //       <ScrollView contentContainerStyle={styles.container}>
  //         <View>
  //           <StatusBar backgroundColor="white" />
  //           <View style={[styles.cardContainer]}>
  //             <Link href="/Garage">
  //               <Garage />
  //             </Link>
  //           </View>
  //           {/* <View style={[styles.cardContainer]}>
  //             <Link href="/Home">
  //               <Home />
  //             </Link>
  //           </View> */}
  //           {/* <Link href="/Weather" style={{}}> */}
  //           <Pressable
  //             onPress={() => router.push("/Weather")}
  //             style={[styles.cardContainer, { flexGrow: 0, maxHeight: 1000 }]}>
  //             <Weather />
  //           </Pressable>
  //           {/* </Link> */}
  //           <View style={[styles.cardContainer]}>
  //             <Link href="/Remote">
  //               <Remote />
  //             </Link>
  //           </View>
  //         </View>
  //       </ScrollView>
  //     );
  //   }
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: colors.background,
    // maxWidth: 400,
  },

  cardContainer: {
    maxWidth: "100%",
    margin: 5, // Add some spacing between cards
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
    // color: "orangered",
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
    // borderWidth: 3,

    borderRadius: 10,
    borderColor: colors.primary,
  },
});
