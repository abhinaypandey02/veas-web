import React from "react";
import { Modal, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RevenueCatUI from "react-native-purchases-ui";
import { CustomerInfo } from "react-native-purchases";

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onPurchaseSuccess?: (customerInfo: CustomerInfo) => void;
}

export function PaywallModal({
  visible,
  onClose,
  onPurchaseSuccess,
}: PaywallModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        <RevenueCatUI.Paywall
          onDismiss={onClose}
          onPurchaseCompleted={({ customerInfo }) => {
            onPurchaseSuccess?.(customerInfo);
            onClose();
          }}
          onRestoreCompleted={({ customerInfo }) => {
            onPurchaseSuccess?.(customerInfo);
            onClose();
          }}
          onPurchaseError={(error) => {
            console.error("[RevenueCat] Purchase error:", error);
          }}
          onPurchaseCancelled={onClose}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 18,
    color: "#1a1a1a",
  },
});
