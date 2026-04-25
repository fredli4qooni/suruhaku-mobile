/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║                    FREDLI FOURQONI                           ║
 * ║                  Software Developer                          ║
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
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * ──────────────────────────────────────────────────────────────
 * @file        [id].tsx
 * @description Manage task screen file
 * @created     2026-04-24
 * ──────────────────────────────────────────────────────────────
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTaskStore } from '../../src/presentation/store/taskStore';
import { useAuthStore } from '../../src/presentation/store/authStore';
import { COLORS, TYPOGRAPHY, SPACING } from '../../src/shared/theme';

export default function ManageTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const { user } = useAuthStore();
  const { currentTask, bids, isLoading, getTaskById, getBidsByTask, initiateChat } = useTaskStore();

  useEffect(() => {
    if (id) {
      getTaskById(id);
      getBidsByTask(id);
    }
  }, [id, getTaskById, getBidsByTask]);

  const handleInitiateChat = async (bidId: string) => {
    if (!currentTask) return;
    const chatRoomId = await initiateChat(bidId, currentTask.id);
    if (chatRoomId) {
      router.push(`/chat/${chatRoomId}`);
    } else {
      Alert.alert('Gagal', 'Tidak dapat membuka ruang obrolan saat ini.');
    }
  };

  if (isLoading && !currentTask) {
    return <View style={styles.centerContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  if (!currentTask) {
    return <View style={styles.centerContainer}><Text style={styles.errorText}>Tugas tidak ditemukan.</Text></View>;
  }

  if (user?.id !== currentTask.customer_id) {
    return <View style={styles.centerContainer}><Text style={styles.errorText}>Akses Ditolak. Anda bukan pemilik tugas ini.</Text></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.taskCard}>
        <Text style={styles.taskTitle}>{currentTask.title}</Text>
        <Text style={styles.taskStatus}>Status: {currentTask.status.toUpperCase()}</Text>
        <Text style={styles.taskBudget}>Budget Awal: Rp {currentTask.budget.toLocaleString('id-ID')}</Text>
      </View>

      <Text style={styles.sectionTitle}>Daftar Penawaran Masuk</Text>

      {bids.length === 0 && !isLoading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Belum ada penawaran masuk dari Pesuruh.</Text>
        </View>
      ) : (
        bids.map((bid) => (
          <View key={bid.id} style={styles.bidCard}>
            <View style={styles.bidHeader}>
              <Text style={styles.pesuruhName}>{bid.users?.name || 'Pesuruh Tanpa Nama'}</Text>
              <Text style={[styles.bidStatus, bid.status === 'accepted' ? styles.statusAccepted : bid.status === 'rejected' ? styles.statusRejected : styles.statusPending]}>
                {bid.status.toUpperCase()}
              </Text>
            </View>

            <View style={styles.bidInfoRow}>
              <Text style={styles.bidLabel}>Harga Penawaran:</Text>
              <Text style={styles.bidPrice}>Rp {bid.offer_price.toLocaleString('id-ID')}</Text>
            </View>

            {(bid.status === 'pending' || bid.status === 'negotiating') && (
              <TouchableOpacity style={styles.actionButton} onPress={() => handleInitiateChat(bid.id)} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color={COLORS.surface} size="small" /> : <Text style={styles.actionButtonText}>{bid.status === 'negotiating' ? 'Lanjut Diskusi' : 'Chat & Diskusi'}</Text>}
              </TouchableOpacity>
            )}

            {bid.status === 'accepted' && (
              <TouchableOpacity style={styles.actionButtonSuccess} onPress={() => router.push(`/chat/${currentTask.id}`)}>
                <Text style={styles.actionButtonText}>Buka Ruang Obrolan</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: COLORS.danger, fontSize: TYPOGRAPHY.size.md, fontWeight: 'bold' },
  taskCard: { backgroundColor: COLORS.surface, padding: SPACING.lg, borderRadius: 12, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  taskTitle: { fontSize: TYPOGRAPHY.size.lg, fontWeight: 'bold', color: COLORS.text.primary, marginBottom: SPACING.xs },
  taskStatus: { fontSize: TYPOGRAPHY.size.sm, color: COLORS.warning, fontWeight: 'bold', marginBottom: SPACING.xs },
  taskBudget: { fontSize: TYPOGRAPHY.size.md, color: COLORS.text.secondary },
  sectionTitle: { fontSize: TYPOGRAPHY.size.lg, fontWeight: 'bold', color: COLORS.text.primary, marginBottom: SPACING.md },
  emptyState: { padding: SPACING.xl, alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12 },
  emptyStateText: { color: COLORS.text.secondary, fontStyle: 'italic' },
  bidCard: { backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: 12, marginBottom: SPACING.md, borderLeftWidth: 4, borderLeftColor: COLORS.primary, elevation: 2 },
  bidHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  pesuruhName: { fontSize: TYPOGRAPHY.size.md, fontWeight: 'bold', color: COLORS.text.primary },
  bidStatus: { fontSize: TYPOGRAPHY.size.xs, fontWeight: 'bold', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: 4 },
  statusPending: { backgroundColor: '#fff3cd', color: '#856404' },
  statusAccepted: { backgroundColor: '#d4edda', color: '#155724' },
  statusRejected: { backgroundColor: '#f8d7da', color: '#721c24' },
  bidInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  bidLabel: { color: COLORS.text.secondary, fontSize: TYPOGRAPHY.size.sm },
  bidPrice: { color: COLORS.success, fontSize: TYPOGRAPHY.size.lg, fontWeight: 'bold' },
  actionButton: { backgroundColor: COLORS.primary, paddingVertical: SPACING.sm, borderRadius: 8, alignItems: 'center' },
  actionButtonSuccess: { backgroundColor: COLORS.success, paddingVertical: SPACING.sm, borderRadius: 8, alignItems: 'center' },
  actionButtonText: { color: COLORS.surface, fontSize: TYPOGRAPHY.size.sm, fontWeight: 'bold' },
});