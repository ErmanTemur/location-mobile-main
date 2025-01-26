import {
  View,
  Platform,
  StatusBar,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Video } from "expo-av";
import { ReusableText, ReusableButton } from "../../components";
import { COLORS, TEXT, SIZES } from "../../constants/theme";
import { useTranslation } from "react-i18next";
import { checkPermissionsAndNavigate } from "../Other/PermissionsPage";
import { onboardingData } from "../../constants/onboardingData";

const { width } = Dimensions.get('window');

const Onboarding = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const videoRefs = useRef({});
  const { t } = useTranslation();

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor("transparent");
    }
  }, []);

  const submitHandler = async () => {
    // Tüm videoları durdur
    Object.values(videoRefs.current).forEach(async (videoRef) => {
      if (videoRef) {
        await videoRef.pauseAsync();
      }
    });
    checkPermissionsAndNavigate(navigation);
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.slide}>
      <Video
        ref={(ref) => (videoRefs.current[index] = ref)}
        source={item.video}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        shouldPlay
        isLooping
        isMuted
      />
      <View style={styles.overlay}>
        <View style={styles.contentContainer}>
          <ReusableText
            text={t(item.title)}
            family={"bold"}
            size={TEXT.xLarge}
            color={COLORS.white}
            align={"left"}
          />
          <ReusableText
            text={t(item.description)}
            family={"medium"}
            size={TEXT.small}
            color={COLORS.white}
            align={"left"}
          />
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.dotsContainer}>
            {onboardingData.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  idx === currentIndex && styles.activeDot
                ]}
              />
            ))}
          </View>
          
          {index === onboardingData.length - 1 && (
            <ReusableButton
              btnText={t("start")}
              width={100}
              height={40}
              borderRadius={25}
              backgroundColor={COLORS.primary}
              textColor={COLORS.white}
              icon="chevron-right"
              onPress={submitHandler}
            />
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width: width,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  overlay: {
    width: width - 15,
    borderRadius: 50,
    paddingHorizontal: 30,
    paddingVertical: 30,
    marginBottom: 20,
  },
  contentContainer: {
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 30,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 15,
    height: 6,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    opacity: 0.5,
  },
  activeDot: {
    width: 40,
    backgroundColor: COLORS.primary,
    opacity: 1,
  },
});

export default Onboarding;
