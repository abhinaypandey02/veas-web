import { useState, useEffect } from "react";
import Purchases, { CustomerInfo } from "react-native-purchases";
import { RC_ENTITLEMENT_ID } from "@/services/revenuecat";

export function useSubscription() {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Purchases.getCustomerInfo()
      .then(setCustomerInfo)
      .catch(() => {})
      .finally(() => setIsLoading(false));

    const listener = (info: CustomerInfo) => setCustomerInfo(info);
    Purchases.addCustomerInfoUpdateListener(listener);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, []);

  const isPro = !!customerInfo?.entitlements.active[RC_ENTITLEMENT_ID];

  return { customerInfo, isPro, isLoading };
}
