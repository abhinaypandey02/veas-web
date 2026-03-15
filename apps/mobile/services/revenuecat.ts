import Purchases, { LOG_LEVEL } from "react-native-purchases";

export const RC_ENTITLEMENT_ID = "Veas Pro";
export const RC_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ?? "";

export function configureRevenueCat() {
  if (!RC_API_KEY) {
    console.warn("[RevenueCat] API key is missing, skipping configuration");
    return;
  }
  if (!__DEV__ && RC_API_KEY.startsWith("test_")) {
    console.error(
      "[RevenueCat] Test API key detected in production build. " +
        "Replace EXPO_PUBLIC_REVENUECAT_API_KEY with your production key (appl_...)."
    );
    return;
  }
  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }
  Purchases.configure({ apiKey: RC_API_KEY });
}

export async function identifyRevenueCatUser(userId: string) {
  try {
    await Purchases.logIn(userId);
  } catch (e) {
    console.error("[RevenueCat] logIn failed:", e);
  }
}

export async function resetRevenueCatUser() {
  try {
    await Purchases.logOut();
  } catch (e) {
    console.error("[RevenueCat] logOut failed:", e);
  }
}

export async function checkProEntitlement(): Promise<boolean> {
  try {
    const info = await Purchases.getCustomerInfo();
    return !!info.entitlements.active[RC_ENTITLEMENT_ID];
  } catch {
    return false;
  }
}
