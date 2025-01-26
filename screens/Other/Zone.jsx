import {
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { AppBar, ReusableText } from "../../components";
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import homeStyles from "../screens.style";
import ZoneCard from "../../components/Card/ZoneCard";
import { MaterialIcons } from "@expo/vector-icons";
import ZoneModal from "../../components/Reusable/ZoneModal";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, deleteZone } from "../../redux/userActions";
import { useTranslation } from "react-i18next";

const Zone = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isZoneModalVisible, setZoneModalVisible] = useState(false);
  const { deviceId } = useSelector((state) => state.user);
  const zones = useSelector((state) => state.user.zones);
  const [isZoneSelected, setIsZoneSelected] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const { t } = useTranslation();

  const reloadUser = useCallback(() => {
    if (deviceId) {
      dispatch(loadUser({ deviceId }));
    }
  }, [deviceId, dispatch]);

  useEffect(() => {
    reloadUser();
  }, [reloadUser]);

  const toggleZoneModal = () => {
    setZoneModalVisible(!isZoneModalVisible);
  };

  const handleDeleteZone = () => {
    if (selectedZoneId) {
      dispatch(deleteZone({ zoneId: selectedZoneId, deviceId }));
      setIsZoneSelected(false);
      setSelectedZoneId(null);
    }
  };

  const handleLongPress = (id) => {
    setIsZoneSelected(true);
    setSelectedZoneId(id);
  };

  const handleCloseDeleteIcon = () => {
    setIsZoneSelected(false);
    setSelectedZoneId(null);
  };

  return (
    <SafeAreaView
      style={[
        homeStyles.container,
        { paddingTop: Platform.OS === "ios" ? 20 : StatusBar.currentHeight },
      ]}
    >
      <View
        style={[
          homeStyles.header,
          { backgroundColor: isZoneSelected ? COLORS.red : "transparent" },
        ]}
      >
        <AppBar
          top={20}
          left={20}
          right={20}
          color={COLORS.lightBack}
          onPress={() => navigation.goBack()}
          title={t("modal.zoneAdd")}
          onDeletePress={handleDeleteZone}
          showDeleteIcon={isZoneSelected}
          onCloseDeleteIcon={handleCloseDeleteIcon}
        />
      </View>
      <View
        style={[
          homeStyles.flexSpace,
          { paddingHorizontal: 25, paddingVertical: 10, paddingBottom: 25 },
        ]}
      >
        <ReusableText
          text={t("modal.zoneMy")}
          family={"bold"}
          size={TEXT.small}
          color={COLORS.lightBlack}
        />
        <TouchableOpacity style={homeStyles.box} onPress={toggleZoneModal}>
          <View style={homeStyles.boxIcon2}>
            <MaterialIcons name="add" size={20} color="black" />
          </View>
          <View style={{ paddingHorizontal: 10 }}>
            <ReusableText
              text={t("modal.zoneAdd")}
              family={"medium"}
              size={TEXT.xSmall}
              color={COLORS.black}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ paddingHorizontal: 25 }}>
        <FlatList
          data={zones}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ZoneCard
              item={item}
              onLongPress={() => handleLongPress(item._id)}
              selected={selectedZoneId === item._id}
            />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ gap: SIZES.small }}
        />
      </View>
      <View style={homeStyles.footer3}>
        <ReusableText
          text={t("modal.zoneDelete")}
          family={"regular"}
          size={TEXT.xSmall}
          color={COLORS.black}
          align={"center"}
        />
      </View>
      <ZoneModal
        isVisible={isZoneModalVisible}
        onClose={toggleZoneModal}
        onSuccess={reloadUser}
      />
    </SafeAreaView>
  );
};

export default Zone;
