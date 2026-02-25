import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

export default function ExamsScreen() {
    const { user } = useAuth();
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            if (user) {
                fetchExams();
            }
        }, [user])
    );

    const fetchExams = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('QuizResult')
                .select(`
          id,
          score,
          passed,
          createdAt,
          Quiz (
            title
          )
        `)
                .eq('userId', user?.id)
                .order('createdAt', { ascending: false });

            if (data) {
                setExams(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderExam = ({ item }: { item: any }) => {
        const isPassed = item.passed;
        const formattedDate = new Date(item.createdAt).toLocaleDateString('ar-EG');

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.title}>{item.Quiz?.title || 'امتحان'}</Text>
                    <MaterialIcons
                        name={isPassed ? "check-circle" : "cancel"}
                        size={24}
                        color={isPassed ? "#10b981" : "#ef4444"}
                    />
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.value}>{item.score}%</Text>
                    <Text style={styles.label}>الدرجة:</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.value}>{isPassed ? 'ناجح' : 'راسب'}</Text>
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
            <Text style={styles.screenTitle}>نتائج الامتحانات</Text>

            {exams.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="assignment-late" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>لم يقم الطالب بأداء أي امتحانات بعد</Text>
                </View>
            ) : (
                <FlatList
                    data={exams}
                    keyExtractor={(item) => item.id}
                    renderItem={renderExam}
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
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e3a8a',
        textAlign: 'center',
        marginVertical: 16,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        paddingBottom: 12,
        marginBottom: 12,
    },
    title: {
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
