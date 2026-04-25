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
 * @description Tab layout file
 * @created     2026-04-24
 * ──────────────────────────────────────────────────────────────
 */

import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: '#0066ff',
        headerShown: false,
        tabBarStyle: {
          elevation: 5,
          shadowOpacity: 0.1,
          borderTopWidth: 0,
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <FontAwesome name="user-circle" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}