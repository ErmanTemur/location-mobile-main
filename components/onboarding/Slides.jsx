import React from "react";
import { View, Image, StyleSheet } from "react-native";
import ReusableText from "../Reusable/ReusableText";
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import { t } from "i18next";

const Slides = ({ item }) => {
  return (
    <View style={styles.container}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.columnGap}>
          <ReusableText text={t(item.header)} family="bold" size={TEXT.xLarge} color={COLORS.black} />
          <ReusableText text={t(item.title)} family="regular" size={TEXT.small} color={COLORS.description} align="center" />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    width: SIZES.width,
  },
  image: {
    width: 300,
    height: 300,
    padding: 20,
    resizeMode: "contain",
  },
  stack: {
    alignItems: "center",
    justifyContent: "center",
  },
  columnGap: {
    gap: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
});

export default Slides;