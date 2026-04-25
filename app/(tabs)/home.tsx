/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║                      FREDLI FOURQONI                         ║
 * ║                    Software Developer                        ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * @author      Fredli Fourqoni
 * @github      https://github.com/fredli4qooni
 * @copyright   Copyright (c) 2026 Fredli Fourqoni. All rights reserved.
 * @license     Apache License, Version 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * ──────────────────────────────────────────────────────────────
 * @file        home.tsx
 * @description Home screen file
 * @created     2026-04-24
 * ──────────────────────────────────────────────────────────────
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/presentation/store/authStore';
import { useTaskStore } from '../../src/presentation/store/taskStore';

export default function HomeScreen() {
  const router = useRouter();
  
  const { user, loadSession } = useAuthStore();
  const { tasks, isLoading, fetchTasks } = useTaskStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks(user.id, user.role);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onRefresh = async () => {
    if (user) {
      setRefreshing(true);
      await fetchTasks(user.id, user.role);
      setRefreshing(false);
    }
  };

  const handleTaskPress = (taskId: string) => {
    if (user?.role === 'customer') {
      router.push(`/manage-task/${taskId}`);
    } else {
      router.push(`/task/${taskId}`);
    }
  };

  if (!user) {
    return <ActivityIndicator size="large" color="#0066ff" style={{flex: 1, justifyContent: 'center'}} />;
  }

  const customerTasks = tasks.filter(t => t.customer_id === user.id);
  const availablePesuruhTasks = tasks.filter(t => t.status === 'open');

  const renderTaskCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => handleTaskPress(item.id)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={[styles.statusBadge, item.status === 'completed' ? styles.bgSuccess : styles.bgWarning]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardBudget}>Rp {item.budget.toLocaleString('id-ID')}</Text>
        <Text style={styles.cardLocation}>📍 {item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Halo, {user.name}!</Text>
        <Text style={styles.roleText}>Mode: {user.role.toUpperCase()}</Text>
      </View>

      <Text style={styles.sectionTitle}>
        {user.role === 'customer' ? 'Tugas Anda' : 'Lowongan Tersedia'}
      </Text>

      {isLoading && !refreshing ? (
         <ActivityIndicator size="small" color="#0066ff" />
      ) : (
        <FlatList
          data={user.role === 'customer' ? customerTasks : availablePesuruhTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTaskCard}
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20, color: '#888'}}>Belum ada tugas saat ini.</Text>}
        />
      )}

      {user.role === 'customer' && (
        <TouchableOpacity style={styles.fab} onPress={() => router.push('/create-task')}>
          <Text style={styles.fabText}>+ Buat Tugas</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa', padding: 20 },
  header: { marginBottom: 20, paddingTop: 30 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  roleText: { fontSize: 14, color: '#0066ff', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, fontSize: 10, fontWeight: 'bold', overflow: 'hidden' },
  bgWarning: { backgroundColor: '#fff3cd', color: '#856404' },
  bgSuccess: { backgroundColor: '#d4edda', color: '#155724' },
  
  cardDesc: { color: '#666', fontSize: 14, marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardBudget: { fontSize: 15, fontWeight: 'bold', color: '#00cc66' },
  cardLocation: { fontSize: 13, color: '#888' },
  
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#0066ff', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 30, elevation: 5 },
  fabText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});