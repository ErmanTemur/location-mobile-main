import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import {
  Feather,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import * as Linking from 'expo-linking';
import { COLORS, SHADOWS, TEXT } from "../../constants/theme";
import ReusableText from "./ReusableText";
import LocationShareModal from "./LocationShareModal";
import LocationAddModal from "./LocationAddModal";
import { useRevenueCatContext } from "../../context/SubscriptionCtx";
import { useTranslation } from "react-i18next";

const ToolBar = ({ onZoomIn, onZoomOut, onGoToCurrentLocation }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(t("locationSearch"));
  const [isShareModalVisible, setShareModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const { entitlementInfo } = useRevenueCatContext();

  const openShareModal = () => setShareModalVisible(true);
  const openAddModal = () => {
    if (entitlementInfo && entitlementInfo.isActive) {
      setAddModalVisible(true);
    } else {
      Alert.alert(t("home.premiumInfo"), t("home.premiumInfoDesc"), [
        {
          text: t("home.premiumInfoButton"),
          onPress: () => navigation.navigate("Payment"),
        },
        { text: t("home.premiumInfoButtonCancel"), style: "cancel" },
      ]);
    }
  };
  const closeShareModal = () => setShareModalVisible(false);
  const closeAddModal = () => setAddModalVisible(false);

  const openZonePage = () => {
    if (entitlementInfo && entitlementInfo.isActive) {
      navigation.navigate("Zone");
    } else {
      Alert.alert(t("home.premiumInfo"), t("home.premiumInfoDesc"), [
        {
          text: t("home.premiumInfoButton"),
          onPress: () => navigation.navigate("Payment"),
        },
        { text: t("home.premiumInfoButtonCancel"), style: "cancel" },
      ]);
    }
  };

  const openNotificationsPage = () => {
    if (entitlementInfo && entitlementInfo.isActive) {
      navigation.navigate("NotificationsPage");
    } else {
      Alert.alert(t("home.premiumInfo"), t("home.premiumInfoDesc"), [
        {
          text: t("home.premiumInfoButton"),
          onPress: () => navigation.navigate("Payment"),
        },
        { text: t("home.premiumInfoButtonCancel"), style: "cancel" },
      ]);
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setTimeout(() => {
          Alert.alert(
            t("locationPermission.title"),
            t("locationPermission.message"),
            [
              {
                text: t("locationPermission.button"),
                onPress: () => Linking.openURL('app-settings:'),
              },
            ]
          );
        }, 10000);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      if (reverseGeocode.length > 0) {
        const { street, subregion } = reverseGeocode[0];
        setAddress(
          street && subregion ? `${street}, ${subregion}` : "Adres bulunamadı"
        );
      } else {
        setAddress("Adres bulunamadı");
      }
    };

    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={[styles.circle, styles.touchableArea]}
          onPress={openNotificationsPage}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="message-badge-outline"
            size={24}
            color={COLORS.lightBlack}
          />
        </TouchableOpacity>
        <View style={styles.rightColumn}>
          <TouchableOpacity
            style={[styles.circle, styles.touchableArea]}
            onPress={() => navigation.navigate("Settings")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={COLORS.lightBlack}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.circle, styles.touchableArea]}
            onPress={openZonePage}
          >
            <MaterialIcons
              name="add-home-work"
              size={24}
              color={COLORS.lightBlack}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.topMiddle}>
        <View style={styles.Adress}>
          <ReusableText
            text={address}
            family={"medium"}
            size={TEXT.xSmall}
            color={COLORS.black}
            maxLength={25}
          />
        </View>
      </View>
      <View style={styles.middleRow}>
        <View style={styles.leftColumn}>
          <TouchableOpacity style={styles.circle} onPress={onZoomIn}>
            <MaterialIcons name="add" size={24} color={COLORS.lightBlack} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.circle} onPress={onZoomOut}>
            <MaterialIcons
              name="horizontal-rule"
              size={24}
              color={COLORS.lightBlack}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.circle}
            onPress={onGoToCurrentLocation}
          >
            <Feather name="navigation" size={24} color={COLORS.lightBlack} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.absoluteRight}>
        <View style={styles.iconWithText}>
          <TouchableOpacity style={styles.circle2} onPress={openShareModal}>
            <Ionicons
              name="share-social-sharp"
              size={24}
              color={COLORS.lightBlack}
            />
          </TouchableOpacity>
          <ReusableText
            text={t("home.code")}
            family={"medium"}
            size={TEXT.small}
            color={COLORS.lightBlack}
            underline={true}
          />
        </View>
        <View style={styles.iconWithText}>
          <TouchableOpacity style={styles.circle2} onPress={openAddModal}>
            <Ionicons name="person-add" size={24} color={COLORS.lightBlack} />
          </TouchableOpacity>
          <ReusableText
            text={t("home.add")}
            family={"medium"}
            size={TEXT.small}
            color={COLORS.lightBlack}
            underline={true}
          />
        </View>
      </View>
      <LocationShareModal
        isVisible={isShareModalVisible}
        onClose={closeShareModal}
      />
      <LocationAddModal isVisible={isAddModalVisible} onClose={closeAddModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    left: 15,
    right: 15,
    zIndex: 10,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    zIndex: 20,
  },
  middleRow: {
    position: "absolute",
    top: 225,
    flexDirection: "column",
    zIndex: 10,
  },
  topMiddle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  Adress: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 15,
    ...SHADOWS.large,
    zIndex: 10,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.lightWhite,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    ...SHADOWS.large,
    zIndex: 10,
  },
  circle2: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    ...SHADOWS.large,
    zIndex: 10,
  },
  leftColumn: {
    flexDirection: "column",
  },
  rightColumn: {
    flexDirection: "column",
  },
  absoluteRight: {
    position: "absolute",
    top: 230,
    right: 0,
    flexDirection: "column",
    zIndex: 10,
    gap: 10,
  },
  iconWithText: {
    alignItems: "center",
    ...SHADOWS.large,
  },
});

export default ToolBar;
