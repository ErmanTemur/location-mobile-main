import {
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AppBar } from "../../components";
import { COLORS, SIZES } from "../../constants/theme";
import homeStyles from "../screens.style";
import NotificationCard from "../../components/Card/NotificationCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

const NotificationsPage = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const existingNotifications = await AsyncStorage.getItem("notifications");
        const notifications = existingNotifications
          ? JSON.parse(existingNotifications).reverse() 
          : [];
        setNotifications(notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

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
          title={t("notification.title")}
        />
      </View>
      <View style={{ paddingHorizontal: 25, paddingBottom: 100 ,paddingTop:15}}>
        <FlatList
          data={notifications}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <NotificationCard item={item} />}
          keyExtractor={(item, index) => `${item.request.identifier}-${index}`}
          contentContainerStyle={{ gap: SIZES.xLarge }}
        />
      </View>
    </SafeAreaView>
  );
};

export default NotificationsPage;