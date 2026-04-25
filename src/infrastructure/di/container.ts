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
 * @file        container.ts
 * @description Dependency injection container
 * @created     2026-04-24
 * ──────────────────────────────────────────────────────────────
 */

import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl';
import { TaskRepositoryImpl } from '../../data/repositories/TaskRepositoryImpl';
import { LoginUseCase } from '../../domain/usecases/auth/LoginUseCase';
import { LogoutUseCase } from '../../domain/usecases/auth/LogoutUseCase';
import { GetCurrentUserUseCase } from '../../domain/usecases/auth/GetCurrentUserUseCase';
import { GetTasksUseCase } from '../../domain/usecases/task/GetTasksUseCase';
import { CreateTaskUseCase } from '../../domain/usecases/task/CreateTaskUseCase';
import { GetTaskByIdUseCase } from '../../domain/usecases/task/GetTaskByIdUseCase';
import { SubmitBidUseCase } from '../../domain/usecases/task/SubmitBidUseCase';
import { GetBidsByTaskUseCase } from '../../domain/usecases/task/GetBidsByTaskUseCase';
import { InitiateChatUseCase } from '../../domain/usecases/task/InitiateChatUseCase';

const authRepository = new AuthRepositoryImpl();
const taskRepository = new TaskRepositoryImpl();

export const DIContainer = {
  get loginUseCase() { return new LoginUseCase(authRepository); },
  get logoutUseCase() { return new LogoutUseCase(authRepository); },
  get getCurrentUserUseCase() { return new GetCurrentUserUseCase(authRepository); },
  
  get getTasksUseCase() { return new GetTasksUseCase(taskRepository); },
  get createTaskUseCase() { return new CreateTaskUseCase(taskRepository); },
  
  get getTaskByIdUseCase() { return new GetTaskByIdUseCase(taskRepository); },
  get submitBidUseCase() { return new SubmitBidUseCase(taskRepository); },

  get getBidsByTaskUseCase() { return new GetBidsByTaskUseCase(taskRepository); },
  get initiateChatUseCase() { return new InitiateChatUseCase(taskRepository); },
};