import 'intl-pluralrules'; 

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import trTranslation from "./tr/translation.json";
import azTranslation from "./az/translation.json";
import enTranslation from "./en/translation.json";
import frTranslation from "./fr/translation.json";
import deTranslation from "./de/translation.json";
import ruTranslation from "./ru/translation.json";

const getSavedLanguage = async (): Promise<string> => {
  try {
    const savedLanguage = await AsyncStorage.getItem("language");
    return savedLanguage || Localization.locale.split('-')[0];
  } catch (error) {
    return Localization.locale.split('-')[0];
  }
};

getSavedLanguage().then((lng: string) => {
  i18n.use(initReactI18next).init({
    resources: {
      tr: { translation: trTranslation },
      az: { translation: azTranslation },
      en: { translation: enTranslation },
      fr: { translation: frTranslation },
      de: { translation: deTranslation },
      ru: { translation: ruTranslation },
    },
    lng,
    fallbackLng: "tr", 
    interpolation: {
      escapeValue: false,
    },
  });
});

export default i18n;