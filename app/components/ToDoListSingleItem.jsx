import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useRef } from "react";
import { NestableDraggableFlatList } from "react-native-draggable-flatlist";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../constans/colors";

const ToDoListSingleItem = ({
  todoData,
  handleComplete,
  handleDeleteTodo,
  handleReorder,
  setTodoData,
  loading,
}) => {
  const renderItem = useCallback(({ item, drag, isActive }) => {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={[
            styles.checkBox,
            item?.todo.status === "completed"
              ? { backgroundColor: "rgba(255,255,255,0.2)" }
              : { backgroundColor: "white" },
          ]}
          onPress={() => handleComplete(item?.id, item?.todo.status)}>
          {item?.todo.status === "completed" && (
            <Text style={{ color: "white", fontSize: 16 }}>✔</Text>
          )}
        </TouchableOpacity>
        <Text
          style={[
            styles.itemText,
            item?.todo.status === "completed" && styles.completed,
          ]}>
          {item?.todo.title}
        </Text>
        <View style={styles.iconsContainer}>
          <MaterialIcons
            name="delete"
            size={24}
            color="red"
            style={[
              styles.icon,
              item?.todo.status === "completed" && { opacity: 0.7 },
            ]}
            onPress={() => handleDeleteTodo(item.id)}
          />
          <TouchableOpacity
            style={styles.dragHandle}
            onLongPress={drag} // Trigger drag on long press
          >
            <MaterialIcons name="drag-indicator" size={30} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }, []);

  return (
    <View>
      <NestableDraggableFlatList
        data={todoData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => {
          handleReorder(data);

          // setTodoData(data);
        }}
      />
    </View>
  );
};

export default ToDoListSingleItem;

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    marginVertical: 2,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.1)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
    color: colors.textPrimary,
    letterSpacing: 1.5,
    position: "relative",
    marginLeft: 40,
  },
  checkBox: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 5,
    backgroundColor: "white",
  },
  completed: {
    color: "gray",
  },
  icon: {
    marginRight: 15,
  },
  dragHandle: {
    paddingLeft: 10,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
