import React, { useState } from "react";
import { StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const Dropdown = ({ options, setOptions, value, setValue, saveLang }) => {
  const [open, setOpen] = useState(false);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={options}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setOptions}
      style={styles.dropdown}
      dropDownContainerStyle={styles.dropdownContainer}
      listItemLabelStyle={styles.listItemLabel}
      onChangeValue={saveLang}
    />
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  dropdown: {
    width: 100,
  },
  dropdownContainer: {
    width: 100,
  },
  listItemLabel: {
    width: 100,
  },
});
