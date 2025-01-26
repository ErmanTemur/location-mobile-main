import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React from 'react';
import {
  Feather,
  Ionicons,
  AntDesign,
} from "@expo/vector-icons";
import { COLORS, TEXT } from '../../constants/theme';
import ReusableText from './ReusableText';
import { useTranslation } from 'react-i18next';
import AsyncStorage from "@react-native-async-storage/async-storage";

const ReusableSettings = ({ icon, title, onPress, iconColor = COLORS.black, textColor = COLORS.black, iconType = "Ionicons" }) => {
  const IconComponent = iconType === "AntDesign" ? AntDesign : Ionicons;

  return (
    <TouchableOpacity onPress={onPress} style={styles.box}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <IconComponent name={icon} size={22} color={iconColor} />
        <ReusableText
          text={title}
          family={"regular"}
          size={TEXT.medium}
          color={textColor}
        />
      </View>
      <Feather name="chevron-right" size={20} color={iconColor} />
    </TouchableOpacity>
  );
};

const ReusableLanguageSettings = ({ icon, title, onPress, iconColor = COLORS.black, textColor = COLORS.black, iconType = "Ionicons" }) => {
  const { i18n } = useTranslation();
  const IconComponent = iconType === "AntDesign" ? AntDesign : Ionicons;

  const languages = [
    { code: 'tr', flag: require('../../assets/tr.png') },
    { code: 'az', flag: require('../../assets/az.png') },
    { code: 'en', flag: require('../../assets/en.png') },
    { code: 'ru', flag: require('../../assets/ru.png') },
    { code: 'de', flag: require('../../assets/de.png') },
    { code: 'fr', flag: require('../../assets/fr.png') },
  ];

  const changeLanguage = async () => {
    const currentIndex = languages.findIndex(lang => lang.code === i18n.language);
    const nextIndex = (currentIndex + 1) % languages.length;
    const nextLanguage = languages[nextIndex].code;
    await AsyncStorage.setItem("language", nextLanguage);
    i18n.changeLanguage(nextLanguage);
  };

  return (
    <TouchableOpacity onPress={changeLanguage} style={styles.box}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <IconComponent name={icon} size={22} color={iconColor} />
        <ReusableText
          text={title}
          family={"regular"}
          size={TEXT.medium}
          color={textColor}
        />
      </View>
      <View style={{ flexDirection: "row", gap: 12,}}>
        {languages.map((lang) => (
          <Image
            key={lang.code}
            source={lang.flag}
            style={[
              { width: 20, height: 15 },
              i18n.language === lang.code && { borderWidth: 1, borderColor: COLORS.black }
            ]}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
});

export { ReusableSettings, ReusableLanguageSettings };