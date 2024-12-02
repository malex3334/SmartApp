import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import constans from "../constans/styling";
import colors from "../constans/colors";

const TabContainer = ({ children, style }) => {
  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={constans.scrollContainer}
      // refreshControl={
      //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      // }
    >
      <View style={constans.container}>{children}</View>
    </ScrollView>
  );
};

export default TabContainer;

const styles = StyleSheet.create({});
