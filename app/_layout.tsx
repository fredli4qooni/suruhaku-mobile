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
 * @file        _layout.tsx
 * @description Root layout file
 * @created     2026-04-24
 * ──────────────────────────────────────────────────────────────
 */

import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />

      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen name="create-task" options={{ presentation: 'modal', title: 'Buat Tugas' }} />
      <Stack.Screen name="task/[id]" options={{ title: 'Detail Tugas' }} />
      <Stack.Screen name="manage-task/[id]" options={{ title: 'Kelola Tugas' }} />
      <Stack.Screen name="chat/[id]" options={{ title: 'Chat' }} />
    </Stack>
  );
}