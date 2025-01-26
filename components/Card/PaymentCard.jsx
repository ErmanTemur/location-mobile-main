import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { ReusableText } from "..";
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import ReusableCheckbox from "../Reusable/ReusableCheckbox";
import { useTranslation } from "react-i18next";

const PaymentCard = ({ item, isChecked, onCheck }) => {
  const { t } = useTranslation();

  const getBillingCycleText = (cycle) => {
    switch (cycle) {
      case "MONTHLY":
        return t("payment.monthly");
      case "WEEKLY":
        return t("payment.weekly");
      case "YEARLY":
        return t("payment.yearly");
      default:
        return cycle;
    }
  };

  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  return (
    <TouchableOpacity
      style={[styles.container, { borderWidth: isChecked ? 3 : 1 }]}
      onPress={onCheck}
    >
      <View style={styles.row}>
        <ReusableCheckbox
          isChecked={isChecked}
          onCheck={onCheck}
          initialIcon="square-outline"
          swappedIcon="checkbox"
        />
        <View>
          <ReusableText
            text={item.name === "Aylık Abonelik" ? t("payment.monthlySubs") : item.name === "Haftalık Abonelik" ? t("payment.weeklySubs") : item.name}
            family={"regular"}
            size={TEXT.xSmall}
            color={COLORS.black}
          />
          {item.billingCycle === "MONTHLY" ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <ReusableText
                text={`${formatPrice(item.price * 2)}₺`}
                family={"medium"}
                size={TEXT.small}
                color={COLORS.black}
                textDecorationLine="line-through"
                style={{ marginRight: 5 }}
              />
              <ReusableText
                text={`${formatPrice(item.price)}₺/${getBillingCycleText(item.billingCycle)}`}
                family={"semibold"}
                size={TEXT.small}
                color={COLORS.black}
              />
            </View>
          ) : (
            <ReusableText
              text={`${formatPrice(item.price)}₺/${getBillingCycleText(item.billingCycle)}`}
              family={"semibold"}
              size={TEXT.small}
              color={COLORS.black}
            />
          )}
        </View>
      </View>
      {item.billingCycle === "MONTHLY" && ( 
        <View style={styles.option}>
          <View style={styles.optionHeader}>
            <ReusableText
              text={t("payment.preferenced")}
              family={"bold"}
              size={TEXT.xxSmall}
              color={COLORS.black}
            />
          </View>
          <View style={styles.optionContent}>
            <ReusableText
              text={t("payment.discount")}
              family={"medium"}
              size={TEXT.xxSmall}
              color={COLORS.black}
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PaymentCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 25,
    width: SIZES.width - 40,
    padding: 10,
    borderColor: COLORS.lightBlack,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 10,
    zIndex: 1,
  },
  checkboxContainer: {
    borderWidth: 1,
    borderColor: COLORS.lightBlack,
    borderRadius: 5,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    overflow: "visible",
    zIndex: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  option: {
    borderWidth: 1,
    borderColor: COLORS.lightBlack,
    borderRadius: 5,
  },
  optionHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  optionContent: {
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
    alignItems: "center",
  },
});
