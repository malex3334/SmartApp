// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { auth } from "../../FirebaseConfig";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { useNavigation } from "expo-router";
// Create a Context
const AuthContext = createContext();

// Create a Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [allowSound, setAllowSound] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    //checklogin
    !user && navigation.navigate("index");
  }, [user]);

  // Function to log in
  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setUser(user);
      console.log("Auth successful", user);
    } catch (error) {
      console.log("Sign-in error:", error.message);
      setUser(null);
    }
  };

  // Function to log out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      console.log("Logged out successfully");
      console.log("Current user:", auth.currentUser);
      navigation.navigate("index");
      setUser(null);
    } catch (error) {
      console.log("Sign-out error:", error.message);
    }
  };
  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, allowSound, setAllowSound }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};
