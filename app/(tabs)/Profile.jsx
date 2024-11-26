import {
  StyleSheet,
  View,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import constans from "../constans/styling";
import SectionTitle from "../components/SectionTitle";
import LineBreak from "../components/LineBreak";
import SignIn from "../components/SignIn";
import { useAuth } from "../context/AuthContext";
import colors from "../constans/colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const Profile = () => {
  const { user, userData, handleSoundToggle, handleNameChange } = useAuth();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(userData?.name);

  const toggleEdit = () => setEdit((prev) => !prev);

  const saveName = () => {
    handleNameChange(name);
    toggleEdit();
  };

  if (!userData) return null;

  return (
    <ScrollView
      contentContainerStyle={constans.scrollContainer}
      style={{ backgroundColor: colors.background }}>
      <View style={constans.container}>
        <SectionTitle text="Profile" />
        <LineBreak />
        <View style={styles.greetingContainer}>
          <Text style={[styles.greetingText, { color: colors.primary }]}>
            Welcome,
          </Text>
          {edit ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
              <TouchableOpacity onPress={saveName}>
                <Ionicons color={colors.primary} name="checkmark" size={36} />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleEdit}>
                <MaterialIcons color="red" name="cancel" size={36} />
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.greetingText} onPress={toggleEdit}>
              {userData.name}
            </Text>
          )}
        </View>
        <SignIn />
        <View style={styles.optionsContainer}>
          <View style={styles.singleOptionContainer}>
            <Text style={styles.label}>Allow sounds:</Text>
            <Switch
              value={userData.options.allowSounds}
              onValueChange={handleSoundToggle}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  greetingContainer: {
    width: "100%",
    padding: 15,
    marginBottom: 20,
  },
  greetingText: {
    color: "white",
    fontSize: 35,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  input: {
    height: 60,
    fontSize: 24,
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: colors.textPrimary,
  },
  optionsContainer: {
    marginVertical: 30,
  },
  singleOptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: colors.textPrimary,
    fontSize: 18,
  },
});
