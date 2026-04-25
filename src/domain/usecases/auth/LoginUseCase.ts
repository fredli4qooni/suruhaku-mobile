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
 * @file        LoginUseCase.ts
 * @description Login use case
 * @created     2026-04-24
 * ──────────────────────────────────────────────────────────────
 */

import { IAuthRepository } from '../../repositories/IAuthRepository';
import { User } from '../../entities/User';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(name: string, phone: string, role: string): Promise<User> {
    if (!name || !phone) throw new Error("Nama dan Nomor HP wajib diisi");
    return await this.authRepository.login(name, phone, role);
  }
}