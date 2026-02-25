import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';

import { useFocusEffect } from 'expo-router';

export default function CoursesScreen() {
    const { user } = useAuth();
    const [coursesInfo, setCoursesInfo] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            if (user) {
                fetchCoursesProgress();
            }
        }, [user])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchCoursesProgress();
        setRefreshing(false);
    };

    const fetchCoursesProgress = async () => {
        try {
            // 1. Fetch all enrollments with Course, Teacher (Tenant), and Lessons count
            const { data: enrollmentsData } = await supabase
                .from('Enrollment')
                .select(`
          courseId,
          Course (
            title,
            price,
            Lesson ( id ),
            Tenant ( name )
          )
        `)
                .eq('userId', user?.id);

            // 2. Fetch all completed lessons for this user
            const { data: completedLessons } = await supabase
                .from('LessonProgress')
                .select('lessonId')
                .eq('userId', user?.id)
                .eq('isCompleted', true);

            // Create a set for quick lookup of watched lessons
            const completedSet = new Set(completedLessons?.map((cl: any) => cl.lessonId));

            let coursesProgressList: any[] = [];

            if (enrollmentsData) {
                enrollmentsData.forEach((enrollment: any) => {
                    const course = enrollment.Course;
                    if (!course) return;

                    const lessons = course.Lesson || [];
                    const totalLessons = lessons.length;

                    let watchedCount = 0;
                    lessons.forEach((lesson: any) => {
                        if (completedSet.has(lesson.id)) {
                            watchedCount++;
                        }
                    });

                    coursesProgressList.push({
                        id: enrollment.courseId,
                        title: course.title,
                        teacherName: course.Tenant?.name || 'غير محدد',
                        price: course.price,
                        watched: watchedCount,
                        total: totalLessons
                    });
                });
            }

            setCoursesInfo(coursesProgressList);

        } catch (error) {
            console.error(error);
        } finally {
            if (!refreshing) setLoading(false);
        }
    };

    const renderCourse = ({ item }: { item: any }) => {
        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.title}>{item.title}</Text>
                    <MaterialIcons name="local-library" size={28} color="#1e3a8a" />
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.value}>{item.teacherName}</Text>
                    <Text style={styles.label}>اسم المعلم:</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.value}>{item.price} ج.م</Text>
                    <Text style={styles.label}>السعر:</Text>
                </View>

                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        شاهد {item.watched} من {item.total} محاضرة
                    </Text>
                    <View style={styles.progressBarBg}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: item.total > 0 ? `${(item.watched / item.total) * 100}%` : '0%' }
                            ]}
                        />
                    </View>
                </View>
            </View>
        );
    };

    if (loading && !refreshing) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#1e3a8a" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>الكورسات والمحاضرات</Text>

            {coursesInfo.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="menu-book" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>لم يشترك الطالب في أي كورسات بعد</Text>
                </View>
            ) : (
                <FlatList
                    data={coursesInfo}
                    keyExtractor={(item) => item.id}
                    renderItem={renderCourse}
                    contentContainerStyle={{ padding: 16 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1e3a8a']} />}
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
        fontSize: 20,
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
        width: 80,
        textAlign: 'right',
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    progressContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    progressText: {
        fontSize: 16,
        color: '#1e3a8a',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    progressBarBg: {
        height: 10,
        backgroundColor: '#e5e7eb',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#10b981',
        borderRadius: 5,
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
