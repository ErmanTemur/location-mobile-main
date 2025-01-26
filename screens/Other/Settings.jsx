import {
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AppBar, HeightSpacer, ReusableText } from "../../components";
import { COLORS, TEXT } from "../../constants/theme";
import homeStyles from "../screens.style";
import { MaterialIcons } from "@expo/vector-icons";
import { Switch } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, toggleVisibility } from "../../redux/userActions";
import * as Location from "expo-location";
import * as BackgroundFetch from "expo-background-fetch";
import * as SecureStore from 'expo-secure-store';
import { useTranslation } from "react-i18next";
import { ReusableLanguageSettings, ReusableSettings } from "../../components/Reusable/ReusableSettings";

const LOCATION_TASK_NAME = "background-location-task";
const BACKGROUND_FETCH_TASK = "background-fetch-task";

const Settings = ({ navigation, expoPushToken }) => {
  const dispatch = useDispatch();
  const deviceId = useSelector((state) => state.user.deviceId);
  const user = useSelector((state) => state.user.user); 
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const { t } = useTranslation();

  const manageLocationUpdates = async (visibility) => {
    if (visibility) {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        distanceInterval: 5,
        deferredUpdatesInterval: 1000,
        showsBackgroundLocationIndicator: true,
        stopOnTerminate: false,
        startOnBoot: true,
      });
  
      const fetchStatus = await BackgroundFetch.getStatusAsync();
      if (
        fetchStatus === BackgroundFetch.BackgroundFetchStatus.Restricted ||
        fetchStatus === BackgroundFetch.BackgroundFetchStatus.Denied
      ) {
        return;
      }
  
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 5 * 60,
        stopOnTerminate: false,
        startOnBoot: true,
      });
    } else {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    }
  };

  const onToggleSwitch = async () => {
    const newVisibility = !isSwitchOn;
    setIsSwitchOn(newVisibility);
    try {
      await dispatch(toggleVisibility({ deviceId, visibility: newVisibility }));
      await manageLocationUpdates(newVisibility);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccountRecovery = async (inputId) => {
    if (inputId) {
      try {
        await SecureStore.setItemAsync('uniqueId', inputId);
        dispatch(registerUser({ deviceId: inputId, pushToken: expoPushToken }));
        Alert.alert(t("settings.success"), t("settings.successDesc"));
      } catch (error) {
        console.error("Error during account recovery:", error);
        Alert.alert(t("settings.error"), t("settings.errorDesc"));
      }
    } else {
      Alert.alert(t("settings.error"), t("settings.errorId"));
    }
  };

  useEffect(() => {
    if (user && user.visibility !== undefined) {
      setIsSwitchOn(user.visibility);
      manageLocationUpdates(user.visibility);
    }
  }, [user]);


  return (
    <SafeAreaView
      style={[
        homeStyles.container,
        { paddingTop: Platform.OS === "ios" ? 20 : StatusBar.currentHeight },
      ]}
    >
      <View style={homeStyles.header}>
        <AppBar
          top={20}
          left={20}
          right={20}
          color={COLORS.lightBack}
          onPress={() => navigation.goBack()}
        />
      </View>
      <View style={{ paddingHorizontal: 25 }}>
        <ReusableText
          text={t("settings.title")}
          family={"bold"}
          size={TEXT.xLarge}
          color={COLORS.lightBlack}
        />
        <HeightSpacer height={20} />
        <View style={{ paddingBottom: 5 }}>
          <ReusableText
            text={t("settings.general")}
            family={"regular"}
            size={TEXT.small}
            color={COLORS.description}
          />
        </View>
        <View style={styles.settingsBox}>
          <TouchableOpacity style={styles.box}>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <MaterialIcons name="visibility" size={24} color="black" />
              <ReusableText
                text={t("settings.follow")}
                family={"regular"}
                size={TEXT.medium}
                color={COLORS.black}
              />
            </View>
            <View style={styles.switchContainer}>
              <Switch
                value={isSwitchOn}
                onValueChange={onToggleSwitch}
                color={COLORS.primary}
              />
            </View>
          </TouchableOpacity>
        </View>
        <HeightSpacer height={20} />
        <View style={{ paddingBottom: 5 }}>
          <ReusableText
            text={t("settings.politicy")}
            family={"regular"}
            size={TEXT.small}
            color={COLORS.description}
          />
        </View>
        <View style={styles.settingsBox}>
          <ReusableSettings
            icon={"document-lock-outline"}
            title={t("settings.privacyPolicy")}
            onPress={() => navigation.navigate("PrivacyPoliticy")}
          />
          <View
            style={{ borderTopWidth: 1, borderColor: COLORS.lightBorder }}
          />
          <ReusableSettings
            icon={"receipt-outline"}
            title={t("settings.termsOfUse")}
            onPress={() => navigation.navigate("TermsPoliticy")}
          />
          <View
            style={{ borderTopWidth: 1, borderColor: COLORS.lightBorder }}
          />
          <ReusableSettings
            icon={"cash-outline"}
            title={t("settings.refundPolicy")}
            onPress={() => navigation.navigate("RefundPolitcy")}
          />
          <View
            style={{ borderTopWidth: 1, borderColor: COLORS.lightBorder }}
          />
          <ReusableSettings
            icon={"card-outline"}
            title={t("settings.subscriptionPoliticy")}
            onPress={() => navigation.navigate("SubscriptionPolitcy")}
          />
        </View>
        <HeightSpacer height={15} />
        <View style={{ paddingBottom: 5 }}>
          <ReusableText
            text={t("settings.account")}
            family={"regular"}
            size={TEXT.small}
            color={COLORS.description}
          />
        </View>
        <View style={styles.settingsBox}>
          <ReusableLanguageSettings
            icon={"language"}
            title={t("settings.language")}
            onPress={() => navigation.navigate("Language")}
          />
        </View>
        <HeightSpacer height={15} />
        <View style={{ paddingBottom: 5 }}>
          <ReusableText
            text={t("settings.account")}
            family={"regular"}
            size={TEXT.small}
            color={COLORS.description}
          />
        </View>
        <View style={styles.settingsBox}>
          <ReusableSettings
            icon={"refresh"}
            title={t("settings.accountRestore")}
            onPress={() => Alert.prompt(
              t("settings.accountRestore"),
              t("settings.restoreDesc"),
              [
                {
                  text: t("settings.restoreCancel"),
                  style: "cancel"
                },
                {
                  text: t("settings.restoreButton"),
                  onPress: (inputId) => handleAccountRecovery(inputId)
                }
              ],
              "plain-text"
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const SettingsScreen = ({ navigation, expoPushToken }) => (
  <Settings navigation={navigation} expoPushToken={expoPushToken} />
);

export default SettingsScreen;

const styles = StyleSheet.create({
  settingsBox: {
    backgroundColor: COLORS.lightInput,
    borderRadius: 10,
  },
  box: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  switchContainer: {
    transform: [{ scaleX: 1 }, { scaleY: 1 }],
  },
});