import { StyleSheet, Text, View } from "react-native";
import React from "react";

const truncateText = (text, maxLength) => {
  if (maxLength && text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

const ReusableText = ({ text, family, size, color, align, underline, maxLength, textDecorationLine }) => {
  const truncatedText = truncateText(text, maxLength);

  return (
    <Text style={styles.textStyle(family, size, color, align, underline, textDecorationLine)}>
      {truncatedText}
    </Text>
  );
};

export default ReusableText;

const styles = StyleSheet.create({
  textStyle: (family, size, color, align, underline, textDecorationLine) => ({
    fontFamily: family,
    fontSize: size,
    color: color,
    textAlign: align,
    textDecorationLine: textDecorationLine || (underline ? "underline" : "none"),
  }),
});