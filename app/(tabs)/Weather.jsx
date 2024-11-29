import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import colors from "../constans/colors";
import LineBreak from "../components/LineBreak";
import constans from "../constans/styling";
import SectionTitle from "../components/SectionTitle";
import HumidityIcon from "../../assets/droplet.svg";
import WindIcon from "../../assets/wind.svg";
import PressureIcon from "../../assets/pressure.svg";
import mapImage from "../utils/imageMapping";
import ForeCast from "../components/ForeCast";
import { weatherImages } from "../utils/imageMapping";
import { getHours } from "../utils/Helpers";
import WeatherDetailCard from "../components/WeatherDetailCard";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "expo-router";
import { WEATHERAPI_KEY } from "@env";

const Weather = () => {
  const [data, setData] = useState(null);
  const [foreCast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const { user } = useAuth();
  useEffect(() => {
    //checklogin
    !user && navigation.navigate("index");
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Add the logic to reload data here, for example, a fetch request
    setTimeout(() => {
      setRefreshing(false); // End refreshing after data is loaded
    }, 2000);
  }, []);

  const apiKey = WEATHERAPI_KEY;

  const fetchForecast = async () => {
    const lon = "17.295170";
    const lat = "50.945049";

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=14&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error("error", response.tatus);
      }

      const jsonData = await response.json();
      setForecast(jsonData);
    } catch (error) {
      console.log("forecast", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherData = async () => {
    const lon = "17.295170";
    const lat = "50.945049";

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error("error", response);
      }

      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.log("current weather", error.message);
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    fetchWeatherData();
    fetchForecast();
  }, [onRefresh]);

  if (loading) {
    return (
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[constans.scrollContainer, { flex: 1 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <ActivityIndicator />
      </ScrollView>
    );
  }

  if (!loading) {
    return (
      // <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[constans.scrollContainer, { flexGrow: 0 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={[constans.container]}>
          <SectionTitle text="Weather" />
          <LineBreak />
          <Text style={styles.cityName}>{data?.name}</Text>
          <View style={{ flexDirection: "column" }}>
            <View style={styles.currentContainer}>
              <View
                style={[
                  styles.currentWeatherCard,
                  { justifyContent: "center" },
                ]}>
                <Image
                  source={mapImage(data?.weather[0].icon)}
                  style={styles.currentImage}
                />
                <View style={styles.daylengthContainer}>
                  <View style={styles.daylengthDataContainer}>
                    <Image
                      source={weatherImages.sunny}
                      style={{ width: 18, height: 18 }}
                    />
                    <Text style={styles.daylengthText}>
                      {getHours(data?.sys.sunrise)}
                    </Text>
                  </View>
                  <View style={styles.daylengthDataContainer}>
                    <Image
                      source={weatherImages.cloudyN}
                      style={{ width: 18, height: 18 }}
                    />
                    <Text style={styles.daylengthText}>
                      {getHours(data?.sys.sunset)}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={[
                  styles.currentWeatherCard,
                  {
                    backgroundColor: "rgba(255,255,255,0.05)",
                    flexGrow: 1.25,
                    borderWidth: 1,
                    borderColor: colors.primary,
                    marginBottom: 10,
                    marginTop: 10,
                  },
                ]}>
                <View
                  style={{ flexDirection: "row", alignContent: "flex-end" }}>
                  {loading ? (
                    <ActivityIndicator />
                  ) : (
                    <Text style={styles.currentTemp}>
                      {data?.main.temp.toFixed(1)}
                    </Text>
                  )}
                  <Text
                    style={[
                      styles.currentTemp,
                      { fontSize: 50, fontWeight: "100" },
                    ]}>
                    °C
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 20,
                  }}>
                  <Text
                    style={[
                      styles.currentMinMax,
                      { backgroundColor: colors.hmd },
                    ]}>
                    {data?.main.temp_min.toFixed(1)}°C
                  </Text>
                  <Text
                    style={[
                      styles.currentMinMax,
                      { backgroundColor: "orangered" },
                    ]}>
                    {data?.main.temp_max.toFixed(1)}°C
                  </Text>
                </View>
              </View>
            </View>
            {/* details */}
            <View style={styles.currentDetailsContainer}>
              <WeatherDetailCard
                icon={PressureIcon}
                value={data?.main.pressure}
                unit="hPa"
                color="gray"
                loading={loading}
              />
              <View style={styles.breakLine}></View>
              <WeatherDetailCard
                icon={HumidityIcon}
                value={data?.main.humidity}
                unit="%"
                color={colors.hmd}
                loading={loading}
              />
              <View style={styles.breakLine}></View>
              <WeatherDetailCard
                icon={WindIcon}
                value={data?.wind?.speed}
                unit="km/h"
                color="lightblue"
                loading={loading}
              />
            </View>
          </View>
          <LineBreak />
          <Text style={[constans.sectionTitle, { fontSize: 25 }]}>
            Forecast
          </Text>
          <View style={styles.forecastContainer}>
            {foreCast?.list.map((element, index) => {
              return <ForeCast data={element} key={index} />;
            })}
          </View>
        </View>
      </ScrollView>
      // </SafeAreaView>
    );
  }
};

export default Weather;

const styles = StyleSheet.create({
  cityName: {
    alignItems: "center",
    // backgroundColor: "red",
    alignSelf: "center",
    color: colors.textPrimary,
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: 2,
    marginTop: 20,
  },

  currentContainer: {
    marginTop: 0,
    flex: 0.1,
    flexDirection: "row",
    padding: 15,
    gap: 10,
  },

  currentWeatherCard: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    minHeight: 150,
    borderRadius: 10,
  },

  currentImage: {
    width: 120,
    height: 120,
    ressizeMode: "contain",
  },

  daylengthContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 5,
  },

  daylengthDataContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
  },

  daylengthText: {
    color: colors.textPrimary,
  },
  currentMinMax: {
    color: colors.textSecondary,
    paddingHorizontal: 10,
  },

  currentTemp: {
    color: colors.textPrimary,
    fontSize: 64,
    fontWeight: "00",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.5)",
  },
  currentHmd: {
    fontSize: 32,
    color: colors.textPrimary,
  },

  forecastContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
    rowGap: 15,
  },

  currentDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  currentDetailsCard: {
    flexDirection: "column",
    flex: 0.3,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
    padding: 5,
    gap: 15,
  },

  currentDetailsCardText: {
    color: colors.textPrimary,
    fontSize: 18,
  },

  currentdetailsIcon: {
    width: 40,
    height: 40,
  },

  breakLine: {
    borderLeftColor: "gray",
    borderRightColor: "white",
    borderLeftWidth: 1.5,
    height: "75%",
    alignSelf: "center",
  },
});
