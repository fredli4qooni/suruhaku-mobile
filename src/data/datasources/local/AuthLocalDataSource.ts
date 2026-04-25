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
 * @file        AuthLocalDataSource.ts
 * @description Data source for handling local authentication operations
 * @created     2026-04-24
 * ──────────────────────────────────────────────────────────────
 */

import { storageService } from '../../../infrastructure/storage/storageService';
import { User } from '../../../domain/entities/User';

export class AuthLocalDataSource {
  async saveUserSession(user: User): Promise<void> {
    await storageService.setItem('user_id', user.id);
    await storageService.setItem('user_name', user.name);
    await storageService.setItem('user_role', user.role);
    await storageService.setItem('user_phone', user.phone);
  }

  async getUserSession(): Promise<User | null> {
    const id = await storageService.getItem('user_id');
    if (!id) return null;

    return {
      id: id,
      name: await storageService.getItem('user_name') || '',
      phone: await storageService.getItem('user_phone') || '',
      role: (await storageService.getItem('user_role')) as 'customer' | 'pesuruh'
    };
  }

  async clearUserSession(): Promise<void> {
    await storageService.removeItem('user_id');
    await storageService.removeItem('user_name');
    await storageService.removeItem('user_role');
    await storageService.removeItem('user_phone');
  }
}