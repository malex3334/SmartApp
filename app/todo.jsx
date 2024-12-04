import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
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
} from "firebase/firestore";
import { NestableScrollContainer } from "react-native-draggable-flatlist";
import constans from "./constans/styling";
import SectionTitle from "./components/SectionTitle";
import colors from "./constans/colors";
import LineBreak from "./components/LineBreak";
import ToDoListSingleItem from "./components/ToDoListSingleItem";
import { launchVibrations } from "./utils/Helpers";
import TodoCategory from "./components/TodoCategory";
import { useAuth } from "./context/AuthContext";

const Todo = () => {
  const collectionRef = collection(firebaseData, "todo");
  const [todoData, setTodoData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoCategory, setNewTodoCategory] = useState();
  const [editTodo, setEditTodo] = useState(false);
  const [editedValue, setEditedValue] = useState("");
  const [editedTodo, setEditedTodo] = useState();
  const [lastIndex, setLastIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [completedCount, setCompletedCount] = useState();
  const [todosCount, setTodosCount] = useState();
  const modalRef = useRef();
  const { user } = useAuth();

  const handleReorder = async (data) => {
    setLoading(true);
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

      await batch.commit();
    } catch (error) {
      console.error("Error updating order in Firestore: ", error);
    } finally {
      setLoading(false);
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

  const handleAddTodo = async () => {
    const timestampSeconds = Math.floor(Date.now() / 1000);
    setLoading(true);
    if (newTodoTitle.trim() === "") return;
    try {
      await addDoc(collectionRef, {
        todo: {
          title: newTodoTitle,
          status: "in-progress",
          order: lastIndex ? lastIndex + 1 : 0,
          category: newTodoCategory ? newTodoCategory : "",
          author: user?.name,
          timestamp: timestampSeconds,
        },
      });

      setModalVisible(false);
      setNewTodoTitle("");
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditTodo(false);
    setEditedValue("");
    setNewTodoTitle("");
    setNewTodoCategory();
  };

  const handleDeleteTodo = async (id) => {
    setLoading(true);
    const todoRef = doc(firebaseData, "todo", id);
    try {
      await deleteDoc(todoRef);
      setTodoData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTodo = (id) => {
    setModalVisible(true);
    setEditTodo(true);
    const filtered = todoData.filter((item) => item.id == id);
    setEditedTodo(filtered[0]);
    setEditedValue(filtered[0]?.todo.title);
    setNewTodoCategory(filtered[0]?.todo.category);
  };

  const handleSaveEditedTodo = async (id) => {
    setLoading(true);
    const todoRef = doc(firebaseData, "todo", id);
    try {
      await updateDoc(todoRef, {
        "todo.title": editedValue,
        "todo.category": newTodoCategory,
      });
      setTodoData((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                todo: {
                  ...item.todo,
                  title: editedValue,
                  category: newTodoCategory,
                },
              }
            : item
        )
      );

      setModalVisible(false);
      setEditedValue("");
    } catch (error) {
      console.log("Error updating todo", error);
    } finally {
      setLoading(false);
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

  useEffect(() => {
    const filterCompleted = todoData?.filter(
      (item) => item?.todo.status === "completed"
    ).length;
    setCompletedCount(filterCompleted);

    const allTodos = todoData?.length;
    setTodosCount(allTodos);
  }, [todoData]);

  return (
    <View style={constans.scrollContainer}>
      <View style={constans.container}>
        <SectionTitle
          text={`TODOS ${completedCount} / ${todosCount}${
            todosCount == completedCount ? " 🎉" : ""
          }`}
        />
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
              <Text style={{ color: "white", padding: 10 }}>Category</Text>
              <View style={styles.modalCategoryContainer}>
                <TodoCategory
                  category="red"
                  setNewTodoCategory={setNewTodoCategory}
                  newTodoCategory={newTodoCategory}
                />
                <TodoCategory
                  category="orange"
                  setNewTodoCategory={setNewTodoCategory}
                  newTodoCategory={newTodoCategory}
                />
                <TodoCategory
                  category="yellow"
                  setNewTodoCategory={setNewTodoCategory}
                  newTodoCategory={newTodoCategory}
                />
                <TodoCategory
                  category="green"
                  setNewTodoCategory={setNewTodoCategory}
                  newTodoCategory={newTodoCategory}
                />
              </View>
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

  modalCategoryContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 30,
  },
});
