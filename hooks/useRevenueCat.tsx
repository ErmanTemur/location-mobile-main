import { useEffect, useState } from 'react';
import Purchases, { PurchasesOffering, PurchasesPackage, PurchasesEntitlementInfo } from 'react-native-purchases';
import { Platform } from 'react-native';

const API_KEY_IOS = 'appl_navWphTftakeVySmcehmqaKeQne';
const API_KEY_ANDROID = 'goog_dmIquMZkFvaumnYcLeUihwOSjsJ';

export const useRevenueCat = () => {
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [entitlementInfo, setEntitlementInfo] = useState<PurchasesEntitlementInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set the correct API key based on the platform
    const apiKey = Platform.OS === 'ios' ? API_KEY_IOS : API_KEY_ANDROID;
    Purchases.configure({ apiKey });

    Purchases.setDebugLogsEnabled(true);

    const initializeRevenueCat = async () => {
      try {
        setLoading(true);
        // Fetch offerings
        const offeringsData = await Purchases.getOfferings();
        setOfferings(offeringsData.current);
        
        // Fetch user entitlement information
        const purchaserInfo = await Purchases.getCustomerInfo();
        setEntitlementInfo(purchaserInfo.entitlements.active['Abonelik']);
      } catch (error) {
        console.error('Error initializing RevenueCat:', error);
        alert(JSON.stringify(error))
      } finally {
        setLoading(false);
      }
    };

    initializeRevenueCat();
  }, []);

  const purchasePackage = async (selectedPackage: PurchasesPackage) => {
    try {
      const purchaseInfo = await Purchases.purchasePackage(selectedPackage);
      setEntitlementInfo(purchaseInfo.customerInfo.entitlements.active['Abonelik']);
      return purchaseInfo;
    } catch (error) {
      if (error.userCancelled) {
        console.log('Purchase was cancelled by the user.');
      } else {
        console.error('Error purchasing package:', error);
        alert('An error occurred while purchasing the package. Please try again.');
      }
      return null;
    }
  };

  const restorePurchases = async () => {
    try {
      const purchaserInfo = await Purchases.restorePurchases();

      setEntitlementInfo(purchaserInfo.entitlements.active['Abonelik']);
      return purchaserInfo;
    } catch (error) {
      console.log('Error restoring purchases:', error);
      return null;
    }
  };


  return {
    offerings,
    entitlementInfo,
    loading,
    purchasePackage,
    restorePurchases
  };
};