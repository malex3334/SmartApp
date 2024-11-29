import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useCallback, useState } from "react";
import { NestableDraggableFlatList } from "react-native-draggable-flatlist";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../constans/colors";
import { launchVibrations } from "../utils/Helpers";

const ToDoListSingleItem = ({
  todoData,
  handleComplete,
  handleDeleteTodo,
  handleReorder,
  handleEditTodo,
}) => {
  const triggerBounce = (bounceAnim) => {
    Animated.sequence([
      Animated.spring(bounceAnim, {
        toValue: 0.9,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderItem = useCallback(({ item, index, drag, isActive }) => {
    const bounceAnim = React.useRef(new Animated.Value(1)).current;
    launchVibrations("confirm");
    const handleAnimation = (status) => {
      if (status !== "completed") {
        triggerBounce(bounceAnim);
      }
    };
    return (
      <Animated.View
        style={{
          transform: [{ scale: bounceAnim }],
        }}>
        <TouchableOpacity onLongPress={drag} style={styles.itemContainer}>
          <TouchableOpacity
            style={[
              styles.checkBox,
              item?.todo.status === "completed"
                ? { borderColor: "rgba(255,255,255,0.2)" }
                : { borderColor: "rgba(255,255,255,0.5)" },
            ]}
            onPress={() => {
              handleComplete(item?.id, item?.todo.status);
              handleAnimation(item?.todo.status);
            }}>
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
      </Animated.View>
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
    borderColor: "white",
    borderWidth: 1,
    // backgroundColor: "white",
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
