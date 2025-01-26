import React, { useState } from "react";
import { View, FlatList, Platform, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import HomeCard from "../../components/Card/homeCard";
import homeStyles from "../../screens/screens.style";
import { BlurView } from "expo-blur";
import LocationAddModal from "./LocationAddModal";
import { Ionicons } from "@expo/vector-icons";
import ReusableText from "./ReusableText";
import { useTranslation } from "react-i18next";

const HomeModal = ({
  isModalVisible,
  toggleModal,
  followingLocations,
  onLocationSelect,
}) => {
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const openAddModal = () => setAddModalVisible(true);
  const closeAddModal = () => setAddModalVisible(false);

  const defaultData = [
    {
      id: "1",
      picture:
        "https://i.ibb.co/W2n3R8d/8e31d8c5-8e7c-4a6b-899d-4fb0e5e40972.png",
      nickname: "A....  Ş....",
      address: "M.... M...., 3...., Istanbul",
      visibility: true,
    },
    {
      id: "2",
      picture:
        "https://i.ibb.co/hdFTgH3/a778a225-d86f-4959-86fb-5aa91d88f215.png",
      nickname: "Z.... Y....",
      address: "M.... M...., 3...., Istanbul",
      visibility: true,
    },
  ];

  const data =
    followingLocations && followingLocations.length > 1
      ? followingLocations
      : defaultData;

  const renderItem = ({ item }) => (
    <HomeCard
      key={item._id || item.id}
      item={item}
      onLocationSelect={onLocationSelect}
    />
  );
  const { t } = useTranslation();

  return (
    <>
      <Modal
        isVisible={isModalVisible}
        swipeDirection="down"
        onBackdropPress={toggleModal}
        onSwipeComplete={toggleModal}
        style={{ justifyContent: "flex-end", margin: 0 }}
        backdropOpacity={0}
        propagateSwipe
      >
        <View
          style={[
            homeStyles.modalContent,
            {
              marginBottom: 90,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            },
          ]}
        >
          <View style={homeStyles.dragHandleContainer}>
            <View style={homeStyles.dragHandle} />
          </View>
          {data === defaultData &&
            (Platform.OS === "ios" ? (
              <BlurView
                intensity={10}
                style={{
                  position: "absolute",
                  top: 20,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 50,
                  overflow: "hidden",
                  borderRadius: 30,
                }}
              />
            ) : (
              <BlurView
                intensity={20}
                style={{
                  position: "absolute",
                  top: 50,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 10,
                }}
              />
            ))}
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) =>
              (item?._id || item?.id || Math.random().toString()).toString()
            }
            contentContainerStyle={{ gap: SIZES.medium, zIndex: 0 }}
          />
        </View>
      </Modal>
      <LocationAddModal isVisible={isAddModalVisible} onClose={closeAddModal} />
    </>
  );
};

export default HomeModal;
