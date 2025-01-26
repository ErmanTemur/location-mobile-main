import {
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { AppBar, ReusableButton, ReusableText } from "../../components";
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import homeStyles from "../screens.style";
import Countdown from "react-native-countdown-component";
import { HeightSpacer } from "../../components";
import PaymentCard from "../../components/Card/PaymentCard";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { createSubscription } from "../../redux/userActions";
import { useDispatch, useSelector } from "react-redux";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const Payment = ({ navigation }) => {
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();

  const deviceId = useSelector((state) => state.user.deviceId);

  const handleCheckboxPress = (item) => {
    setSelectedItem(item.id === selectedItem?.id ? null : item);
  };

  const handleButtonPress = async () => {
    if (selectedItem) {
      if (selectedItem.id) {
        const identifier = selectedItem.id;
        const selectedPackage = offerings.availablePackages.find(
          (item) => item.identifier === identifier
        );
        const purchaseResult = await purchasePackage(selectedPackage);
        if (purchaseResult) {
          const subscriptionData = {
            deviceId,
            paymentId: entitlementInfo.identifier,
            paymentStore: entitlementInfo.store,
            expirationDate: entitlementInfo.expirationDate,
            lastPaymentDate: entitlementInfo.latestPurchaseDate,
            packageName: entitlementInfo.productPlanIdentifier,
          };
          try {
            const actionResult = await dispatch(
              createSubscription(subscriptionData)
            );

            if (createSubscription.fulfilled.match(actionResult)) {
              setModalVisible(true);
              setTimeout(() => {
                navigation.navigate("Home", { showPaymentSuccessModal: true });
              }, 500); 
            } else {
              console.error(
                "Error creating subscription:",
                actionResult.payload
              );
            }
          } catch (error) {
            console.error("Error creating subscription:", error);

          }
        } else {
          console.log("Purchase failed");
        }
      } else {
        console.log("No item selected");
      }
    } else {
      console.log("No item selected");
    }
  };

  const handleTermsPress = () => {
    navigation.navigate("TermsPoliticy");
  };
  const handlePrivacyPress = () => {
    navigation.navigate("PrivacyPoliticy");
  };
  const handleSubscriptionPress = () => {
    navigation.navigate("SubscriptionPolitcy");
  };
  const handleRefundPress = () => {
    navigation.navigate("RefundPolitcy");
  };

  const handleRestorePurchases = async () => {
    try {
      const response = await restorePurchases();
      if (response == null) {
      }
    } catch {
      console.error("Error restoring purchases");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        homeStyles.paycontainer,
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
      <View style={styles.content}>
        <ReusableText
          text={t("payment.headerTitle")}
          family={"bold"}
          size={TEXT.large}
          color={COLORS.lightBlack}
          align={"center"}
        />
        <ReusableText
          text={t("payment.headerDesc")}
          family={"regular"}
          size={TEXT.small}
          color={COLORS.lightBlack}
          align={"center"}
        />
        {timeLeft > 0 && (
          <Countdown
            until={timeLeft}
            size={25}
            onFinish={() => alert(t("payment.campanyFinish"))}
            digitStyle={{ backgroundColor: COLORS.lightBlack }}
            digitTxtStyle={{ color: COLORS.primary }}
            timeLabelStyle={{ color: COLORS.lightBlack, fontWeight: "bold" }}
            separatorStyle={{ color: "red" }}
            timeToShow={["D", "H", "M", "S"]}
            timeLabels={{ d: t("payment.day"), h: t("payment.hour"), m: t("payment.minute"), s: t("payment.second") }}
            showSeparator
          />
        )}
      </View>
      <View style={styles.details}>
        <View>
          <View style={homeStyles.flexContainerGap}>
            <Entypo name="location" size={24} color="black" />
            <ReusableText
              text={t("payment.contetentTitle1")}
              family={"bold"}
              size={TEXT.xSmall}
              color={COLORS.lightBlack}
            />
          </View>
          <ReusableText
            text={t("payment.contetentDesc1")}
            family={"regular"}
            size={TEXT.xxSmall}
            color={COLORS.lightBlack}
          />
        </View>
        <View>
          <View style={homeStyles.flexContainerGap}>
            <FontAwesome5 name="walking" size={24} color="black" />
            <ReusableText
              text={t("payment.contetentTitle2")}
              family={"bold"}
              size={TEXT.xSmall}
              color={COLORS.lightBlack}
            />
          </View>
          <ReusableText
            text={t("payment.contetentDesc2")}
            family={"regular"}
            size={TEXT.xxSmall}
            color={COLORS.lightBlack}
          />
        </View>
      </View>
      <View style={homeStyles.footer}>
        <View style={{ width: "100%" }}>
          <FlatList
            data={offeringData}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: SIZES.xLarge }}
            renderItem={({ item }) => (
              <PaymentCard
                item={item}
                isChecked={selectedItem?.id === item.id}
                onCheck={() => handleCheckboxPress(item)}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
        <ReusableButton
          btnText={t("payment.subscription")}
          width={SIZES.width - 40}
          height={45}
          borderRadius={SIZES.small}
          backgroundColor={COLORS.lightBlack}
          textColor={COLORS.white}
          textFontSize={TEXT.small}
          textFontFamily={"medium"}
          onPress={handleButtonPress}
        />
        <TouchableOpacity
          onPress={handleRestorePurchases}
          style={homeStyles.flexContainerGap}
        >
          <MaterialIcons name="restore" size={24} color="black" />
          <ReusableText
            text={t("payment.restoreSubs")}
            family={"medium"}
            size={TEXT.small}
            color={COLORS.lightBlack}
            align={"center"}
          />
        </TouchableOpacity>
        <View style={[homeStyles.flexSpaceWith, { flexWrap: 'wrap' }]}>
          <TouchableOpacity onPress={handleTermsPress}>
            <ReusableText
              text={t("settings.termsOfUse")}
              family={"medium"}
              size={TEXT.xSmall}
              color={COLORS.lightBlack}
              align={"center"}
              underline={true}
            />
          </TouchableOpacity>
          <View
            style={{
              width: 1,
              height: 15,
              backgroundColor: COLORS.lightBlack,
              marginHorizontal: 5,
            }}
          />
          <TouchableOpacity onPress={handlePrivacyPress}>
            <ReusableText
              text={t("settings.privacyPolicy")}
              family={"medium"}
              size={TEXT.xSmall}
              color={COLORS.lightBlack}
              align={"center"}
              underline={true}
            />
          </TouchableOpacity>
          <View
            style={{
              width: 1,
              height: 15,
              backgroundColor: COLORS.lightBlack,
              marginHorizontal: 5,
            }}
          />
          <TouchableOpacity onPress={handleSubscriptionPress}>
            <ReusableText
              text={t("settings.subscriptionPoliticy")}
              family={"medium"}
              size={TEXT.xSmall}
              color={COLORS.lightBlack}
              align={"center"}
              underline={true}
            />
          </TouchableOpacity>
          <View
            style={{
              width: 1,
              height: 15,
              backgroundColor: COLORS.lightBlack,
              marginHorizontal: 5,
            }}
          />
          <TouchableOpacity onPress={handleRefundPress}>
            <ReusableText
              text={t("settings.refundPolicy")}
              family={"medium"}
              size={TEXT.xSmall}
              color={COLORS.lightBlack}
              align={"center"}
              underline={true}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  details: {
    marginVertical: 20,
    marginHorizontal: 20,
    padding: 10,
    borderRadius: SIZES.small,
    borderColor: COLORS.lightBlack,
    borderWidth: 1,
  },
  counterContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    alignItems: "center",
  },
  counterText: {
    fontSize: TEXT.medium,
    color: COLORS.black,
    marginBottom: 5,
  },
  counterTime: {
    fontSize: TEXT.large,
    color: "red",
    fontWeight: "bold",
  },
  price: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.lightBlack,
    gap: 10,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 30,
  },
});

export default Payment;
