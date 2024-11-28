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

const Todo = () => {
  const collectionRef = collection(firebaseData, "todo");
  const [todoData, setTodoData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [lastIndex, setLastIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef();

  const handleReorder = async (data) => {
    setTodoData(data);
    try {
      for (let i = 0; i < data.length; i++) {
        const todoRef = doc(firebaseData, "todo", data[i].id);
        await updateDoc(todoRef, {
          "todo.order": i,
        });
      }
    } catch (error) {
      console.error("Error updating order in Firestore: ", error);
    }
  };

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collectionRef);
      const updatedTodos = [];
      querySnapshot.forEach((doc) => {
        updatedTodos.push({ id: doc.id, ...doc.data() });
      });
      updatedTodos.sort((a, b) => a.todo.order - b.todo.order);
      setTodoData(updatedTodos);
      setLastIndex(updatedTodos[0]?.todo.order || 0);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
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
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching documents: ", error);
        setLoading(false);
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

  const handleComplete = async (id, currentStatus) => {
    const newStatus =
      currentStatus === "completed" ? "in-progress" : "completed";
    const todoRef = doc(firebaseData, "todo", id);

    try {
      await updateDoc(todoRef, {
        "todo.status": newStatus,
      });

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
        <NestableScrollContainer>
          <ToDoListSingleItem
            todoData={todoData}
            handleComplete={handleComplete}
            handleAddTodo={handleAddTodo}
            handleDeleteTodo={handleDeleteTodo}
            handleReorder={handleReorder}
            setTodoData={setTodoData}
            loading={loading}
          />
        </NestableScrollContainer>

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
              <Text style={styles.modalTitle}>Add New Todo</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter todo title"
                value={newTodoTitle}
                onChangeText={setNewTodoTitle}
                ref={modalRef}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={handleCancel}
                  style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddTodo}
                  style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Add</Text>
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
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});
