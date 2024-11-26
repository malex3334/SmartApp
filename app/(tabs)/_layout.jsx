import { StatusBar, StyleSheet } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import GarageIcon from "../assets/garage.svg";
import HomeIcon from "../assets/house.svg";
import Weather from "../assets/weather.svg";
import Remote from "../assets/hashtag.svg";
import {
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import User from "../assets/user-solid.svg";
import colors from "../constans/colors";
import { useColorScheme } from "react-native";

const TabLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <>
      <StatusBar
      // barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} // Sets text/icon color
      // backgroundColor={colorScheme === "dark" ? "black" : "white"} // Sets background color
      // translucent={true} // Ensure status bar doesn't overlap content
      />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.tabBackground,
            height: 75,
          },
          tabBarLabelStyle: { fontSize: 14, paddingTop: 5 },
        }}>
        <Tabs.Screen
          name="Garage"
          omponent={require("./Garage").default}
          options={{
            tabBarIcon: ({ color }) => (
              <GarageIcon fill={color} style={styles.icon} />
            ),
          }}
        />
        <Tabs.Screen
          name="Home"
          options={{
            tabBarIcon: ({ color }) => (
              <HomeIcon fill={color} style={styles.icon} />
            ),
          }}
        />
        <Tabs.Screen
          name="Weather"
          options={{
            tabBarIcon: ({ color }) => (
              // <Weather fill={color} style={styles.icon} />
              <Ionicons
                name="partly-sunny-sharp"
                fill={color}
                color={color}
                size={24}
                style={{ marginTop: 5 }}
                // style={styles.icon}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Remote"
          options={{
            tabBarIcon: ({ color }) => (
              // <Remote fill={color} style={styles.icon} />
              <MaterialCommunityIcons
                name="remote-tv"
                fill={color}
                color={color}
                size={24}
                style={{ marginTop: 5 }}
                // style={styles.icon}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            tabBarIcon: ({ color }) => (
              <User fill={color} style={styles.icon} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabLayout;

const styles = StyleSheet.create({
  icon: {
    marginTop: 10,
    width: 24, // Adjust size as needed
    height: 24, // Adjust size as needed
  },
});
