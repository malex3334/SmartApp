import {
  StyleSheet,
  Text,
  View,
  Animated,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import GarageIcon from "../assets/garage.svg";
import WifiIcon from "../assets/wifi.svg";
import WifiLowIcon from "../assets/wifilow.svg";
import WifiMidIcon from "../assets/wifimid.svg";
import colors from "../constans/colors";
import { formatGarageTimestamp } from "../utils/Helpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const GarageStatus = ({ data, loading, setLoading }) => {
  const [isConnected, setIsConnected] = useState(true);
  const circleBackgroundColor =
    data?.status === "CLOSED" ? colors.primary : "red";

  // Initialize bounce animation value
  const scaleAnim = new Animated.Value(1); // Initial scale (1 is the original size)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const curTimestamp = Math.floor(Date.now() / 1000);
      const dataTimestamp = Math.floor(data?.timestamp);
      if (curTimestamp - dataTimestamp > 35) {
        setIsConnected(false);
      } else {
        setIsConnected(true);
      }
    }, 5000); // Runs every 15 seconds

    // Cleanup function to clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [data]); // Empty dependency array means it runs once when the component mounts and doesn't depend on any changes.

  // Define bounce animation
  const statusAnimation = () => {
    Animated.timing(scaleAnim, {
      toValue: 1.05,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  useEffect(() => {}, [isConnected]);

  useEffect(() => {
    statusAnimation();
  }, [data]);

  const handleWifiIcon = (value) => {
    switch (true) {
      case value == 0:
        // return <WifiNoIcon style={styles.wifiIcon} />;
        return (
          <MaterialCommunityIcons
            name="wifi-off"
            size={24}
            color="red"
            style={styles.wifiIcon}
          />
        );
      case value <= 35:
        return <WifiLowIcon style={styles.wifiIcon} />;
      case value > 35 && value < 75:
        return <WifiMidIcon style={styles.wifiIcon} />;
      case value >= 75:
        return <WifiIcon style={styles.wifiIcon} />;
      default:
        return <WifiIcon style={[styles.wifiIcon, { fill: "gray" }]} />;
    }
  };
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <View style={[styles.signContainer]}>
        {/* <Animated.View style={{opacity: fadeAnim}}> */}
        <View
          style={[
            styles.statusCircle,
            { backgroundColor: circleBackgroundColor },
          ]}
        />
        <View
          style={[
            styles.statusOuterCircle,
            { borderColor: circleBackgroundColor },
          ]}
        />
        <GarageIcon fill={"white"} style={styles.garageIcon} />
        {loading ? (
          <ActivityIndicator size="small" color="#126ADC" />
        ) : (
          handleWifiIcon(isConnected ? data?.connection : 0)
        )}
        <Text style={styles.wifiConnection}>
          {isConnected ? data?.connection : 0}%
        </Text>
      </View>

      <Text style={styles.timestamp}>
        {formatGarageTimestamp(data?.timestamp, {
          month: "numeric",
          year: "numeric",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })}
      </Text>
    </Animated.View>
  );
};

export default GarageStatus;

const styles = StyleSheet.create({
  timestamp: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 2,
    color: colors.textPrimary,
    textAlign: "center",
    padding: 5,
    marginTop: 30,
  },

  signContainer: {
    marginTop: 20,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },

  statusCircle: {
    position: "relative",
    width: 110,
    height: 110,
    opacity: 0.6,
    borderRadius: 1000,
    filter: "blur(5px)",
  },
  statusOuterCircle: {
    bottom: "50% - 110",
    left: "50% - 110",
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 1000,
    borderWidth: 10,
    transform: "scale(1.3)",
    // filter: "blur(1px)",
  },

  garageIcon: {
    position: "absolute",
    bottom: 30,
    width: 45,
    height: 45,
    opacity: 1,
  },
  wifiIcon: {
    position: "absolute",
    top: 0,
    right: 75,
    width: 20,
    height: 20,
    opacity: 1,
  },

  wifiConnection: {
    color: colors.textPrimary,
    position: "absolute",
    top: 12,
    right: 48,
    fontWeight: "500",
  },

  closed: {
    borderColor: "red",
  },
});
