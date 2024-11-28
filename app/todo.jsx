import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { firebaseData } from "../FirebaseConfig";
import {
  onSnapshot,
  collection,
  doc,
  writeBatch,
  updateDoc,
  addDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { NestableScrollContainer } from "react-native-draggable-flatlist";
import constans from "./constans/styling";
import SectionTitle from "./components/SectionTitle";
import colors from "./constans/colors";
import LineBreak from "./components/LineBreak";
import ToDoListSingleItem from "./components/ToDoListSingleItem";
import { launchVibrations } from "./utils/Helpers";

const Todo = () => {
  const collectionRef = collection(firebaseData, "todo");
  const [todoData, setTodoData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [editTodo, setEditTodo] = useState(false);
  const [editedValue, setEditedValue] = useState("");
  const [editedTodo, setEditedTodo] = useState();
  const [lastIndex, setLastIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef();

  const handleReorder = async (data) => {
    const reorderedData = [...data];
    setTodoData(reorderedData);

    try {
      const batch = writeBatch(firebaseData);

      for (let i = 0; i < data.length; i++) {
        const todoRef = doc(firebaseData, "todo", data[i].id);
        batch.update(todoRef, {
          "todo.order": i,
        });
      }

      // Commit the batch operation
      await batch.commit();
    } catch (error) {
      console.error("Error updating order in Firestore: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const updatedTodos = [];
        querySnapshot.forEach((doc) => {
          updatedTodos.push({ id: doc.id, ...doc.data() });
        });
        updatedTodos.sort((a, b) => a.todo.order - b.todo.order);
        setTodoData(updatedTodos);
        setLastIndex(updatedTodos[0]?.todo.order);
      },
      (error) => {
        console.error("Error fetching documents: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Handle adding new todo
  const handleAddTodo = async () => {
    if (newTodoTitle.trim() === "") return;
    try {
      await addDoc(collectionRef, {
        todo: {
          title: newTodoTitle,
          status: "in-progress",
          order: lastIndex ? lastIndex + 1 : 0,
        },
      });

      setModalVisible(false);
      setNewTodoTitle("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditTodo(false);
    setEditedValue("");
    setNewTodoTitle("");
  };

  const handleDeleteTodo = async (id) => {
    const todoRef = doc(firebaseData, "todo", id);
    try {
      await deleteDoc(todoRef);
      setTodoData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEditTodo = (id) => {
    setModalVisible(true);
    setEditTodo(true);
    const filtered = todoData.filter((item) => item.id == id);
    setEditedTodo(filtered[0]);
    setEditedValue(filtered[0]?.todo.title);
  };

  const handleSaveEditedTodo = async (id) => {
    const todoRef = doc(firebaseData, "todo", id);
    try {
      // Update the title and any other fields (if needed)
      await updateDoc(todoRef, {
        "todo.title": editedValue,
      });
      setTodoData((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, todo: { ...item.todo, title: editedValue } }
            : item
        )
      );

      setModalVisible(false);
      setEditedValue("");
    } catch (error) {
      console.log("Error updating todo", error);
    }
  };

  const handleComplete = async (id, currentStatus) => {
    const newStatus =
      currentStatus === "completed" ? "in-progress" : "completed";
    const todoRef = doc(firebaseData, "todo", id);

    try {
      await updateDoc(todoRef, {
        "todo.status": newStatus,
      });

      newStatus === "completed" && launchVibrations("success");
      setTodoData((prevData) =>
        prevData.map((item) =>
          item.id === id
            ? { ...item, todo: { ...item.todo, status: newStatus } }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating todo status: ", error);
    }
  };

  return (
    <View style={constans.scrollContainer}>
      <View style={constans.container}>
        <SectionTitle text="TODOS" />
        <LineBreak />
        {todoData?.length > 0 ? (
          <NestableScrollContainer>
            <ToDoListSingleItem
              todoData={todoData}
              handleComplete={handleComplete}
              handleAddTodo={handleAddTodo}
              handleDeleteTodo={handleDeleteTodo}
              handleReorder={handleReorder}
              setTodoData={setTodoData}
              handleEditTodo={handleEditTodo}
              loading={loading}
            />
          </NestableScrollContainer>
        ) : (
          <View
            style={{
              flex: 0.25,
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Text style={{ color: "white" }}>no todos</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => {
            setModalVisible(true);
            // focus na input
            setTimeout(() => {
              modalRef?.current.focus();
            }, 200);
          }}>
          <Text style={styles.buttonText}>Add new</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}>
        <TouchableWithoutFeedback onPress={handleCancel}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                {editTodo ? "Edit Todo" : "Add New Todo"}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter todo title"
                value={editTodo ? editedValue : newTodoTitle}
                onChangeText={editTodo ? setEditedValue : setNewTodoTitle}
                ref={modalRef}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={handleCancel}
                  style={[
                    styles.modalButton,
                    { backgroundColor: "orangered" },
                  ]}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={
                    editTodo
                      ? () => handleSaveEditedTodo(editedTodo.id)
                      : handleAddTodo
                  }
                  style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>
                    {editTodo ? "Edit" : "Add"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default Todo;

const styles = StyleSheet.create({
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: colors.background,
    padding: 20,
    borderRadius: 10,
    width: "80%",
    borderColor: "gray",
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
    color: colors.textPrimary,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
    color: colors.textPrimary,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalButton: {
    padding: 10,
    backgroundColor: "green",
    borderRadius: 5,
    minWidth: 75,
    flexDirection: "row",
    justifyContent: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});
