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
 * @file        TaskLocalDataSource.ts
 * @description Data source for handling local task operations
 * @created     2026-04-24
 * ──────────────────────────────────────────────────────────────
 */

import { storageService } from '../../../infrastructure/storage/storageService';
import { TaskApiResponse } from '../../models/TaskModel';

export class TaskLocalDataSource {
  private readonly TASKS_CACHE_KEY = 'cached_tasks_list';

  async saveTasks(tasks: TaskApiResponse[]): Promise<void> {
    try {
      await storageService.setItem(this.TASKS_CACHE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Gagal menyimpan cache tugas:', error);
    }
  }

  async getCachedTasks(): Promise<TaskApiResponse[]> {
    try {
      const data = await storageService.getItem(this.TASKS_CACHE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Gagal mengambil cache tugas:', error);
      return [];
    }
  }

  async clearCache(): Promise<void> {
    await storageService.removeItem(this.TASKS_CACHE_KEY);
  }
}