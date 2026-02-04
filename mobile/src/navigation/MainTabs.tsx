import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/HomeScreen";
import { CalendarScreen } from "../screens/CalendarScreen";
import { ChatScreen } from "../screens/ChatScreen";
import { ProfileScreen } from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const tabIcons: Record<string, string> = {
  Home: "✶",
  Calendar: "◈",
  Chat: "✦",
  Profile: "◎",
};

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E1EF",
          height: 72,
          paddingTop: 8,
          paddingBottom: 12,
        },
        tabBarActiveTintColor: "#1A1A1A",
        tabBarInactiveTintColor: "#706E77",
        tabBarLabel: ({ color }) => (
          <Text style={{ color, fontSize: 11, letterSpacing: 1.2, fontFamily: "VeasSans" }}>
            {route.name}
          </Text>
        ),
        tabBarIcon: ({ color }) => (
          <Text style={{ color, fontSize: 14, fontFamily: "VeasSans" }}>
            {tabIcons[route.name]}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
