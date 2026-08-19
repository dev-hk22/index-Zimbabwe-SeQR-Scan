import { View, TouchableOpacity } from "react-native";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";

import { ScanQrCode } from "@/libs/icons/ScanQr";
import { FileClockIcon } from "@/libs/icons/FileClockIcon";
import { ScanBarcodeIcon } from "@/libs/icons/ScanBarcode";
import { BarcodeIcon } from "@/libs/icons/BarcodeIcon";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { BarcodeType } from "expo-camera";
import { TITLES } from "@/libs/constants";

type Props = {};

const HomeScreen = ({}: Props) => {
  const { userDetails } = useUser();

  const goToCameraScanner = (scanner_type: BarcodeType, scan_item?: string) => {
    
    router.navigate({
      pathname: '/(root)/camera',
      params: {
        scanner_type: scanner_type,
        scan_item: scan_item,
      },
    });
  };

  return (
    <View className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-4xl font-medium">
          Welcome,{" "}
          <Text className="font-bold text-3xl">
            {userDetails?.fullname || userDetails?.institute_username}
          </Text>
        </Text>
      </View>

      <View className="p-4 flex-row items-center justify-between flex-wrap gap-2 xs:gap-3">
        <TouchableOpacity
          onPress={() => goToCameraScanner("qr")}
          className="w-[48%]"
        >
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Scan Certificates</CardTitle>
              <CardDescription>Scan and view certificates</CardDescription>
            </CardHeader>
            <CardContent className="gap-2">
              <ScanQrCode
                className="text-primary"
                // style={{ borderColor: "#eeb114" }}
                height={"35"}
                width={"35"}
              />
              <Text className="text-lg font-medium">Scan QR code</Text>
            </CardContent>
          </Card>
        </TouchableOpacity>
        {userDetails?.institute_username && (
          <>
            <TouchableOpacity
              onPress={() => goToCameraScanner("code39")}
              className="w-[48%]"
            >
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Scan audit trails</CardTitle>
                  <CardDescription>Scan and view audit trials</CardDescription>
                </CardHeader>
                <CardContent className="gap-2">
                  <BarcodeIcon
                    className="text-primary"
                    height={"35"}
                    width={"35"}
                  />
                  <Text className="text-lg font-medium">Scan audit trails</Text>
                </CardContent>
              </Card>
            </TouchableOpacity>
            {TITLES?.SHOW_ANSWER_BOOKLET && (
              <TouchableOpacity
                onPress={() => goToCameraScanner("qr" , "answer_booklet")}
                className="w-[48%]"
              >
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Scan answer booklet</CardTitle>
                    <CardDescription>
                      Scan and view answer booklet
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="gap-2">
                    <ScanBarcodeIcon
                      className="text-primary"
                      height={"35"}
                      width={"35"}
                    />
                    <Text className="text-lg font-medium">
                      Scan answer booklet
                    </Text>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            )}
          </>
        )}
        {!userDetails?.institute_username && (
          <TouchableOpacity
            onPress={() => router.navigate("/scan-history")}
            className="w-[48%]"
          >
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Scanned history</CardTitle>
                <CardDescription>
                  View recently scanned documents
                </CardDescription>
              </CardHeader>
              <CardContent className="gap-2">
                <FileClockIcon
                  className="text-primary"
                  height={"35"}
                  width={"35"}
                />
                <Text className="text-lg font-medium">View history</Text>
              </CardContent>
            </Card>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default HomeScreen;
