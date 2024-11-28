import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useCallback } from "react";
import { NestableDraggableFlatList } from "react-native-draggable-flatlist";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../constans/colors";
import { useSharedValue } from "react-native-reanimated";
import { launchVibrations } from "../utils/Helpers";

const ToDoListSingleItem = ({
  todoData,
  handleComplete,
  handleDeleteTodo,
  handleReorder,
  handleEditTodo,
}) => {
  const renderItem = useCallback(({ item, drag, isActive }, loading) => {
    launchVibrations("confirm");
    return (
      <TouchableOpacity
        onLongPress={drag}
        style={[
          styles.itemContainer,
          // isActive && { transform: "scale(1.05)" },
        ]}>
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
        {!loading && (
          <Text
            style={[
              styles.itemText,
              item?.todo.status === "completed" && styles.completed,
            ]}>
            {item?.todo.title}
          </Text>
        )}
        <View style={styles.iconsContainer}>
          <MaterialIcons
            name="edit"
            size={24}
            color="gray"
            style={[
              styles.icon,
              item?.todo.status === "completed" && { opacity: 0.7 },
            ]}
            onPress={() => handleEditTodo(item.id)}
          />
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
        </View>
      </TouchableOpacity>
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
        }}
      />
    </View>
  );
};

export default ToDoListSingleItem;

const styles = StyleSheet.create({
  itemContainer: {
    padding: 8,
    marginVertical: 3,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.1)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontSize: 18,
    fontWeight: 200,
    color: colors.textPrimary,
    letterSpacing: 1.5,
    position: "relative",
    marginLeft: 40,
  },
  checkBox: {
    position: "absolute",
    top: "35%",
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
    marginRight: 5,
  },
  dragHandle: {
    paddingLeft: 10,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
