import React, { useState, useRef } from "react";
import { View, SafeAreaView, StyleSheet, Alert, Platform, FlatList } from "react-native";
import { ReusableButton, ReusableText } from "../../components";
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import homeStyles from "../screens.style";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import * as Tracking from 'expo-tracking-transparency';
import Slides from "../../components/onboarding/Slides";
import { t } from "i18next";

const LOCATION_TASK_NAME = "background-location-task";
const BACKGROUND_FETCH_TASK = "background-fetch-task";

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("Location task error:", error);
    return;
  }
  if (data) {
    const { locations } = data;
    // console.log("Received new locations:", locations); // Bu satırı kaldırabilirsiniz
  }
});

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    let backgroundLocationStatus;
    if (Platform.OS === 'ios') {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      backgroundLocationStatus = status;
    } else {
      const { status } = await Location.requestForegroundPermissionsAsync();
      backgroundLocationStatus = status;
    }
    if (backgroundLocationStatus === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      console.log("Background location:", location);
      return BackgroundFetch.BackgroundFetchResult.NewData;
    }
    return BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    console.error("Background fetch failed:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

const PermissionsPage = () => {
  const [stage, setStage] = useState(1);
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const handleNextStage = async () => {
    try {
      if (stage === 1) {
        const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
        if (notificationStatus !== 'granted') {
          Alert.alert(t("permissions.notificationPermissionRequired"), t("permissions.notificationPermissionDenied"), [
            { text: t("permissions.ok"), onPress: () => setStage(stage + 1) }
          ]);
        }
      } else if (stage === 2) {
        const { status: foregroundLocationStatus } = await Location.requestForegroundPermissionsAsync();
        if (foregroundLocationStatus !== 'granted') {
          Alert.alert(t("permissions.locationPermissionRequired"), t("permissions.locationPermissionDenied"), [
            { text: t("permissions.ok"), onPress: () => setStage(stage + 1) }
          ]);
        }
        if (Platform.OS === 'android') {
          const { status: backgroundLocationStatus } = await Location.requestBackgroundPermissionsAsync();
          if (backgroundLocationStatus !== 'granted') {
            Alert.alert(t("permissions.backgroundLocationPermissionRequired"), t("permissions.backgroundLocationPermissionDenied"));
          }
        }
      } else if (stage === 3) {
        const { status: trackingStatus } = await Tracking.requestTrackingPermissionsAsync();
        if (trackingStatus !== 'granted') {
          Alert.alert(t("permissions.trackingPermissionRequired"), t("permissions.trackingPermissionDenied"), [
            { text: t("permissions.ok"), onPress: () => setStage(stage + 1) }
          ]);
        }
      } else if (stage === 4) {
        const locationTaskStatus = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
        if (!locationTaskStatus) {
          let backgroundLocationStatus;
          if (Platform.OS === 'ios') {
            const { status } = await Location.requestBackgroundPermissionsAsync();
            backgroundLocationStatus = status;
          } else {
            const { status } = await Location.requestForegroundPermissionsAsync();
            backgroundLocationStatus = status;
          }
          if (backgroundLocationStatus !== 'granted') {
            navigation.navigate('BottomTabNavigation');
            return;
          }
        }
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
          deferredUpdatesInterval: 1000,
          foregroundService: {
            notificationTitle: "Konum Servisi",
            notificationBody: "Konumunuz arka planda izleniyor.",
          },
        });
        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: 15 * 60,
          stopOnTerminate: false,
          startOnBoot: true,
        });
        navigation.navigate('BottomTabNavigation');
        return;
      }
      setStage(stage + 1);
      flatListRef.current.scrollToIndex({ index: stage, animated: true });
    } catch (error) {
      console.error("Error in handleNextStage:", error);
    }
  };

  const slides = [
    {
      id: 1,
      image: require("../../assets/permission1.png"),
      header: "slides.slide1header",
      title: "slides.slide1desc",
    },
    {
      id: 2,
      image: require("../../assets/permission2.png"),
      header: "slides.slide2header",
      title: "slides.slide2desc",
    },
    {
      id: 3,
      image: require("../../assets/permission4.png"),
      header: "slides.slide3header",
      title: "slides.slide3desc",
    },
    {
      id: 4,
      image: require("../../assets/permission3.png"),
      header: "slides.slide4header",
      title: "slides.slide4desc",
    },
  ];

  const Paginator = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === stage - 1 ? COLORS.primary : COLORS.lightInput }
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={[homeStyles.container]}>
      <Paginator />
      <FlatList
        ref={flatListRef}
        scrollEnabled={false}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        data={slides}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Slides item={item} activeSlide={stage - 1} />}
      />
      <View style={{ paddingBottom: 50 ,alignItems:"center" }}>
        <ReusableButton
          btnText={t("permissions.accept")}
          width={SIZES.width - 40}
          height={45}
          borderRadius={SIZES.medium}
          backgroundColor={COLORS.primary}
          textColor={COLORS.white}
          textFontSize={TEXT.medium}
          textFontFamily={"medium"}
          onPress={handleNextStage}
        />
      </View>
    </SafeAreaView>
  );
};

const checkPermissionsAndNavigate = async (navigation) => {
  const { status: notificationStatus } = await Notifications.getPermissionsAsync();
  const { status: foregroundLocationStatus } = await Location.getForegroundPermissionsAsync();
  const backgroundFetchStatus = await BackgroundFetch.getStatusAsync();
  const locationTaskStatus = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);

  if (notificationStatus === 'granted' && foregroundLocationStatus === 'granted' && backgroundFetchStatus === BackgroundFetch.BackgroundFetchStatus.Available && locationTaskStatus) {
    navigation.navigate('BottomTabNavigation');
  } else {
    navigation.navigate('PermissionsPage');
  }
};

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  box: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightInput,
    borderRadius: 200,
    padding: 10,
    alignSelf: "center",
  },
  alignCenter: {
    flex: 1,
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  content: {
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    padding: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  dot: {
    height: 12,
    width: 12,
    borderRadius: 4,
    marginHorizontal: 4,
    borderWidth:1
  },
});

export default PermissionsPage;
export { checkPermissionsAndNavigate };
