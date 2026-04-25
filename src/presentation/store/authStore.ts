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
 * @file        authStore.ts
 * @description Authentication store initialization
 * @created     2026-04-24
 * ──────────────────────────────────────────────────────────────
 */

import { create } from 'zustand';
import { User } from '../../domain/entities/User';
import { DIContainer } from '../../infrastructure/di/container';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (name: string, phone: string, role: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (name, phone, role) => {
    set({ isLoading: true, error: null });
    try {
      const user = await DIContainer.loginUseCase.execute(name, phone, role);
      set({ user, isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  logout: async () => {
    await DIContainer.logoutUseCase.execute();
    set({ user: null });
  },

  loadSession: async () => {
    set({ isLoading: true });
    const user = await DIContainer.getCurrentUserUseCase.execute();
    set({ user, isLoading: false });
  }
}));