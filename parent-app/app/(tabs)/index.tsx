import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';

import { useFocusEffect } from 'expo-router';

export default function DashboardScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    teachersCount: 0,
    completedLessons: 0,
    totalEnrollments: 0,
  });

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        fetchDashboardData();
      }
    }, [user])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch completed lessons count
      const { data: completedProgs } = await supabase
        .from('LessonProgress')
        .select('*')
        .eq('userId', user?.id)
        .eq('isCompleted', true);

      // 2. Fetch enrollments to calculate teachers count and enrollments count
      const { data: enrollmentsData } = await supabase
        .from('Enrollment')
        .select(`
          courseId,
          Course(
            tenantId
          )
        `)
        .eq('userId', user?.id);

      let teachersSet = new Set();
      if (enrollmentsData) {
        enrollmentsData.forEach((enrollment: any) => {
          if (enrollment.Course?.tenantId) {
            teachersSet.add(enrollment.Course.tenantId);
          }
        });
      }

      setStats({
        teachersCount: teachersSet.size,
        completedLessons: completedProgs ? completedProgs.length : 0,
        totalEnrollments: enrollmentsData ? enrollmentsData.length : 0,
      });

    } catch (error) {
      console.error(error);
    } finally {
      if (!refreshing) setLoading(false);
    }
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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1e3a8a']} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>أهلاً بك يا ولي الأمر</Text>
        <Text style={styles.subtitle}>إليك ملخص نشاط الطالب: {user?.name}</Text>
      </View>

      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <MaterialIcons name="person" size={40} color="#1e3a8a" />
          <Text style={styles.cardNumber}>{stats.teachersCount}</Text>
          <Text style={styles.cardText}>عدد المدرسين المشترك معهم</Text>
        </View>

        <View style={styles.card}>
          <MaterialIcons name="menu-book" size={40} color="#10b981" />
          <Text style={styles.cardNumber}>{stats.totalEnrollments}</Text>
          <Text style={styles.cardText}>عدد الكورسات المشترك بها</Text>
        </View>

        <View style={styles.card}>
          <MaterialIcons name="check-circle" size={40} color="#f59e0b" />
          <Text style={styles.cardNumber}>{stats.completedLessons}</Text>
          <Text style={styles.cardText}>عدد المحاضرات المكتملة مشاهدتها</Text>
        </View>
      </View>
    </ScrollView>
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
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'right',
  },
  cardsContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  cardNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginVertical: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});
