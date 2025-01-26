import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import ReusableButton from "./ReusableButton";
import ReusableText from "./ReusableText";
import ReusableInput from "./ReusableInput";
import NoticeMessage from "./NoticeMessage";
import HeightSpacer from "./HeightSpacer";
import { addZone } from "../../redux/userActions";
import Slider from "@react-native-community/slider"; 
import { useTranslation } from "react-i18next";

const ZoneModal = ({ isVisible, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);
  const [location, setLocation] = useState(null);
  const [zone, setZone] = useState(null);
  const [region, setRegion] = useState(null);
  const { t } = useTranslation();

  const deviceId = useSelector((state) => state.user.deviceId);

  const formik = useFormik({
    initialValues: { title: "", zoneRadius: 150 },
    onSubmit: async (values) => {
      const actionResult = await dispatch(
        addZone({
          deviceId,
          title: values.title,
          latitude: zone.latitude,
          longitude: zone.longitude,
          zoneRadius: values.zoneRadius,
        })
      );
      if (addZone.fulfilled.match(actionResult)) {
        setStatus("success");
        setMessage("Konum başarıyla eklendi.");
        onSuccess(); 
        setTimeout(() => {
          onClose();
        }, 1500);
      } else if (addZone.rejected.match(actionResult)) {
        const errorMessage = actionResult.payload;
        setStatus("error");
        setMessage(errorMessage);
        setTimeout(() => setStatus(null), 2000);
      }
    },
  });

  useEffect(() => {
    if (!isVisible) {
      setStatus(null);
      formik.resetForm();
      setZone(null);
    }
  }, [isVisible]);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setMessage("Konum izni verilmedi");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    };

    getLocation();
  }, []);

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setZone({ latitude, longitude });
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      backdropOpacity={0.7}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={500}
      animationOutTiming={500}
      swipeDirection={['down']}
      onSwipeComplete={onClose}
      swipeThreshold={50}
      propagateSwipe={true}
    >
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalView}>
            <View style={styles.indicator} />
            <View style={styles.text}>
              <ReusableText
                text={t("modal.zoneAdd")}
                family={"medium"}
                size={TEXT.medium}
                color={COLORS.black}
              />
              <ReusableText
                text={t("modal.zoneModalDesc")}
                family={"regular"}
                size={TEXT.xSmall}
                color={COLORS.description}
              />
            </View>
            <View style={styles.inputContainer}>
              <ReusableText
                text={t("modal.zoneModalName")}
                family={"medium"}
                size={TEXT.small}
                color={COLORS.black}
              />
              <ReusableInput
                label={t("modal.zoneModalName")}
                theme={{ colors: { primary: "black" } }}
                value={formik.values.title}
                onChangeText={formik.handleChange("title")}
                touched={formik.touched.title}
                error={formik.errors.title}
              />
            </View>
            <View style={styles.inputContainer}>
              <ReusableText
                text={t("modal.zoneModalZone")}
                family={"medium"}
                size={TEXT.small}
                color={COLORS.black}
              />
              {region ? (
                <MapView
                  style={styles.map}
                  region={region}
                  onPress={handleMapPress}
                >
                  {zone && (
                    <>
                      <Marker coordinate={zone} title="Seçilen Konum" />
                      <Circle
                        center={zone}
                        radius={formik.values.zoneRadius}
                        strokeColor="rgba(165, 53, 240, 0.5)"
                        fillColor="rgba(165, 53, 240, 0.3)"
                      />
                    </>
                  )}
                </MapView>
              ) : (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={COLORS.black} />
                  <ReusableText
                    text={t("modal.locationLoading")}
                    family={"regular"}
                    size={TEXT.small}
                    color={COLORS.description}
                  />
                </View>
              )}
            </View>
            {zone && (
              <View style={styles.sliderContainer}>
                <ReusableText
                  text={`${t("modal.zoneDia")} ${formik.values.zoneRadius} ${t("modal.metre")}`}
                  family={"medium"}
                  size={TEXT.small}
                  color={COLORS.black}
                />
                <Slider
                  style={styles.slider}
                  minimumValue={20}
                  maximumValue={500}
                  step={10}
                  value={formik.values.zoneRadius}
                  onValueChange={(value) => formik.setFieldValue("zoneRadius", value)}
                  minimumTrackTintColor={COLORS.primary}
                  maximumTrackTintColor={COLORS.gray}
                />
              </View>
            )}
            <HeightSpacer height={40} />
            <ReusableButton
              btnText={t("modal.zoneModalButton")}
              width={SIZES.width - 40}
              height={45}
              borderRadius={SIZES.small}
              borderWidth={1}
              backgroundColor={COLORS.primary}
              textColor={COLORS.white}
              textFontSize={TEXT.small}
              textFontFamily={"medium"}
              onPress={formik.handleSubmit}
            />
            {Platform.OS === "ios" && <HeightSpacer height={25} />}
          </View>
        </View>
      </KeyboardAvoidingView>
      {status && <NoticeMessage status={status} message={message} />}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '90%',
  },
  modalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
    width: "100%",
  },
  text: {
    marginBottom: 20,
    width: "100%",
  },
  inputContainer: {
    width: "100%",
  },
  map: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginTop: 10,
  },
  sliderContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    height: 5,
    backgroundColor: COLORS.gray,
    borderRadius: 5,
    width: "30%",
    marginBottom: 10,
  },
});

export default ZoneModal;
