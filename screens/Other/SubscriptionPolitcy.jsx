import { View, ScrollView, SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import { AppBar, ReusableText } from "../../components";
import { COLORS, TEXT } from "../../constants/theme";
import { SubscriptionPolitcy } from "../Data/SubscriptionPolitcy";
import homeStyles from "../screens.style";
import { t } from "i18next";

const SubscriptionPolitcyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={homeStyles.container}>
      {/* Header */}
      <View style={homeStyles.header}>
        <AppBar
          top={20}
          left={20}
          right={20}
          color={COLORS.lightBack}
          onPress={() => navigation.goBack()}
          title={t("settings.subscriptionPoliticy")}
        />
      </View>
      {/* Scrollable Content */}
      <ScrollView style={styles.textContainer}>
        <ReusableText
          text={SubscriptionPolitcy} 
          family={"medium"}
          size={TEXT.xSmall}
          color={COLORS.black}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    paddingHorizontal: 20,
  },
});

export default SubscriptionPolitcyScreen;
