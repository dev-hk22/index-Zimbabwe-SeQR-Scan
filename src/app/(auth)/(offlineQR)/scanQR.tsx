import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import pako from "pako";
import { decode as atob, encode as btoa } from "base-64";
import { CameraView, FlashMode, useCameraPermissions } from "expo-camera";
import BarcodeMask from "@meksiabdou/react-native-barcode-mask";
import { decryptAES } from "../../../libs/decryptAES";
import { useToast } from "react-native-toast-notifications";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { cleanBase64 } from "@/libs/constants";
import { parseKeysAndValues } from "@/libs/utils";
type Props = {};

const scanQR = (props: Props) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<FlashMode | undefined>("off");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [otherData, setOtherData] = useState<object | null>(null);
  const toast = useToast();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (otherData && imageUri) {
      const sanitized = JSON.stringify(otherData).replace(/^"(.*)"$/, "$1");
      const verifiedUser = parseKeysAndValues(sanitized);
      if (verifiedUser) {
        router.replace({
          pathname: "/(auth)/(offlineQR)/offline-userData",
          params: {
            imageUri,
            otherData: JSON.stringify(otherData),
          },
        });
      }else{
        router.back()
      }

    }
  }, [otherData, imageUri]);


  if (!permission) {
    return (
      <Text className="text-base color-black text-center">
        Please Give Permission Before Accessing Camera
      </Text>
    );
  }


  if (!permission.granted) {
    return (
      <View className="flex-1 px-2 justify-center gap-2 bg-white">
        <Text className="text-base color-black text-center">
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          className="border rounded-lg py-2 px-2 bg-blue-500 self-center"
          onPress={requestPermission}
        >
          <Text className="text-base color-white text-center font-semibold">
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeData = async (barcodeData: any) => {
    if (scanned) return
    setScanned(true);
    if (barcodeData?.data) {
      let rawData = barcodeData?.data || "";
      const cleanedData = cleanBase64(rawData);
      try {
        if (cleanedData) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          const decryptedData = await decryptAES(cleanedData);
          if (!decryptedData) {
            throw new Error("Decryption failed: Empty or invalid result");
          }

          const qrData = JSON.parse(decryptedData);
          const { image, other_data: user_info } = qrData;

          if (image) {
            const compressedData = atob(image);
            const compressedArray = new Uint8Array(
              compressedData.split("").map((char) => char.charCodeAt(0))
            );
            const decompressedData = pako.ungzip(compressedArray);
            const base64Image = btoa(
              new Uint8Array(decompressedData).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            );
            const imageUri = `data:image/png;base64,${base64Image}`;
            // console.log("Image URI:", imageUri.substring(0, 100) + "...");
            setImageUri(imageUri);
          }

          if (user_info) {
            const compressedOtherData = atob(user_info);
            const compressedOtherArray = new Uint8Array(
              compressedOtherData.split("").map((char) => char.charCodeAt(0))
            );
            const decompressedOtherData = pako.ungzip(compressedOtherArray);
            const decodedOtherDataString = new TextDecoder().decode(
              decompressedOtherData
            );
            // console.log("Decoded other data string:", decodedOtherDataString);
            const decodedOtherData = JSON.parse(decodedOtherDataString);
            setOtherData(decodedOtherData);
            // console.log("Parsed other data:", decodedOtherData);
          }
        }
      } catch (error) {
        console.log("Error processing QR code data:", error);
        // Show alert dialog
        console.error("JSON Parse Error:", error);
        Alert.alert(
          "Invalid QR Code",               // Title
          "The scanned QR code is not valid.", // Message
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: true }
        );
      } finally {
        setTimeout(() => setScanned(false), 2000); // Allow rescan after 2 seconds
      }
    } else {
      setTimeout(() => setScanned(false), 2000); // Allow rescan after 2 seconds if no data
    }
  };

  return (
    <View className="flex-1 justify-center">
      <CameraView
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        style={{ flex: 1, position: "relative" }}
        onBarcodeScanned={handleBarCodeData}
        autofocus="on"
        pictureSize="high" // High resolution for better detailr
        // ratio="16:9" // Modern aspect ratio
        zoom={0.22} // Slight zoom to focus on QR codes
        focusable={true}
        flash={flash}
      >
        <BarcodeMask
          width={300}
          height={300}
          showAnimatedLine={false}
          edgeRadius={8}
          outerMaskOpacity={0.6}
        />
      </CameraView>
    </View>
  );
};

export default scanQR;

const styles = StyleSheet.create({});
