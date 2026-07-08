import { router, useNavigation } from 'expo-router';
import React from 'react';
import { Text, View, TouchableOpacity, Dimensions, ScrollView } from 'react-native';

type PrintDetail = {
    barcode: string;
    userPrinted: string;
    printedDate: string;
    printedTime: string;
    printerUsed: string;
    printCount: number;
    status: string;
};

type Props = {
    printDetailsAvailable: boolean;
    data?: PrintDetail | null;
};

const { width } = Dimensions.get('window');

const PrintDetailsCard: React.FC<Props> = ({ printDetailsAvailable, data }) => {
console.log(printDetailsAvailable,"printDetailsAvailable");

    if (!printDetailsAvailable && data?.status == '1') {
        return (
            <View className="flex-1 justify-center items-center px-6 py-10">
                <View className="bg-white p-6 rounded-2xl shadow-md w-full max-w-xl">
                    <Text className="text-xl text-gray-700 text-center mb-3">
                        In order to view the printing details,
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.navigate('InstituteAuditScanScreen' as never)}
                    >
                        <Text className="text-blue-600 text-lg font-semibold text-center underline">
                            Click here
                        </Text>
                    </TouchableOpacity>
                    <Text className="text-xl text-gray-700 text-center mt-3">
                        and scan the 1D barcode.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
            <View
                className="bg-white p-6 rounded-2xl shadow-xl"
                style={{
                    minHeight: 400,
                    width: width - 32,
                    alignSelf: 'center',
                }}
            >
                {/* <Text className="text-2xl font-bold text-center mb-4 text-gray-800">
                    Print Details
                </Text> */}

                <DetailRow label="Barcode" value={data?.barcode} />
                <DetailRow label="User Printed" value={data?.userPrinted} />
                <DetailRow label="Printed Date" value={data?.printedDate} />
                <DetailRow label="Printed Time" value={data?.printedTime} />
                <DetailRow label="Printer Used" value={data?.printerUsed} />
                <DetailRow label="Print Count" value={String(data?.printCount)} />
                <DetailRow label="Status" value={data?.status == '1' ? 'Active' : 'InActive'} />
            </View>
        </ScrollView>
    );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <View className="flex-row justify-between items-start py-3 border-b border-gray-200">
        <Text className="text-[18px] font-semibold text-gray-700 w-1/2">{label}:</Text>
        <Text className={`text-[18px] text-gray-600 w-1/2 text-right ${label == "Status" ? value == 'Active' && 'text-green-600' : 'text-gray-600'}`}>{value}</Text>
    </View>
);

export default PrintDetailsCard;
