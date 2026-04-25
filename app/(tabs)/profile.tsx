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
 * @file        profile.tsx
 * @description Profile screen file
 * @created     2026-04-24
 * ──────────────────────────────────────────────────────────────
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/presentation/store/authStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  if (!user) {
    return <ActivityIndicator size="large" color="#0066ff" style={{marginTop: 50}} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="user-circle" size={80} color="#0066ff" />
        <Text style={styles.nameText}>{user.name}</Text>
        <Text style={styles.roleText}>{user.role.toUpperCase()}</Text>
        <Text style={{fontSize: 14, color: '#555', marginTop: 10}}>
          <FontAwesome name="phone" size={14} /> {user.phone || 'Nomor tidak tersedia'}
        </Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome name="history" size={20} color="#555" />
          <Text style={styles.menuText}>Riwayat Tugas</Text>
          <FontAwesome name="angle-right" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Keluar Akun</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa', padding: 20 },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
  nameText: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 15 },
  roleText: { fontSize: 14, color: '#888', marginTop: 5, letterSpacing: 1 },

  menuContainer: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 10, elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuText: { flex: 1, marginLeft: 15, fontSize: 16, color: '#333' },

  logoutButton: { backgroundColor: '#ffe6e6', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  logoutText: { color: '#ff4444', fontWeight: 'bold', fontSize: 16 },
});