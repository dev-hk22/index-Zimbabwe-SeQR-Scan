import { useLocalSearchParams, useSearchParams } from 'expo-router/build/hooks';
import React from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
    response: QRResponseItem;
}

const QRResultScreen = () => {
    const params = useLocalSearchParams();
    // const success = params.success === 'true';
    const data = params.data ? JSON.parse(params.data as string) : null;
    const isActive = data?.status === 1;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>

                <View style={styles.header}>
                    <Text style={styles.subtitle}>Scan verification</Text>
                    <Text style={styles.title}>Answer Booklet Details</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Status</Text>
                    <View style={[styles.badge, isActive ? styles.badgeSuccess : styles.badgeError]}>
                        <Text style={[styles.badgeText, isActive ? styles.badgeTextSuccess : styles.badgeTextError]}>
                            {isActive ? 'Active' : 'Inactive'}
                        </Text>
                    </View>
                </View>

                {data && (
                    <>
                        <View style={styles.row}>
                            <Text style={styles.label}>QR data</Text>
                            <Text style={[styles.value, styles.mono]}>{data.qr_data}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Document type</Text>
                            <Text style={styles.value}>{data.metadata1}</Text>
                        </View>

                        {/* <View style={[styles.row, styles.rowLast]}>
                            <Text style={styles.label}>Message</Text>
                            <Text style={styles.value}>{data.message}</Text>
                        </View> */}
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};

export default QRResultScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f2',
        padding: 20,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.1)',
        overflow: 'hidden',
    },
    header: {
        padding: 20,
        paddingBottom: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0,0,0,0.08)',
    },
    subtitle: {
        fontSize: 13,
        color: '#888',
        marginBottom: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        color: '#111',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0,0,0,0.08)',
    },
    rowLast: {
        borderBottomWidth: 0,
    },
    label: {
        fontSize: 14,
        color: '#888',
    },
    value: {
        fontSize: 15,
        fontWeight: '500',
        color: '#111',
        flexShrink: 1,
        textAlign: 'right',
        marginLeft: 16,
    },
    mono: {
        fontFamily: 'Courier',
        fontSize: 14,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeSuccess: {
        backgroundColor: '#eaf6ee',
    },
    badgeError: {
        backgroundColor: '#fdecea',
    },
    badgeText: {
        fontSize: 13,
        fontWeight: '500',
    },
    badgeTextSuccess: {
        color: '#2a7d47',
    },
    badgeTextError: {
        color: '#c0392b',
    },
});