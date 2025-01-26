import React from "react";
import { TouchableOpacity } from "react-native";
import { ReusableText } from "..";
import { COLORS, TEXT } from "../../constants/theme";
import homeStyles from "../../screens/screens.style";
import { formatDate } from "../../utils/dateUtils";
import { useTranslation } from "react-i18next";

const ZoneCard = ({ item, onLongPress, selected }) => {
  const { t } = useTranslation();
  const formattedDate = formatDate(item.createdAt);

  return (
    <TouchableOpacity
      style={[
        homeStyles.logsCard,
        { backgroundColor: selected ? COLORS.red : COLORS.lightInput },
      ]}
      onLongPress={onLongPress}
    >
      <ReusableText
        text={item.title}
        family={"bold"}
        size={TEXT.xSmall}
        color={selected ? COLORS.white : COLORS.lightBlack}
      />
      <ReusableText
        text={formattedDate || t("payment.now")}
        family={"regular"}
        size={TEXT.xxSmall}
        color={selected ? COLORS.white : COLORS.lightBlack}
      />
    </TouchableOpacity>
  );
};

export default ZoneCard;