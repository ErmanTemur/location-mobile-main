import React from "react";
import { View, StyleSheet, TouchableOpacity, Share } from "react-native";
import Modal from "react-native-modal";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-root-toast";
import { COLORS, TEXT } from "../../constants/theme";
import ReusableText from "./ReusableText";
import { useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";

const LocationShareModal = ({ isVisible, onClose }) => {
  const code = useSelector((state) => state.user.code);
  const { t } = useTranslation();

  const handleLongPress = async () => {
    try {
      await Clipboard.setStringAsync(code);
      Toast.show(t("modal.locationShareToastSucces"), {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    } catch (error) {
      Toast.show(t("modal.locationShareToastError"), {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${code}`,
      });
    } catch (error) {
      Toast.show(t("modal.locationShareToastError"), {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      coverScreen={true}
      backdropColor="black"
      backdropOpacity={0.7}
      style={styles.modal}
    >
      <View style={styles.modalView}>
        <View style={styles.text}>
          <ReusableText
            text={t("modal.locationShareText")}
            family={"medium"}
            size={TEXT.medium}
            color={COLORS.black}
          />
          <ReusableText
            text={t("modal.locationShareDesc")}
            family={"regular"}
            size={TEXT.xSmall}
            color={COLORS.description}
          />
        </View>
        <View style={styles.row}>
          <TouchableOpacity onLongPress={handleLongPress} style={styles.code}>
            <ReusableText
              text={code}
              family={"bold"}
              size={TEXT.large}
              color={COLORS.lightBlack}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Ionicons name="share-social" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    width: "90%",
  },
  text: {
    marginBottom: 20,
    width: "100%",
  },
  code: {
    alignItems: "center",
    borderColor: COLORS.lightGrey,
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    borderStyle: "dashed",
    width: "80%",
  },
  shareButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    alignItems: "center",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default LocationShareModal;