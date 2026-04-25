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
 * @file        create-task.tsx
 * @description Create task screen file
 * @created     2026-04-24
 * ──────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTaskStore } from '../src/presentation/store/taskStore';
import { useAuthStore } from '../src/presentation/store/authStore';

export default function CreateTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  
  const router = useRouter();
  
  const { createTask, isLoading } = useTaskStore();
  const { user } = useAuthStore();

  const handleSubmit = async () => {
    if (!title || !description || !location || !price) {
      Alert.alert('Error', 'Semua kolom wajib diisi!');
      return;
    }

    const success = await createTask({
      title,
      description,
      budget: parseInt(price),
      location,
      customer_id: user?.id,
      status: 'open'
    });

    if (success) {
      Alert.alert('Sukses', 'Tugas berhasil dipublish!');
      router.back();
    } else {
      Alert.alert('Gagal', 'Gagal membuat tugas. Pastikan server menyala.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Buat Tugas Baru</Text>
      <Text style={styles.subTitle}>Apa yang Anda butuhkan bantuan?</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Judul Tugas</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: Angkat Galon ke Lantai 2"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Deskripsi Detail</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Jelaskan detail pekerjaannya..."
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Lokasi</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: Kosan Hijau Kamar 302"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Harga Tawarkan (Rp)</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: 20000"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <TouchableOpacity
          style={styles.btnSubmit}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Publish Tugas Sekarang</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={styles.btnCancel}>
          <Text style={styles.cancelText}>Batal</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginTop: 40 },
  subTitle: { fontSize: 14, color: '#666', marginBottom: 30 },
  form: { marginBottom: 50 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    padding: 12, marginBottom: 20, fontSize: 16
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  btnSubmit: {
    backgroundColor: '#0066ff', padding: 16, borderRadius: 8,
    alignItems: 'center', marginTop: 10
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnCancel: { marginTop: 15, alignItems: 'center' },
  cancelText: { color: '#ff4444' }
});