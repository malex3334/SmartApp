// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { auth } from "../../FirebaseConfig";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { useNavigation } from "expo-router";
import { firebaseData } from "../../FirebaseConfig";
import { onSnapshot, doc, updateDoc } from "firebase/firestore";
// Create a Context
const AuthContext = createContext();

// Create a Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState();
  const [rerender, setRerender] = useState(false);
  const navigation = useNavigation();

  console.log(auth);
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
      const aUser = { ...user, ...userData };
      setUser(aUser);
      setUser(user);
      setRerender((prev) => !prev);
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

  useEffect(() => {
    if (user) {
      const userDoc = doc(firebaseData, "users", auth?.currentUser.uid);
      const unsubscribe = onSnapshot(
        userDoc,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setUser((prev) => ({ ...prev, ...data }));
            setUserData(data);
          } else {
            console.log("No such document!");
          }
        },
        (error) => {
          console.error("Error fetching document:", error);
        }
      );

      return () => unsubscribe();
    }
  }, [doc, rerender, handleNameChange]);

  const handleSoundToggle = async (newValue) => {
    try {
      const userDocRef = doc(firebaseData, "users", auth?.currentUser?.uid);
      await updateDoc(userDocRef, {
        "options.allowSounds": newValue,
      });
      setUser((prev) => ({
        ...prev,
        options: { ...prev.options, allowSounds: newValue },
      }));
    } catch (error) {
      console.error("Error updating allowSounds:", error);
    }
  };

  const handleNameChange = async (newValue) => {
    try {
      const userDocRef = doc(firebaseData, "users", auth?.currentUser?.uid);
      await updateDoc(userDocRef, {
        name: newValue,
      });
      setUser((prev) => ({
        ...prev,
        data: { ...prev, name: newValue },
      }));
    } catch (error) {
      console.error("Error updating allowSounds:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        signIn,
        signOut,
        handleSoundToggle,
        handleNameChange,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};
