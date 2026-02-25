import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

export default function WalletScreen() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [balance, setBalance] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            if (user) {
                fetchWalletData();
            }
        }, [user])
    );

    const fetchWalletData = async () => {
        try {
            setLoading(true);
            // Fetch latest balance
            const { data: userData } = await supabase
                .from('User')
                .select('walletBalance')
                .eq('id', user?.id)
                .single();

            if (userData) {
                setBalance(userData.walletBalance || 0);
            }

            // Fetch transaction history
            const { data: txData } = await supabase
                .from('WalletTransaction')
                .select('*')
                .eq('userId', user?.id)
                .order('createdAt', { ascending: false });

            if (txData) {
                setTransactions(txData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getTransactionTypeLabel = (type: string) => {
        return type === 'DEPOSIT' ? 'شحن محفظة' : 'شراء كورس';
    };

    const getTransactionStatusLabel = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'مقبول';
            case 'REJECTED': return 'مرفوض';
            case 'PENDING': return 'قيد الانتظار';
            default: return status;
        }
    };

    const getTransactionIcon = (type: string) => {
        return type === 'DEPOSIT' ? 'arrow-circle-up' : 'arrow-circle-down';
    };

    const getTransactionColor = (type: string, status: string) => {
        if (status === 'REJECTED') return '#ef4444'; // Red
        if (type === 'DEPOSIT' && status === 'APPROVED') return '#10b981'; // Green
        if (type === 'PURCHASE') return '#f59e0b'; // Amber
        return '#6b7280'; // Gray for pending or other
    };

    const renderTransaction = ({ item }: { item: any }) => {
        const formattedDate = new Date(item.createdAt).toLocaleDateString('ar-EG');
        const color = getTransactionColor(item.type, item.status);

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.row}>
                        <Text style={[styles.title, { color }]}>{getTransactionTypeLabel(item.type)}</Text>
                        <MaterialIcons
                            name={getTransactionIcon(item.type)}
                            size={24}
                            color={color}
                            style={{ marginLeft: 8 }}
                        />
                    </View>
                    <Text style={styles.amount}>{item.amount} ج.م</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.value}>{getTransactionStatusLabel(item.status)}</Text>
                    <Text style={styles.label}>الحالة:</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.value}>{formattedDate}</Text>
                    <Text style={styles.label}>التاريخ:</Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#1e3a8a" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>رصيد المحفظة</Text>
                <Text style={styles.balanceAmount}>{balance} ج.م</Text>
            </View>

            <Text style={styles.screenTitle}>سجل العمليات</Text>

            {transactions.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="history" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>لا يوجد عمليات سابقة</Text>
                </View>
            ) : (
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item.id}
                    renderItem={renderTransaction}
                    contentContainerStyle={{ padding: 16 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    balanceContainer: {
        backgroundColor: '#1e3a8a',
        padding: 32,
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#1e3a8a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    balanceLabel: {
        fontSize: 18,
        color: '#93c5fd',
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
    },
    screenTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 8,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        paddingBottom: 12,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        color: '#4b5563',
        marginLeft: 8,
        width: 60,
        textAlign: 'right',
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 18,
        color: '#6b7280',
    },
});
