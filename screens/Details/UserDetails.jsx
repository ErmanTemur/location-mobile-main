import {
  View,
  FlatList,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  AppBar,
  HeightSpacer,
  ReusableButton,
  ReusableText,
} from "../../components";
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import homeStyles from "../screens.style";
import LogsCard from "../../components/Card/LogsCard";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, deleteTracker } from "../../redux/userActions";
import { t } from "i18next";

const UserDetails = ({ navigation }) => {
  const dispatch = useDispatch();
  const route = useRoute();
  const { item } = route.params;
  const { deviceId } = useSelector((state) => state.user);
  const [sortedLogs, setSortedLogs] = useState([]);

  useEffect(() => {
    if (deviceId) {
      dispatch(loadUser({ deviceId }));
    }
  }, [deviceId, dispatch]);

  useEffect(() => {
    const sorted = [...item.logs].sort((a, b) => new Date(b.date) - new Date(a.date));
    setSortedLogs(sorted);
  }, [item.logs]);

  const handleRemoveTracker = () => {
    Alert.alert(
      t("details.matchRemove"),
      t("details.matchRemoveDesc"),
      [
        {
          text:  t("details.matchRemoveCancel"),
          style: "cancel",
        },
        {
          text: t("details.matchRemoveButton"),
          onPress: () => {
            Alert.alert(
              t("details.matchRemoveAgain"),
              t("details.matchRemoveAgainDesc"),
              [
                {
                  text: t("details.matchRemoveCancel"),
                  style: "cancel",
                },
                {
                  text:t("details.matchRemoveButton"),
                  onPress: () => {
                    dispatch(
                      deleteTracker({ deviceId, trackerId: item.userId })
                    );
                    dispatch(loadUser({ deviceId }));
                    navigation.goBack();
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

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
      <View style={{ paddingHorizontal: 25, alignItems: "center" }}>
        <Image source={{ uri: item.picture }} style={homeStyles.imageProfile} />
        <HeightSpacer height={10} />
        <ReusableText
          text={t("details.currentLocation")}
          family={"bold"}
          size={TEXT.small}
          color={COLORS.lightBlack}
        />
        <ReusableText
          text={item.address}
          family={"regular"}
          size={TEXT.small}
          color={COLORS.lightBlack}
        />
      </View>
      <View
        style={{ paddingTop: 25, paddingBottom: 10, paddingHorizontal: 25 }}
      >
        <ReusableText
          text={t("details.actions")}
          family={"bold"}
          size={TEXT.small}
          color={COLORS.lightBlack}
        />
      </View>
      <View style={{ flex: 1, paddingHorizontal: 25, marginBottom: 75 }}>
        <FlatList
          data={sortedLogs}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <LogsCard item={item} />}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={{ gap: SIZES.small, flexGrow: 1 }}
        />
      </View>
      <View style={homeStyles.footer3}>
        <ReusableButton
          btnText={t("details.matchRemove")}
          width={SIZES.width - 40}
          height={50}
          borderRadius={SIZES.small}
          backgroundColor={COLORS.red}
          textColor={COLORS.white}
          textFontSize={TEXT.small}
          textFontFamily={"medium"}
          onPress={handleRemoveTracker}
        />
      </View>
    </SafeAreaView>
  );
};

export default UserDetails;