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
 * @file        TaskModel.ts
 * @description Model for representing task data
 * @created     2026-04-24
 * ──────────────────────────────────────────────────────────────
 */

import { Task } from '../../domain/entities/Task';

export interface TaskApiResponse {
  id: string;
  title: string;
  description: string;
  budget: string | number;
  location: string;
  status: string;
  customer_id: string;
  pesuruh_id?: string | null;
  created_at?: string;
}

export const toTaskEntity = (model: TaskApiResponse): Task => {
  return {
    id: model.id.toString(),
    title: model.title,
    description: model.description || '',
    budget: Number(model.budget),
    location: model.location || '-',
    status: (model.status || 'open') as 'open' | 'taken' | 'completed',
    customer_id: model.customer_id.toString(),
    pesuruh_id: model.pesuruh_id ? model.pesuruh_id.toString() : null,
    created_at: model.created_at,
  };
};