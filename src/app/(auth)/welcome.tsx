import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import NetInfo from "@react-native-community/netinfo";
import { useToast } from "react-native-toast-notifications";
import { TITLES } from "@/libs/constants";

type Props = {};

const WelcomeScreen = ({ }: Props) => {
  const toast = useToast();
  // const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const handleLoginWithUserType = ({ login_type }: { login_type: string }) => {
    // if (!isConnected) {
    //   toast.show("No internet connection. Please connect to the internet.", {
    //     placement: "top",
    //     data: { type: "danger"},
    //     duration: 2000,
    //   });
    //   toast.hideAll();
    //   return;
    // }
    router.navigate({
      pathname: "/login",
      params: {
        login_type,
      },
    });
  };

  // const handleScanQR = () => {
  //   router.navigate({
  //     pathname: "/(auth)/(offlineQR)/scanQR",
  //   });
  // };

  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener((state) => {
  //     console.log("Connection type:", state.type);
  //     console.log("Is connected?", state.isConnected);
  //     setIsConnected(state.isConnected);
  //   });

  //   return () => unsubscribe(); // Clean up on unmount
  // }, []);

  // if (!isConnected && isConnected !== null) {
  //   toast.show("No internet connection. Please connect to the internet.", {
  //     placement: "top",
  //   });
  // //   return;
  // }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4 items-center justify-around flex-1">
        <View>
          <Text className="text-2xl font-semibold">
            Welcome to {TITLES.APP_NAME} SeQR Scan
          </Text>
        </View>

        <View className="">
          <View>
            <Image
              className="size-72"
              source={require("@/assets/images/logos/splash-icon.png")}
              resizeMode="cover"
            />
          </View>

          {TITLES.SHOW_POWER_BY && (
            <View className="items-center">
              <Text className="text-xs">Powered by</Text>
              <Text className="text-sm text-primary">
                Security Software & Solutions LLP
              </Text>
            </View>
          )}
        </View>

        <View className="gap-4 w-full">
          <Button
            // className="bg-black"
            onPress={() => handleLoginWithUserType({ login_type: "verifier" })}
          >
            <Text>Login as verifier</Text>
          </Button>

          <Button
            // className="bg-gray-600"
            variant={"secondary"}
            onPress={() => handleLoginWithUserType({ login_type: "institute" })}
          >
            <Text>Login as institute</Text>
          </Button>

          {/* {!isConnected && isConnected !== null && (
            <Button onPress={handleScanQR} className="bg-slate-700">
              <Text className="text-white">Scan QR to Verify</Text>
            </Button>
          )} */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
