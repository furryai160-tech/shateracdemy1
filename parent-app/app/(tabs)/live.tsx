import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

// Helper to format Date
const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleString('ar-EG', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export default function LiveSessionsScreen() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [sessions, setSessions] = useState<any[]>([]);

    const fetchLiveSessions = async () => {
        if (!user) return;
        try {
            // 1. Get user's enrolled courses
            const { data: enrollments } = await supabase
                .from('Enrollment')
                .select('courseId')
                .eq('userId', user.id);

            if (!enrollments || enrollments.length === 0) {
                setSessions([]);
                return;
            }

            const courseIds = enrollments.map((e) => e.courseId);

            // 2. Fetch live sessions for those courses
            const { data: liveSessions, error } = await supabase
                .from('LiveSession')
                .select(`
          id,
          title,
          description,
          scheduledAt,
          status,
          courseId,
          Course:courseId(title)
        `)
                .in('courseId', courseIds)
                .order('scheduledAt', { ascending: true });

            if (error) throw error;
            setSessions(liveSessions || []);
        } catch (error) {
            console.error('Error fetching live sessions:', error);
        } finally {
            if (!refreshing) setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchLiveSessions();
        }, [user])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchLiveSessions();
        setRefreshing(false);
    };

    if (loading && !refreshing) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#1e3a8a" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1e3a8a']} />}
        >
            <View style={styles.header}>
                <Text style={styles.title}>جدول البث المباشر</Text>
                <Text style={styles.subtitle}>تابع الحصص التفاعلية القادمة للطالب: {user?.name}</Text>
            </View>

            <View style={styles.listContainer}>
                {sessions.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="videocam-off" size={60} color="#cbd5e1" />
                        <Text style={styles.emptyText}>لا توجد حصص بث مباشر مجدولة في الوقت الحالي.</Text>
                    </View>
                ) : (
                    sessions.map((session) => (
                        <View key={session.id} style={[
                            styles.card,
                            session.status === 'LIVE' ? styles.cardLive : session.status === 'ENDED' ? styles.cardEnded : {}
                        ]}>
                            <View style={styles.cardHeader}>
                                <View style={[
                                    styles.statusBadge,
                                    session.status === 'LIVE' ? styles.statusLive : session.status === 'ENDED' ? styles.statusEnded : styles.statusScheduled
                                ]}>
                                    <Text style={[
                                        styles.statusText,
                                        session.status === 'LIVE' ? styles.statusTextLive : session.status === 'ENDED' ? styles.statusTextEnded : styles.statusTextScheduled
                                    ]}>
                                        {session.status === 'LIVE' ? 'مباشر الآن 🔴' : session.status === 'ENDED' ? 'منتهية' : 'مجدولة'}
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.sessionTitle}>{session.title}</Text>
                            {session.Course?.title && (
                                <View style={styles.row}>
                                    <MaterialIcons name="menu-book" size={16} color="#64748b" />
                                    <Text style={styles.courseName}>{session.Course.title}</Text>
                                </View>
                            )}

                            <View style={styles.timeContainer}>
                                <MaterialIcons name="event" size={20} color="#1e3a8a" />
                                <Text style={styles.timeText}>{formatDate(session.scheduledAt)}</Text>
                            </View>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    center: { justifyContent: 'center', alignItems: 'center' },
    header: {
        padding: 24,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 16,
    },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 8, textAlign: 'right' },
    subtitle: { fontSize: 16, color: '#4b5563', textAlign: 'right' },
    listContainer: { padding: 16 },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
    emptyText: { fontSize: 16, color: '#64748b', marginTop: 16, textAlign: 'center' },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#3b82f6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    cardLive: { borderLeftColor: '#ef4444', backgroundColor: '#fef2f2' },
    cardEnded: { borderLeftColor: '#94a3b8', opacity: 0.7 },
    cardHeader: { flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 12 },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    statusScheduled: { backgroundColor: '#dbeafe' },
    statusLive: { backgroundColor: '#fee2e2' },
    statusEnded: { backgroundColor: '#f1f5f9' },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    statusTextScheduled: { color: '#1d4ed8' },
    statusTextLive: { color: '#b91c1c' },
    statusTextEnded: { color: '#475569' },
    sessionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 8, textAlign: 'right' },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 16, gap: 4 },
    courseName: { fontSize: 14, color: '#64748b' },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#f1f5f9',
        padding: 12,
        borderRadius: 12,
        gap: 8,
    },
    timeText: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
});
