import React from "react";
import { View, Image } from "react-native";
import { ReusableText } from "..";
import { COLORS, TEXT } from "../../constants/theme";
import homeStyles from "../../screens/screens.style";
import { formatDate } from "../../utils/dateUtils";

const NotificationCard = ({ item }) => {
  const body = item.request.content.body;
  const parts = body.split(",");
  const name = parts[0].trim();
  const uniqueBody = [...new Set(parts.slice(1).map(part => part.trim()))].join(", ");

  return (
    <View style={homeStyles.flexSpace}>
      <View style={homeStyles.flexContainer}>
        <Image
          source={{
            uri: "https://i.ibb.co/6JKnfp4/user.png",
          }}
          style={homeStyles.imageNotification}
        />
        <View>
          <ReusableText
            text={name}
            family={"medium"}
            size={TEXT.xSmall}
            color={COLORS.black}
          />
          <ReusableText
            text={uniqueBody}
            family={"regular"}
            size={TEXT.xxSmall}
            color={COLORS.description}
          />
        </View>
      </View>
      {/* <ReusableText
        text={formatDate(item.request.content.date)}
        family={"regular"}
        size={TEXT.xxSmall}
        color={COLORS.description}
      /> */}
    </View>
  );
};

export default NotificationCard;