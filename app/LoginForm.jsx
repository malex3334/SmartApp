import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import constans from "./constans/styling";
import colors from "./constans/colors";
import SectionTitle from "./components/SectionTitle";
import LineBreak from "./components/LineBreak";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TabContainer from "./components/TabContainer";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { user, signIn, loginError } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    if (!email) {
      Alert.alert("Validation Error", "Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Validation Error", "Enter a valid email address");
      return false;
    }

    if (!password) {
      Alert.alert("Validation Error", "Password is required");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      signIn(email, password);
    }
  };

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)/Garage");
    }
  }, [user, router]);

  return (
    <TabContainer>
      <SectionTitle style={constans} text="Login" />
      <LineBreak />
      <View style={[constans.container]}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={[
              styles.showPasswordButton,
              { position: "absolute", right: 12 },
            ]}
            onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <MaterialCommunityIcons
                name="eye-off"
                size={24}
                color="lightgray"
              />
            ) : (
              <MaterialCommunityIcons name="eye" size={24} color="lightgray" />
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={constans.touchableButton}
          onPress={handleSubmit}>
          <Text style={constans.touchableButtonText}>Login</Text>
        </TouchableOpacity>
        {loginError != "" && <Text style={styles.errorText}>{loginError}</Text>}
      </View>
    </TabContainer>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 60,
    fontSize: 18,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: colors.textPrimary,
  },
  showPasswordButton: {
    marginLeft: 10,
  },
  showPasswordText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    letterSpacing: 1.5,
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});
