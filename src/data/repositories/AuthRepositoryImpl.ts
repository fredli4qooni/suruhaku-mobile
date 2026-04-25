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
 * @file        AuthRepositoryImpl.ts
 * @description Implementation of authentication repository
 * @created     2026-04-24
 * ──────────────────────────────────────────────────────────────
 */

import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';
import { AuthRemoteDataSource } from '../datasources/remote/AuthRemoteDataSource';
import { AuthLocalDataSource } from '../datasources/local/AuthLocalDataSource';
import { toUserEntity } from '../models/UserModel';

export class AuthRepositoryImpl implements IAuthRepository {
  private remoteDataSource: AuthRemoteDataSource;
  private localDataSource: AuthLocalDataSource;

  constructor() {
    this.remoteDataSource = new AuthRemoteDataSource();
    this.localDataSource = new AuthLocalDataSource();
  }

  async login(name: string, phone: string, role: string): Promise<User> {
    const rawData = await this.remoteDataSource.login(name, phone, role);
    const userEntity = toUserEntity(rawData);
    
    await this.localDataSource.saveUserSession(userEntity);
    return userEntity;
  }

  async logout(): Promise<void> {
    await this.localDataSource.clearUserSession();
  }

  async getCurrentUser(): Promise<User | null> {
    return await this.localDataSource.getUserSession();
  }
}