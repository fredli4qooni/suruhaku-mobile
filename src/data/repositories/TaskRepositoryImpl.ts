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
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * ──────────────────────────────────────────────────────────────
 * @file        TaskRepositoryImpl.ts
 * @description Implementation of task repository
 * @created     2026-04-24
 * ──────────────────────────────────────────────────────────────
 */

import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { Task } from '../../domain/entities/Task';
import { TaskRemoteDataSource } from '../datasources/remote/TaskRemoteDataSource';
import { TaskLocalDataSource } from '../datasources/local/TaskLocalDataSource';
import { toTaskEntity } from '../models/TaskModel';

export class TaskRepositoryImpl implements ITaskRepository {
  private remoteDataSource: TaskRemoteDataSource;
  private localDataSource: TaskLocalDataSource;

  constructor() {
    this.remoteDataSource = new TaskRemoteDataSource();
    this.localDataSource = new TaskLocalDataSource();
  }

  async getTasks(userId: string, role: string): Promise<Task[]> {
    try {
      const rawDataArray = await this.remoteDataSource.fetchTasks(userId, role);
      
      await this.localDataSource.saveTasks(rawDataArray);
      
      return rawDataArray.map((rawData: any) => toTaskEntity(rawData));
    } catch (error: any) {
      console.error("Gagal fetch API, fallback ke cache lokal:", error.message);
      const cachedData = await this.localDataSource.getCachedTasks();
      
      return cachedData.map((rawData: any) => toTaskEntity(rawData));
    }
  }

  async createTask(taskData: Partial<Task>): Promise<Task> {
    const rawNewTask = await this.remoteDataSource.createTask(taskData);
    return toTaskEntity(rawNewTask);
  }

  async getTaskById(id: string): Promise<Task> {
    const rawData = await this.remoteDataSource.fetchTaskById(id);
    return toTaskEntity(rawData);
  }

  async submitBid(taskId: string, pesuruhId: string, offerPrice: number): Promise<boolean> {
    return await this.remoteDataSource.submitBid(taskId, pesuruhId, offerPrice);
  }

  async getBidsByTask(taskId: string): Promise<any[]> {
    return await this.remoteDataSource.fetchBidsByTask(taskId);
  }

  async initiateChat(bidId: string, taskId: string): Promise<string> {
    return await this.remoteDataSource.initiateChat(bidId, taskId);
  }
}