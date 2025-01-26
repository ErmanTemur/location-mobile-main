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
import { useTranslation } from "react-i18next";

const ToolBar = ({ onZoomIn, onZoomOut, onGoToCurrentLocation }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(t("locationSearch"));
  const [isShareModalVisible, setShareModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);

  const openShareModal = () => setShareModalVisible(true);
  const openAddModal = () => setAddModalVisible(true);
  const closeShareModal = () => setShareModalVisible(false);
  const closeAddModal = () => setAddModalVisible(false);

  const openZonePage = () => {
    navigation.navigate("Zone");
  };

  const openNotificationsPage = () => {
    navigation.navigate("NotificationsPage");
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
      <View style={styles.middleRow}>
        <View style={styles.leftColumn}>
          <TouchableOpacity
            style={styles.circle2}
            onPress={onGoToCurrentLocation}
          >
            <Feather name="navigation" size={24} color={COLORS.black} />
          </TouchableOpacity>
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
    bottom: 15,
    left: 15,
    right: 10,
    zIndex: 10,
  },
  middleRow: {
    position: "absolute",
    bottom: 75,
    right: 0,
    flexDirection: "column",
    zIndex: 10,
  },
  topMiddle: {
    position: "absolute",
    top: 150,
    alignItems: "center",
    flexDirection:"row",
    gap:10,
    zIndex: 10,
  },
  circle: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    zIndex: 10,
  },
  circle2: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  withSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  leftColumn: {
    flexDirection: "column",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding:10
  },
  rightColumn: {
    flexDirection: "column",
  },

  iconWithText: {
    alignItems: "center",
    ...SHADOWS.large,
  },
});

export default ToolBar;
