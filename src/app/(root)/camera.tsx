import { ActivityIndicator, Platform, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";

import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
  BarcodeType,
} from "expo-camera";
import { Button } from "@/components/ui/button";
import {
  router,
  useIsFocused,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import BarcodeMask from "@meksiabdou/react-native-barcode-mask";

import * as Haptics from "expo-haptics";
import axiosInstance from "@/utils/axiosInstance";
import {
  SCAN_ANSWER_BOOKLET,
  SCAN_AUDIT_TRIALS,
  SCAN_INSTITUTE_CERT,
  SCAN_VERIFIER_CERT,
} from "@/utils/routes";
import useUser from "@/hooks/useUser";
import { useToast } from "react-native-toast-notifications";
import axios from "axios";
import { storage } from "@/utils/storageService";

type Props = {};

const CameraScreen = ({}: Props) => {
  const { userDetails } = useUser();
  const [scanned, setScanned] = useState<boolean>(false);
  const [isFetchingScannedData, setIsFetchingScannedData] =
    useState<boolean>(false);
  const [permission, requestPermission] = useCameraPermissions();
  const toast = useToast();
  const { scanner_type, scan_item } = useLocalSearchParams<{
    scanner_type: BarcodeType;
    scan_item: string;
  }>();
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loginType = storage.getString("login_type");

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isFocused) {
      cameraRef.current?.resumePreview();
      setScanned(false); // Reset scanned state when focused
    } else {
      cameraRef.current?.pausePreview();
    }
    navigation.setOptions({
      header: () => (
        <Header
          isBackVisible
          headerTitle={scanner_type === "code39" ? "Scan Barcode" : "Scan QR"}
        />
      ),
    });
  }, [isFocused, scanner_type]);

  const handleBarCodeScanned = (barcodeData: BarcodeScanningResult) => {
    if (scanned || !barcodeData || isFetchingScannedData) return;

    setScanned(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    showScannedResult(barcodeData);
    cameraRef.current?.pausePreview();
  };

  const showScannedResult = async (barcodeData: BarcodeScanningResult) => {
    setIsFetchingScannedData(true);

    try {
      const formatBarcodeData = barcodeData.data
        .split("\n")
        .filter((line) => line.trim() !== "");
      const sanitizeBarcodeData = formatBarcodeData.pop() || "";
      const otherBarcodeData = formatBarcodeData.join("\n");

      const scannedFormData = new FormData();
      const scannedBy = String(
        userDetails?.username ?? userDetails?.institute_username ?? "",
      );
      const userId = String(userDetails?.id ?? "");

      scannedFormData.append("device_type", Platform.OS);
      scannedFormData.append("scanned_by", scannedBy);
      scannedFormData.append("user_id", userId);
      scannedFormData.append("key", sanitizeBarcodeData);

      if (scan_item) {
        scannedFormData.append("user_type", "1");
      }

      const response = await axiosInstance.post(
        scanner_type === "code39"
          ? SCAN_AUDIT_TRIALS
          : loginType === "verifier"
            ? SCAN_VERIFIER_CERT
            : scan_item == "answer_booklet"
              ? SCAN_ANSWER_BOOKLET
              : SCAN_INSTITUTE_CERT,
        scannedFormData,
      );

      if (!response.data.success) {
        resetCameraAfterDelay();
        toast.show(response.data?.data?.message || response.data?.message, {
          data: response.data,
        });
        return;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (scanner_type === "code39") {
        router.navigate({
          pathname: "/scan-audit-details",
          params: {
            scanned_results: JSON.stringify(response.data?.data),
            qr_data: otherBarcodeData,
          },
        });
      } else if (scan_item === "answer_booklet") {
        router.navigate({
          pathname: "/booklet",
          params: {
            success: String(response?.data?.success),
            data: JSON.stringify(response?.data?.data),
          },
        });
      } else {
        router.navigate({
          pathname: "/scan-result",
          params: {
            scanned_results: JSON.stringify(response.data?.data),
            qr_data: otherBarcodeData,
            qr_type: scanner_type,
          },
        });
      }
    } catch (error) {
      if (axios.isAxiosError<IServerError>(error)) {
        const errorMessage =
          error.response?.data?.data?.message || "An error occurred";
        toast.show(errorMessage, {
          data: error.response?.data?.data,
        });
      }
      resetCameraAfterDelay();
    } finally {
      setIsFetchingScannedData(false);
    }
  };

  const resetCameraAfterDelay = (delay = 2000) => {
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }

    scanTimeoutRef.current = setTimeout(() => {
      setScanned(false);
      if (isFocused) {
        cameraRef.current?.resumePreview();
      }
    }, delay);
  };

  if (!permission) {
    return <View className="flex-1 bg-stone-900" />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-stone-900 px-6 gap-4">
        <Text className="text-white text-center text-base">
          We need to access your camera to scan your document's / certificate's
          QR Code
        </Text>
        <Button onPress={requestPermission}>
          <Text>Continue</Text>
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 justify-center bg-black">
      {scanner_type && (
        <CameraView
          ref={cameraRef}
          style={{ flex: 1, position: "relative" }}
          barcodeScannerSettings={{
            barcodeTypes: [scanner_type],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
      )}
      <BarcodeMask
        width={300}
        height={scanner_type == "qr" ? 300 : 100}
        showAnimatedLine={false}
        edgeRadius={8}
        outerMaskOpacity={0.6}
      />

      {isFetchingScannedData && (
        <View className="absolute top-3/4 left-0 right-0 items-center">
          <View className="flex-row items-center gap-2 bg-black/40 px-4 py-3 rounded-lg">
            <ActivityIndicator size="small" color="#237fc5" />
            <Text className="text-white">
              Scanning your {scanner_type} data. Please wait...
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default CameraScreen;
