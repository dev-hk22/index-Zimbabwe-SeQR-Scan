import {
  FlatList,
  Linking,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Pdf from "react-native-pdf";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/libs/utils";
import { Separator } from "./ui/separator";
import Hyperlink from "react-native-hyperlink";
import ReactNativeBlobUtil from "react-native-blob-util";

type Props = {
  scannedResults: IVerifierCertificate & IScanHistoryData;
  barcodeData?: string | string[];
  setPagerScrollEnabled?: (enabled: boolean) => void;
};

const MIN_COLUMN_WIDTHS = [180, 180];

const ViewCertificate = ({
  scannedResults,
  barcodeData,
  setPagerScrollEnabled,
}: Props) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // console.log(scannedResults?.fileUrl,"scannedResults");
  // console.log(scannedResults?.pdf_url, "barcodeData---");

  const columnWidths = useMemo(() => {
    return MIN_COLUMN_WIDTHS.map((minWidth) => {
      const evenWidth = width / MIN_COLUMN_WIDTHS.length;
      return evenWidth > minWidth ? evenWidth : minWidth;
    });
  }, [width]);

  // console.log(scannedResults.pdf_url, "scannedResults.fileUrl");
  const [pdfPath, setPdfPath] = useState<string | null>(null);

  useEffect(() => {
    const download = async () => {
      const path = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/test.pdf`;
      const url = (scannedResults.fileUrl || scannedResults.pdf_url).replace(
        /\\/g,
        "/",
      );
      const res = await ReactNativeBlobUtil.fetch("GET", url);

      await ReactNativeBlobUtil.fs.writeFile(path, res.base64(), "base64");

      setPdfPath(`file://${path}`);
    };

    download();
  }, []);

  console.log(pdfPath, "pdfPath");

  return (
    <View className="flex-1">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Document</CardTitle>
          <CardDescription>Document overview</CardDescription>
        </CardHeader>
        <CardContent>
          <Text className="text-base xs:text-lg">
            Document ID:{" "}
            <Text className="font-semibold">
              {scannedResults.serialNo ||
                scannedResults.serial_no ||
                scannedResults.document_id}
            </Text>
          </Text>
          <Text className="text-base xs:text-lg">
            Status:{" "}
            <Text className="font-semibold">
              {parseInt(scannedResults.status) != 0 ? "Active" : "In Active"}
            </Text>
          </Text>
          {/* {barcodeData && (
            <Text className="text-base xs:text-lg">
              Data: <Text className="font-semibold">{barcodeData}</Text>
            </Text>
          )} */}
          {barcodeData?.toString().includes("http") && (
            <View>
              <Text className="text-base xs:text-lg">Data:</Text>
              <Hyperlink
                linkStyle={{
                  color: "#2563eb",
                  fontWeight: "600",
                  textDecorationLine: "underline",
                }}
                onPress={(url) => Linking.openURL(url)}
              >
                <Text className="text-gray-800 text-base leading-6">
                  {barcodeData
                    ?.toString()
                    .split("\n")
                    .find((line) => line.includes("http")) ?? ""}
                </Text>
              </Hyperlink>
            </View>
          )}
        </CardContent>
      </Card>

      {scannedResults.verification_type != 1 ||
      scannedResults.document_status ? (
        <View
          className="flex-1 my-4"
          onStartShouldSetResponder={() => {
            // Disable pager scroll when user starts interacting with PDF
            setPagerScrollEnabled?.(false);
            return false; // Don't block children from handling the event
          }}
          onResponderRelease={() => {
            // Re-enable pager scroll when user stops interacting
            setPagerScrollEnabled?.(true);
            return true;
          }}
        >
          <Pdf
            trustAllCerts={false}
            source={{
              uri:
                pdfPath ?? (scannedResults.fileUrl || scannedResults?.pdf_url),
              cache: false,
              headers: {
                Accept: "application/pdf",
              },
            }}
            onError={(error) => {
              console.log(error, "PDF_ERROR");
            }}
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              backgroundColor: "#FFF",
            }}
          />
        </View>
      ) : (
        <ScrollView
          bounces={false}
          showsHorizontalScrollIndicator={false}
          className="py-4"
        >
          <Text className="text-2xl text-card-foreground font-semibold leading-none tracking-tight">
            Verification Details
          </Text>
          <Separator className="my-2" />
          <Table aria-labelledby="invoice-table">
            <TableHeader>
              <TableRow>
                <TableHead
                  className="px-0.5"
                  style={{ width: columnWidths[0] }}
                >
                  <Text className="font-medium">Name</Text>
                </TableHead>
                <TableHead style={{ width: columnWidths[1] }}>
                  <Text className="font-medium">Decrypted Value</Text>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <FlatList
                scrollEnabled={false}
                data={scannedResults.text_verification}
                contentContainerStyle={{
                  paddingBottom: insets.bottom,
                }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                  return (
                    <TableRow
                      key={item.id}
                      className={cn(index % 2 && "bg-muted/40 ")}
                    >
                      <TableCell style={{ width: columnWidths[0] }}>
                        <Text>{item.name}</Text>
                      </TableCell>
                      <TableCell style={{ width: columnWidths[1] }}>
                        <Text>{item.decrypted_value}</Text>
                      </TableCell>
                    </TableRow>
                  );
                }}
              />
            </TableBody>
          </Table>
        </ScrollView>
      )}
    </View>
  );
};

export default ViewCertificate;
