import React, { useEffect, useState, useRef } from "react";
import { useFonts } from "expo-font";
//nagivation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//screens
import {
  Onboarding,
  Home,
  UserDetails,
  Settings,
  Payment,
  PrivacyPoliticy,
  RefundPolitcy,
  SubscriptionPolitcy,
  TermsPoliticy,
  NotificationsPage,
  Zone,
} from "./screens/index.js";
import BottomTabNavigation from "./navigation/BottomTabNavigation.jsx";
import { useDispatch } from "react-redux";
import { registerUser } from "./redux/userActions.js";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import SettingsScreen from "./screens/Other/Settings.jsx";
import { checkPermissionsAndNavigate } from './screens/Other/PermissionsPage';
import PermissionsPage from "./screens/Other/PermissionsPage.jsx";
import { registerForPushNotificationsAsync } from './utils/PushNotification';

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, 
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function requestTrackingPermission() {
  return;
}

const generateUuid = () => {
  return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, (char) => {
    const rand = (Math.random() * 16) | 0;
    const value = char === 'x' ? rand : (rand & 0x3) | 0x8;
    return value.toString(16);
  });
};

export default function Main() {
  const dispatch = useDispatch();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [uniqueId, setUniqueId] = useState(null);
  const navigationRef = useRef();

  const getOrCreateUniqueId = async () => {
    try {
      let uuidId = await SecureStore.getItemAsync('uniqueId');
      if (!uuidId) {
        uuidId = generateUuid();
        await SecureStore.setItemAsync('uniqueId', uuidId);
      }
      setUniqueId(uuidId);
    } catch (error) {
      console.error('Error fetching or creating unique ID:', error);
    }
  };

  useEffect(() => {
    const checkPermissions = async () => {
      await getOrCreateUniqueId();
      checkPermissionsAndNavigate(navigationRef.current);
    };
    checkPermissions();
  }, []);

  //Async Function
  const saveNotification = async (notification) => {
    try {
      const existingNotifications = await AsyncStorage.getItem("notifications");
      const notifications = existingNotifications
        ? JSON.parse(existingNotifications)
        : [];
      notifications.push(notification);
      await AsyncStorage.setItem("notifications", JSON.stringify(notifications));
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  };

  //Nottification
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        setExpoPushToken(token ?? "");
        //Push Notification
        dispatch(registerUser({ deviceId: uniqueId, pushToken: token }));
      })
      .catch((error) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        saveNotification(notification);
      });

    requestTrackingPermission();

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [uniqueId]);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      if (hasLaunched === null) {
        await AsyncStorage.setItem("hasLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    };
    checkFirstLaunch();
  }, []);

  //starting before font loading
  const [fontLoaded] = useFonts({
    light: require("./assets/fonts/light.otf"),
    regular: require("./assets/fonts/regular.otf"),
    medium: require("./assets/fonts/medium.otf"),
    semibold: require("./assets/fonts/semibold.otf"),
    bold: require("./assets/fonts/bold.otf"),
    xtrabold: require("./assets/fonts/xtrabold.otf"),
  });

  if (!fontLoaded || isFirstLaunch === null) {
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Group>

          <Stack.Screen
            name="BottomTabNavigation"
            component={BottomTabNavigation}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Payment"
            component={Payment}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            options={{ headerShown: false }}
          >
            {(props) => <SettingsScreen {...props} expoPushToken={expoPushToken} />}
          </Stack.Screen>
          <Stack.Screen
            name="UserDetails"
            component={UserDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PrivacyPoliticy"
            component={PrivacyPoliticy}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RefundPolitcy"
            component={RefundPolitcy}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SubscriptionPolitcy"
            component={SubscriptionPolitcy}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TermsPoliticy"
            component={TermsPoliticy}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NotificationsPage"
            component={NotificationsPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Zone"
            component={Zone}
            options={{ headerShown: false }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
