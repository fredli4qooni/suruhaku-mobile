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
 * @description Task detail screen file
 * @created     2026-04-24
 * ──────────────────────────────────────────────────────────────
 */

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTaskStore } from '../../src/presentation/store/taskStore';
import { useAuthStore } from '../../src/presentation/store/authStore';
import { COLORS, TYPOGRAPHY, SPACING } from '../../src/shared/theme';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const { user } = useAuthStore();
  const { currentTask, isLoading, getTaskById, submitBid } = useTaskStore();
  const [offerPrice, setOfferPrice] = useState<string>('');

  useEffect(() => {
    if (id) {
      getTaskById(id);
    }
  }, [id, getTaskById]);

  useEffect(() => {
    if (currentTask) {
      setOfferPrice(currentTask.budget.toString());
    }
  }, [currentTask]);

  const handleBidSubmit = async () => {
    if (!user || !currentTask) return;
    if (Number(offerPrice) <= 0) {
      Alert.alert('Error', 'Harga penawaran tidak valid!');
      return;
    }

    const success = await submitBid(currentTask.id, user.id, Number(offerPrice));
    if (success) {
      Alert.alert('Sukses!', 'Tawaran berhasil dikirim! Tunggu balasan di menu Chat.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  };

  if (isLoading && !currentTask) {
    return <View style={styles.centerContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  if (!currentTask) {
    return <View style={styles.centerContainer}><Text style={styles.errorText}>Tugas tidak ditemukan.</Text></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>{currentTask.title}</Text>
        <Text style={styles.statusBadge}>Status: {currentTask.status.toUpperCase()}</Text>
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Deskripsi</Text>
        <Text style={styles.description}>{currentTask.description}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Lokasi:</Text>
          <Text style={styles.infoValue}>{currentTask.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Budget Awal:</Text>
          <Text style={styles.budgetHighlight}>Rp {currentTask.budget.toLocaleString('id-ID')}</Text>
        </View>
      </View>

      {user?.role === 'pesuruh' && currentTask.status === 'open' && (
        <View style={styles.bidSection}>
          <Text style={styles.bidTitle}>Ajukan Penawaran Anda</Text>
          <Text style={styles.bidSubtitle}>Sesuaikan harga dengan estimasi biaya di lapangan.</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencyPrefix}>Rp</Text>
            <TextInput style={styles.input} value={offerPrice} onChangeText={setOfferPrice} keyboardType="numeric" placeholder="0" />
          </View>
          <TouchableOpacity style={[styles.submitButton, isLoading && styles.submitButtonDisabled]} onPress={handleBidSubmit} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color={COLORS.surface} /> : <Text style={styles.submitButtonText}>Kirim Tawaran</Text>}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: COLORS.danger, fontSize: TYPOGRAPHY.size.md },
  card: { backgroundColor: COLORS.surface, padding: SPACING.lg, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.lg },
  title: { fontSize: TYPOGRAPHY.size.xl, fontWeight: 'bold', color: COLORS.text.primary, marginBottom: SPACING.xs },
  statusBadge: { fontSize: TYPOGRAPHY.size.sm, color: COLORS.warning, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  sectionTitle: { fontSize: TYPOGRAPHY.size.md, fontWeight: 'bold', color: COLORS.text.primary, marginBottom: SPACING.xs },
  description: { fontSize: TYPOGRAPHY.size.md, color: COLORS.text.secondary, marginBottom: SPACING.md, lineHeight: 22 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  infoLabel: { fontSize: TYPOGRAPHY.size.md, color: COLORS.text.secondary },
  infoValue: { fontSize: TYPOGRAPHY.size.md, color: COLORS.text.primary, fontWeight: '500' },
  budgetHighlight: { fontSize: TYPOGRAPHY.size.lg, color: COLORS.success, fontWeight: 'bold' },
  bidSection: { backgroundColor: COLORS.surface, padding: SPACING.lg, borderRadius: 12, borderWidth: 1, borderColor: COLORS.primary },
  bidTitle: { fontSize: TYPOGRAPHY.size.lg, fontWeight: 'bold', color: COLORS.primary, marginBottom: SPACING.xs },
  bidSubtitle: { fontSize: TYPOGRAPHY.size.sm, color: COLORS.text.secondary, marginBottom: SPACING.md },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingHorizontal: SPACING.md, marginBottom: SPACING.lg },
  currencyPrefix: { fontSize: TYPOGRAPHY.size.lg, fontWeight: 'bold', color: COLORS.text.primary, marginRight: SPACING.xs },
  input: { flex: 1, fontSize: TYPOGRAPHY.size.lg, paddingVertical: SPACING.md, color: COLORS.text.primary },
  submitButton: { backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: 8, alignItems: 'center' },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: { color: COLORS.surface, fontSize: TYPOGRAPHY.size.md, fontWeight: 'bold' },
});