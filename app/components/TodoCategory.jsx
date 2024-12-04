import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

const TodoCategory = ({ category, setNewTodoCategory, newTodoCategory }) => {
  return (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        { backgroundColor: category },
        category === newTodoCategory && {
          borderColor: "white",
          borderWidth: 2,
        },
      ]}
      onPress={() => {
        setNewTodoCategory(category);
      }}
    />
  );
};

export default TodoCategory;

const styles = StyleSheet.create({
  categoryButton: {
    width: 30,
    height: 30,
  },
});
