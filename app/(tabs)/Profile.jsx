import {
  StyleSheet,
  View,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import SectionTitle from "../components/SectionTitle";
import LineBreak from "../components/LineBreak";
import SignIn from "../components/SignIn";
import OptionComponent from "../components/OptionComponent";
import { useAuth } from "../context/AuthContext";
import colors from "../constans/colors";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import TabContainer from "../components/TabContainer";

const Profile = () => {
  const {
    user,
    userData,
    handleSoundToggle,
    handleNameChange,
    handleLangChange,
  } = useAuth();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(userData?.name);
  const [optionValue, setOptionsValue] = useState(userData?.options.lang);
  const [options, setOptions] = useState([
    { label: "PL", value: "pl" },
    { label: "ENG", value: "en" },
  ]);

  const toggleEdit = () => setEdit((prev) => !prev);

  const saveName = () => {
    handleNameChange(name);
    toggleEdit();
  };

  const saveLang = () => {
    handleLangChange(optionValue);
  };

  console.log(optionValue);
  if (!userData) return null;

  return (
    <TabContainer>
      <SectionTitle text="Profile" />
      <LineBreak />
      <View style={styles.greetingContainer}>
        <Text style={[styles.greetingText, { color: colors.primary }]}>
          Welcome,
        </Text>
        <FontAwesome size={100} color="white" name="user" />
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
        <LineBreak />
        <View style={styles.optionsHeaderContainer}>
          <Text style={styles.optionsHeader}>Options</Text>
        </View>
        <View style={styles.singleOptionContainer}>
          <Text style={styles.label}>Allow sounds:</Text>
          <Switch
            value={userData.options.allowSounds}
            onValueChange={handleSoundToggle}
          />
        </View>
        <View style={styles.singleOptionContainer}>
          <Text style={[styles.label, { flex: 1 }]}>Language:</Text>
          <View style={styles.optionComponentContainer}>
            <OptionComponent
              options={options}
              setOptions={setOptions}
              value={optionValue}
              setValue={setOptionsValue}
              saveLang={saveLang}
            />
          </View>
        </View>
      </View>
    </TabContainer>
  );
};

export default Profile;

const styles = StyleSheet.create({
  greetingContainer: {
    width: "100%",
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    gap: 10,
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
    marginVertical: 10,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 18,
    marginRight: 10, // Add some space between label and dropdown
  },
  optionComponentContainer: {},

  optionsHeaderContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  optionsHeader: {
    color: colors.textPrimary,
    fontSize: 24,
    letterSpacing: 1.5,
  },
});
