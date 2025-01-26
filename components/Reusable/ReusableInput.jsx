import React, { useState } from "react";
import { View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import styles from "../Reusable/reusable.style";

const ReusableInput = ({
  label,
  value,
  onChangeText,
  touched,
  error,
  secureTextEntry,
  autoCapitalize = "none",
  allowSpaces = true,
  allCaps = false, // Yeni prop
  ...props
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const renderIcon = (props) => (
    <TextInput.Icon
      {...props}
      icon={passwordVisible ? "eye-off" : "eye"}
      onPress={togglePasswordVisibility}
    />
  );

  const handleTextChange = (text) => {
    let processedText = allowSpaces ? text : text.replace(/\s/g, "");
    if (allCaps) {
      processedText = processedText.toUpperCase();
    }
    onChangeText(processedText);
  };

  return (
    <View>
      <View style={styles.inputContainer(error)}>
        <TextInput
          underlineStyle={{ display: "none" }}
          style={styles.input}
          label={label}
          value={value}
          onChangeText={handleTextChange}
          secureTextEntry={secureTextEntry && !passwordVisible}
          right={secureTextEntry ? renderIcon : null}
          autoCapitalize={autoCapitalize}
          {...props}
        />
      </View>
      <HelperText type="error" visible={touched && Boolean(error)}>
        {error}
      </HelperText>
    </View>
  );
};

export default ReusableInput;