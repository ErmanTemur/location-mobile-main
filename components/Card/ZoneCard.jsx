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
      ]}
      onLongPress={onLongPress}
    >
      <ReusableText
        text={item.title}
        family={"bold"}
        size={TEXT.medium}
        color={selected ? COLORS.white : COLORS.black}
      />
      <ReusableText
        text={formattedDate || t("payment.now")}
        family={"regular"}
        size={TEXT.small}
        color={selected ? COLORS.white : COLORS.black}
      />
    </TouchableOpacity>
  );
};

export default ZoneCard;