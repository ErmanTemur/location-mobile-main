import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  memo,
  useMemo,
} from "react";
import {
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import homeStyles from "../screens.style";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import HomeModal from "../../components/Reusable/HomeModal";
import { AntDesign } from "@expo/vector-icons";
import ToolBar from "../../components/Reusable/ToolBar";
import { useDispatch, useSelector } from "react-redux";
import { getFollowingLocations, updateLocation } from "../../redux/userActions";
import { COLORS, SIZES, TEXT } from "../../constants/theme";
import Modal from "react-native-modal";
import { ReusableButton, ReusableText } from "../../components";
import * as Location from "expo-location";
import { t } from "i18next";

const Home = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(t("locationSearch"));
  const [isModalVisible, setModalVisible] = useState(true);
  const zones = useSelector((state) => state.user.zones);
  const navigation = useNavigation();
  const route = useRoute();
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 39.9334,
    longitude: 32.8597,
    latitudeDelta: 20.0,
    longitudeDelta: 20.0,
  });

  const dispatch = useDispatch();
  const deviceId = useSelector((state) => state.user.deviceId);
  const user = useSelector((state) => state.user.user);

  const followingLocations = useSelector(
    (state) => state.user.followingLocations
  );

  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const uniqueId = useSelector((state) => state.user.deviceId);

  useEffect(() => {
    if (route.params?.showPaymentSuccessModal) {
      setShowPaymentSuccessModal(true);
    }
  }, [route.params]);

  const handleClosePaymentSuccessModal = () => {
    setShowPaymentSuccessModal(false);
  };

  useEffect(() => {
    const requestPermission = async () => {
      if (deviceId) {
        dispatch(getFollowingLocations({ deviceId }));
      }
    };
    requestPermission();
  }, [deviceId, dispatch]);

  useEffect(() => {
    let subscription;
    const requestPermissionAndWatchPosition = async () => {
      if (deviceId && user.visibility) {
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 5,
          },
          (newLocation) => {
            const { latitude, longitude } = newLocation.coords;
            setLocation(newLocation);
            dispatch(updateLocation({ deviceId, latitude, longitude }));
            dispatch(getFollowingLocations({ deviceId }));
          }
        );
      }
    };
    requestPermissionAndWatchPosition();
    return () => {
      if (subscription && typeof subscription.remove === "function") {
        subscription.remove();
      }
    };
  }, [deviceId, user.visibility, dispatch]);

  useFocusEffect(
    useCallback(() => {
      setModalVisible(true);
    }, [])
  );

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      setModalVisible(true);
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      setModalVisible(false);
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  useEffect(() => {
    if (route.params?.closeModal) {
      setModalVisible(false);
    }
  }, [route.params]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleZoomIn = () => {
    if (mapRef.current && region) {
      const newRegion = {
        ...region,
        latitudeDelta: region.latitudeDelta / 2,
        longitudeDelta: region.longitudeDelta / 2,
      };
      setRegion(newRegion);
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current && region) {
      const newRegion = {
        ...region,
        latitudeDelta: region.latitudeDelta * 2,
        longitudeDelta: region.longitudeDelta * 2,
      };
      setRegion(newRegion);
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  };

  const handleGoToCurrentLocation = async () => {
    try {
      if (!user.visibility) return;
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      const newRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0025,
        longitudeDelta: 0.0025,
      };
      setRegion(newRegion);
      mapRef.current.animateToRegion(newRegion, 1000);

      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      const { street, subregion } = reverseGeocode[0];
      setAddress(
        street && subregion ? `${street}, ${subregion}` : "Adres bulunamadı"
      );
    } catch (error) {
      console.error("Location Error:", error);
    }
  };

  const handleGoToLocation = (latitude, longitude) => {
    setModalVisible(!isModalVisible);
    setTimeout(() => {
      if (mapRef.current) {
        try {
          mapRef.current.animateCamera(
            {
              center: { latitude, longitude },
              zoom: 18,
            },
            { duration: 1000, useNativeDriver: true }
          );
        } catch (error) {
          Alert.alert(
            "Location Error",
            "An error occurred while moving to the location."
          );
          console.error("Location Error:", error);
        }
      }
    }, 100);
  };

  const CustomMarker = memo(
    ({ coordinate, imageUri, title, description, item }) => {
      return (
        <Marker
          coordinate={coordinate}
          title={title}
          description={description}
          onPress={() => navigation.navigate("UserDetails", { item })}
        >
          <View style={homeStyles.markerContainer}>
            <View style={homeStyles.imageContainer}>
              <Image
                source={{ uri: imageUri }}
                style={homeStyles.markerImage}
              />
            </View>
            <View
              style={[
                homeStyles.triangle,
                { transform: [{ rotate: "180deg" }] },
              ]}
            />
          </View>
        </Marker>
      );
    },
    (prevProps, nextProps) => {
      return (
        prevProps.coordinate.latitude === nextProps.coordinate.latitude &&
        prevProps.coordinate.longitude === nextProps.coordinate.longitude &&
        prevProps.imageUri === nextProps.imageUri
      );
    }
  );

  const [followingLocationsWithAddress, setFollowingLocationsWithAddress] =
    useState([]);

  useEffect(() => {
    const updateFollowingLocationsWithAddress = async () => {
      const updatedLocations = await Promise.all(
        followingLocations.map(async (location) => {
          if (location.currentLocation) {
            const reverseGeocode = await Location.reverseGeocodeAsync({
              latitude: location.currentLocation.latitude,
              longitude: location.currentLocation.longitude,
            });
            const { street, subregion } = reverseGeocode[0];
            const address =
              street && subregion
                ? `${street}, ${subregion}`
                : "Takip edilen kişi konum bilgisi paylaşmıyor.";
            return { ...location, address };
          }
          return location;
        })
      );
      setFollowingLocationsWithAddress(updatedLocations);
    };

    if (followingLocations.length > 0) {
      updateFollowingLocationsWithAddress();
    }
  }, [followingLocations]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (deviceId) {
        dispatch(getFollowingLocations({ deviceId }));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [deviceId, dispatch]);

  const getLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);

    let reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    if (reverseGeocode.length > 0) {
      const { street, subregion } = reverseGeocode[0];
      setAddress(
        street && subregion ? `${street}, ${subregion}` : t("home.notAdress")
      );
    } else {
      setAddress(t("home.notAdress"));
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const markers = useMemo(() => {
    if (!user) return null;
    const userMarker = location ? (
      <CustomMarker
        key={`user-${user._id}`}
        coordinate={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }}
        imageUri={user.picture}
        title="Ben"
        description={address}
        item={user}
      />
    ) : null;

    const followingMarkers = followingLocationsWithAddress
      .filter((item) => item.currentLocation)
      .map((item) => (
        <CustomMarker
          key={`following-${item._id}`}
          coordinate={{
            latitude: item.currentLocation.latitude,
            longitude: item.currentLocation.longitude,
          }}
          imageUri={item.picture}
          title={item.nickname}
          description={item.address}
          item={item}
        />
      ));

    return userMarker ? [userMarker, ...followingMarkers] : followingMarkers;
  }, [location, followingLocationsWithAddress, user]);

  const circles = useMemo(() => {
    return zones.map((zone) => (
      <Circle
        key={zone._id}
        center={zone.coordinates}
        radius={zone.zoneRadius}
        strokeColor={COLORS.primary}
        fillColor="rgba(173, 255, 47, 0.3)"
      />
    ));
  }, [zones]);

  return (
    <SafeAreaView style={homeStyles.container}>
      <ToolBar
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onGoToCurrentLocation={handleGoToCurrentLocation}
      />
      <MapView ref={mapRef} style={homeStyles.map} initialRegion={region}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        {markers}
        {circles}
      </MapView>

      {!isModalVisible && (
        <TouchableOpacity
          onPress={toggleModal}
          style={homeStyles.dragHandleContainerFixed}
        >
          <View style={homeStyles.boxIcon}>
            <AntDesign name="up" size={20} color="white" />
          </View>
        </TouchableOpacity>
      )}
      {showPaymentSuccessModal && (
        <Modal
          isVisible={showPaymentSuccessModal}
          onBackdropPress={handleClosePaymentSuccessModal}
          onBackButtonPress={handleClosePaymentSuccessModal}
          animationIn="slideInUp"
          animationOut="slideOutDown"
        >
          <View style={homeStyles.modalContainer}>
            <ReusableText
              text={t("payment.paySuccess")}
              family={"bold"}
              size={TEXT.large}
              color={COLORS.lightBlack}
              align={"center"}
            />
            <ReusableText
              text={t("payment.payDesc")}
              family={"regular"}
              size={TEXT.small}
              color={COLORS.lightBlack}
              align={"center"}
            />
            <ReusableText
              text={t("payment.payRestoreId")}
              family={"medium"}
              size={TEXT.medium}
              color={COLORS.lightBlack}
              align={"center"}
            />
            <ReusableText
              text={t("payment.payNote")}
              family={"regular"}
              size={TEXT.small}
              color={COLORS.description}
              align={"center"}
            />
            <ReusableText
              text={`${uniqueId}`}
              family={"bold"}
              size={TEXT.large}
              color={COLORS.black}
              align={"center"}
            />
            <ReusableButton
              btnText={t("ok")}
              width={SIZES.width - 80}
              height={42}
              borderRadius={SIZES.xSmall}
              backgroundColor={COLORS.primary}
              textColor={COLORS.black}
              textFontSize={TEXT.medium}
              textFontFamily={"medium"}
              onPress={handleClosePaymentSuccessModal}
            />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default Home;
