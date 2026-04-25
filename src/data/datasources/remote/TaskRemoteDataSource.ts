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
 * @file        TaskRemoteDataSource.ts
 * @description Data source for handling remote task operations
 * @created     2026-04-24
 * ──────────────────────────────────────────────────────────────
 */

import apiClient from '../../../infrastructure/http/apiClient';

export class TaskRemoteDataSource {
  async fetchTasks(userId: string, role: string): Promise<any[]> {
    const endpoint = role === 'customer' 
      ? `/tasks/customer/${userId}` 
      : `/tasks/pesuruh/${userId}`;
      
    const response = await apiClient.get(endpoint);
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  }

  async createTask(taskData: any): Promise<any> {
    try {
      const payloadToBackend = {
        customer_id: taskData.customer_id,
        title: taskData.title,
        description: taskData.description,
        budget: taskData.budget,
        location_text: taskData.location,
      };

      const response = await apiClient.post('/tasks', payloadToBackend);
      return response.data.data;
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || "Gagal membuat tugas";
      console.error("🔴 API CREATE TASK ERROR:", errorMessage);
      throw new Error(errorMessage);
    }
  }

  async fetchTaskById(id: string): Promise<any> {
    try {
      const response = await apiClient.get(`/tasks/detail/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Gagal mengambil detail tugas');
    }
  }

  async submitBid(taskId: string, pesuruhId: string, offerPrice: number): Promise<boolean> {
    try {
      const response = await apiClient.post('/bids', {
        task_id: taskId,
        pesuruh_id: pesuruhId,
        offer_price: offerPrice
      });
      return response.data.success;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Gagal mengirim penawaran');
    }
  }

  async fetchBidsByTask(taskId: string): Promise<any[]> {
    try {
      const response = await apiClient.get(`/bids/task/${taskId}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Gagal mengambil daftar penawaran');
    }
  }

  async initiateChat(bidId: string, taskId: string): Promise<string> {
    try {
      const response = await apiClient.post('/bids/initiate-chat', {
        bid_id: bidId,
        task_id: taskId
      });
      return response.data.data.chat_room_id;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Gagal membuat ruang chat');
    }
  }
}