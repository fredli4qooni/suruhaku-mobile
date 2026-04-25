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
 * @file        AuthRemoteDataSource.ts
 * @description Data source for handling remote authentication operations
 * @created     2026-04-24
 * ──────────────────────────────────────────────────────────────
 */

import apiClient from '../../../infrastructure/http/apiClient';

export class AuthRemoteDataSource {
  async login(name: string, phone: string, role: string): Promise<any> {
    try {
      const response = await apiClient.post('/users/login', { name, phone, role });
      
      if (!response.data.success) {
        throw new Error(response.data.error || "Gagal login/daftar");
      }
      return response.data.data;
      
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Jalur API tidak ditemukan (Error 404)");
      }
      throw new Error(error.response?.data?.error || error.message || "Terjadi kesalahan jaringan");
    }
  }
}