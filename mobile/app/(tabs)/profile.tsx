import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSubscription } from "@/hooks/use-subscription";
import { CustomerCenterModal } from "@/components/CustomerCenterModal";
import { PaywallModal } from "@/components/PaywallModal";

export default function ProfileScreen() {
  const { isPro, isLoading } = useSubscription();
  const [customerCenterOpen, setCustomerCenterOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>

        {isLoading ? (
          <ActivityIndicator color="#1a1a1a" />
        ) : (
          <View style={styles.subscriptionSection}>
            <Text style={styles.planLabel}>
              {isPro ? "✨ Veas Pro" : "Free Plan"}
            </Text>

            {!isPro ? (
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => setPaywallOpen(true)}
              >
                <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={styles.manageButton}
              onPress={() => setCustomerCenterOpen(true)}
            >
              <Text style={styles.manageButtonText}>Manage Subscription</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <PaywallModal
        visible={paywallOpen}
        onClose={() => setPaywallOpen(false)}
      />
      <CustomerCenterModal
        visible={customerCenterOpen}
        onClose={() => setCustomerCenterOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 24,
  },
  subscriptionSection: {
    gap: 12,
  },
  planLabel: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  upgradeButton: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  upgradeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  manageButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  manageButtonText: {
    color: "#1a1a1a",
    fontSize: 14,
  },
});
