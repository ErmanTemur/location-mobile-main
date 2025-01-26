import React, { createContext, useContext, useState } from "react";
import {
  PurchasesOffering,
  PurchasesEntitlementInfo,
  PurchasesPackage,
  CustomerInfo,
} from "react-native-purchases"; // Adjust the import based on your library
import { useRevenueCat } from "../hooks/useRevenueCat";

// Define the context type
interface RevenueCatContextType {
  offerings: PurchasesOffering | null;
  entitlementInfo: PurchasesEntitlementInfo | null;
  loading: boolean;
  purchasePackage: (selectedPackage: PurchasesPackage) => Promise<any | null>;
  restorePurchases: () => Promise<CustomerInfo | null>;
}

// Create the context
const RevenueCatContext = createContext<RevenueCatContextType | undefined>(
  undefined
);

// Create a provider component
export const RevenueCatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const revenueCat = useRevenueCat();


  return (
    <RevenueCatContext.Provider value={revenueCat}>
      {children}
    </RevenueCatContext.Provider>
  );
};

// Custom hook to use the RevenueCat context
export const useRevenueCatContext = () => {
  const context = useContext(RevenueCatContext);
  if (context === undefined) {
    throw new Error(
      "useRevenueCatContext must be used within a RevenueCatProvider"
    );
  }
  return context;
};
