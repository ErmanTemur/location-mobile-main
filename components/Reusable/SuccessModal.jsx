import React, { useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Share, Image } from "react-native";
import Modal from "react-native-modal";
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import ReusableText from "./ReusableText";
import ReusableButton from "./ReusableButton";
import { useNavigation } from "@react-navigation/native";
import ConfettiCannon from "react-native-confetti-cannon";

const SuccessModal = ({ isVisible, onClose }) => {
  const navigation = useNavigation();
  const confettiRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      // Konfeti patlat
      confettiRef.current.start();
    }
  }, [isVisible]);

  const handleButtonPress = () => {
    onClose();
    navigation.navigate("Home");
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
        <ConfettiCannon
          ref={confettiRef}
          count={200}
          origin={{ x: -10, y: 0 }}
          fadeOut
        />
        <View style={styles.text}>
        <Image
          source={{
            uri: "https://ibb.co/YdRStZ8",
          }}
          style={styles.image}
        />
        </View>
        <View style={styles.text}>
          <ReusableText
            text="Abonelik Başarılı"
            family={"medium"}
            size={TEXT.medium}
            color={COLORS.black}
          />
          <ReusableText
            text="Premium oldunuz! Artık tüm sevdiklerinizi takip edebilirsiniz."
            family={"regular"}
            size={TEXT.xSmall}
            color={COLORS.description}
          />
        </View>
        <View style={styles.row}>
          <ReusableButton
            btnText={"Kullanbmaya Başla"}
            width={SIZES.width - 80}
            height={45}
            borderRadius={SIZES.small}
            backgroundColor={COLORS.primary}
            textColor={COLORS.black}
            textFontSize={TEXT.small}
            textFontFamily={"medium"}
            onPress={handleButtonPress}
          />
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
    alignItems:"center"
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
  image:{
    width: 200,
    height: 200,
  }
});

export default SuccessModal;
