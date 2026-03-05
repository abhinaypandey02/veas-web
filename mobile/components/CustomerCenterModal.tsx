import React from "react";
import { Modal, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RevenueCatUI from "react-native-purchases-ui";

interface CustomerCenterModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CustomerCenterModal({
  visible,
  onClose,
}: CustomerCenterModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <RevenueCatUI.CustomerCenterView onDismiss={onClose} />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
