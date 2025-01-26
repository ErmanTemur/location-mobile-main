import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Payment, Settings, Zone } from "../screens";
import { Ionicons,  MaterialIcons,} from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator();

const tabBarStyle = {
  backgroundColor: "rgba(255, 255, 255, 1)",
  paddingTop: 10,
  paddingBottom: 20,
  height: 80,
  marginBottom: 0,
  alignItems: "center",
  position: "absolute",
};

const BottomTabNavigation = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarHideKeyBoard={true}
      headerShown={false}
      barStyle={{ paddingBottom: 48 }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarStyle: tabBarStyle,
          tabBarShowLabel: false,
          tabBarLabel: t("home.location"),
          tabBarLabelStyle: {
            color: COLORS.black,
            fontSize: 12,
          },
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "location-sharp" : "location-outline"}
              color={focused ? COLORS.black : COLORS.black}
              size={focused ? 28 : 26}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("Home", { closeModal: true });
          },
        })}
      />
      <Tab.Screen
        name="Payment"
        component={Zone}
        options={{
          tabBarStyle: tabBarStyle,
          tabBarShowLabel: false,
          tabBarLabel: t("home.premium"),
          tabBarLabelStyle: {
            color: COLORS.black,
            fontSize: 12,
          },
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person-add" : "person-add-outline"}
              color={focused ? COLORS.black : COLORS.black}
              size={focused ? 28 : 26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Zone"
        component={Zone}
        options={{
          tabBarStyle: tabBarStyle,
          tabBarShowLabel: false,
          tabBarLabel: t("home.settings"),
          tabBarLabelStyle: {
            color: COLORS.black,
            fontSize: 12,
          },
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
            name={focused ? "earth" : "earth-outline"}
            color={focused ? COLORS.black : COLORS.black}
            size={focused ? 28 : 26}
          />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarStyle: tabBarStyle,
          tabBarShowLabel: false,
          tabBarLabel: t("home.settings"),
          tabBarLabelStyle: {
            color: COLORS.black,
            fontSize: 12,
          },
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              color={focused ? COLORS.black : COLORS.black}
              size={focused ? 28 : 26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
