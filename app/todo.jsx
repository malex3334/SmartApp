import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { firebaseData } from "../FirebaseConfig";
import React from "react";
import { onSnapshot, collection, doc, updateDoc } from "firebase/firestore";
import constans from "./constans/styling";
import SectionTitle from "./components/SectionTitle";
import colors from "./constans/colors";
import LineBreak from "./components/LineBreak";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const Todo = () => {
  const collectionRef = collection(firebaseData, "todo");
  const [todoData, setTodoData] = useState([]);

  // Fetch todo data from Firestore on initial load
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const updatedTodos = [];
        querySnapshot.forEach((doc) => {
          updatedTodos.push({ id: doc.id, ...doc.data() });
        });
        setTodoData(updatedTodos); // Set updated data in state
      },
      (error) => {
        console.error("Error fetching documents: ", error);
      }
    );

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  // Handle click to update todo status
  const handleOnclick = async (id, currentStatus) => {
    const updatedStatus =
      currentStatus === "completed" ? "in-progress" : "completed"; // Toggle status

    const todoRef = doc(firebaseData, "todo", id); // Reference to the specific todo document

    try {
      await updateDoc(todoRef, {
        "todo.status": updatedStatus, // Update the status field
      });

      // Update local state after Firestore update
      setTodoData((prevData) =>
        prevData.map((item) =>
          item.id === id
            ? { ...item, todo: { ...item.todo, status: updatedStatus } }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  if (todoData.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No todos found!</Text>
      </View>
    );
  }

  return (
    <View style={constans.scrollContainer}>
      <View style={constans.container}>
        <SectionTitle text="TODOS" />
        <LineBreak />
        <FlatList
          style={styles.flatListContainer}
          data={todoData}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              {item?.todo.status === "completed" && (
                <View style={styles.lineThrough}></View>
              )}
              <Text
                onPress={() => handleOnclick(item?.id, item?.todo.status)}
                style={[
                  styles.itemText,
                  item?.todo.status === "completed" && styles.completed,
                ]}>
                {item?.todo.title}
              </Text>
              <MaterialIcons
                name="delete"
                size={24}
                color="red"
                style={styles.icon}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
        <TouchableOpacity style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Add new</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Todo;

const styles = StyleSheet.create({
  flatListContainer: {
    marginTop: 20,
  },

  itemContainer: {
    padding: 15,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 20,
    color: colors.textPrimary,
    letterSpacing: 1.5,
    position: "relative",
  },

  completed: {
    color: "gray",
  },

  lineThrough: {
    position: "absolute",
    top: "140%",
    left: 0,
    width: "100%",
    height: 2,
    backgroundColor: "red",
    zIndex: 1,
    opacity: 0.5,
  },
  icon: {
    marginRight: 15,
  },

  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    marginBottom: 30,
    backgroundColor: "green",
  },

  buttonText: {
    color: colors.textPrimary,
    fontSize: 20,
  },
});
