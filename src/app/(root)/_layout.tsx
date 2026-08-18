import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import Header from "@/components/Header";
import useAuth from "@/hooks/useAuth";
import { TITLES } from "@/libs/constants";

type Props = {};

const RootLayout = ({}: Props) => {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          header: () => (
            <Header
              isLogoVisible
              headerTitle={`${TITLES.APP_NAME} SeQR Docs`}
            />
          ),
        }}
      />

      <Stack.Screen
        name="about"
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          header: () => <Header isBackVisible headerTitle="About Us" />,
        }}
      />

      <Stack.Screen
        name="camera"
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTransparent: true,
        }}
      />

      <Stack.Screen
        name="booklet"
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          header: () => <Header isBackVisible headerTitle="Scanned Details" />,
        }}
      />

      <Stack.Screen
        name="scan-result"
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          header: () => <Header isBackVisible headerTitle="Scanned Details" />,
        }}
      />

      <Stack.Screen
        name="scan-history"
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          header: () => <Header isBackVisible headerTitle="Scanned History" />,
        }}
      />

      <Stack.Screen
        name="scan-history-details"
        options={{
          presentation: "modal",
          // headerShadowVisible: true,
          // headerTitle: "Modal Details",
          // headerBackVisible: false,
          // headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="scan-audit-details"
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          header: () => <Header isBackVisible headerTitle="Scanned Details" />,
        }}
      />

      <Stack.Screen
        name="removeAccount"
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          header: () => <Header isBackVisible headerTitle="Remove Account" />,
        }}
      />
    </Stack>
  );
};

export default RootLayout;
