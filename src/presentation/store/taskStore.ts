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
 * @file        taskStore.ts
 * @description Task store initialization
 * @created     2026-04-24
 * ──────────────────────────────────────────────────────────────
 */

import { create } from 'zustand';
import { Task } from '../../domain/entities/Task';
import { DIContainer } from '../../infrastructure/di/container';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  bids: any[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (userId: string, role: string) => Promise<void>;
  createTask: (taskData: Partial<Task>) => Promise<boolean>;
  getTaskById: (id: string) => Promise<void>;
  submitBid: (taskId: string, pesuruhId: string, offerPrice: number) => Promise<boolean>;
  getBidsByTask: (taskId: string) => Promise<void>;
  initiateChat: (bidId: string, taskId: string) => Promise<string | null>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTask: null,
  bids: [],
  isLoading: false,
  error: null,

  fetchTasks: async (userId, role) => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await DIContainer.getTasksUseCase.execute(userId, role);
      set({ tasks, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      await DIContainer.createTaskUseCase.execute(taskData);
      if (taskData.customer_id) {
        await get().fetchTasks(taskData.customer_id, 'customer');
      }
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  getTaskById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const task = await DIContainer.getTaskByIdUseCase.execute(id);
      set({ currentTask: task, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  submitBid: async (taskId, pesuruhId, offerPrice) => {
    set({ isLoading: true, error: null });
    try {
      await DIContainer.submitBidUseCase.execute(taskId, pesuruhId, offerPrice);
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  getBidsByTask: async (taskId) => {
    set({ isLoading: true, error: null });
    try {
      const bids = await DIContainer.getBidsByTaskUseCase.execute(taskId);
      set({ bids, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  initiateChat: async (bidId, taskId) => {
    set({ isLoading: true, error: null });
    try {
      const chatRoomId = await DIContainer.initiateChatUseCase.execute(bidId, taskId);
      set({ isLoading: false });
      return chatRoomId;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },
}));