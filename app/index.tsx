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
 * @file        index.tsx
 * @description Root screen file
 * @created     2026-04-24
 * ──────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/presentation/store/authStore';

export default function LoginScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer');

  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    if (!name || !phone) { alert("Wajib diisi!"); return; }
    const success = await login(name, phone, role);
    if (success) {
      router.replace('/home');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SuruhAKU</Text>
      <Text style={styles.subtitle}>Masuk atau Daftar</Text>

      <TextInput style={styles.input} placeholder="Nama Lengkap" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Nomor Handphone (08...)" value={phone} keyboardType="phone-pad" onChangeText={setPhone} />

      <View style={styles.roleContainer}>
        <TouchableOpacity style={[styles.roleButton, role === 'customer' && styles.roleActive]} onPress={() => setRole('customer')}>
          <Text style={[styles.roleText, role === 'customer' && styles.roleTextActive]}>Saya Customer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.roleButton, role === 'pesuruh' && styles.roleActive]} onPress={() => setRole('pesuruh')}>
          <Text style={[styles.roleText, role === 'pesuruh' && styles.roleTextActive]}>Saya Pesuruh</Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Masuk / Daftar</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f5f7fa', justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#0066ff', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },

  roleContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  roleButton: { flex: 1, padding: 15, borderWidth: 1, borderColor: '#eee', borderRadius: 10, alignItems: 'center', marginHorizontal: 5, backgroundColor: '#fff' },
  roleActive: { borderColor: '#0066ff', backgroundColor: '#e6f0ff' },
  roleText: { color: '#888', fontWeight: 'bold' },
  roleTextActive: { color: '#0066ff' },

  button: { backgroundColor: '#0066ff', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});