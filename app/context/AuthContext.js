// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { auth, database } from "../../FirebaseConfig";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { useNavigation } from "expo-router";
import { firebaseData } from "../../FirebaseConfig";
import {
  getDocs,
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
// Create a Context
const AuthContext = createContext();

// Create a Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState();
  const [allowSound, setAllowSound] = useState(true);
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
      // console.log("Auth successful", user);
      // const userData = await fetchUserData(user.uid);
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

  // //
  // const fetchUserData = async (uid) => {
  //   let docData;
  //   try {
  //     const querySnapshot = await getDocs(collection(firebaseData, "users"));
  //     querySnapshot.forEach((doc) => {
  //       const databaseUSer = doc.data();
  //       if ((databaseUSer.uid = uid)) {
  //         let snapData = doc.data();
  //         docData = snapData;
  //       }
  //     });
  //   } catch (e) {
  //     console.error("Error fetching documents:", e);
  //   } finally {
  //     return docData;
  //   }
  // };

  useEffect(() => {
    if (user) {
      const userDoc = doc(
        firebaseData,
        "users",
        // "qIJhFpJ7I4OgW5e1rvHAMS04vJF2"
        auth?.currentUser.uid
      );
      // Set up the listener
      const unsubscribe = onSnapshot(
        userDoc,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setUser((prev) => ({ ...prev, ...data })); // Correctly merge previous state and new data
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
        "options.allowSounds": newValue, // Update Firestore
      });
      setUser((prev) => ({
        ...prev,
        options: { ...prev.options, allowSounds: newValue }, // Update local context
      }));
    } catch (error) {
      console.error("Error updating allowSounds:", error);
    }
  };

  const handleNameChange = async (newValue) => {
    try {
      const userDocRef = doc(firebaseData, "users", auth?.currentUser?.uid);
      await updateDoc(userDocRef, {
        name: newValue, // Update Firestore
      });
      setUser((prev) => ({
        ...prev,
        data: { ...prev, name: newValue }, // Update local context
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
