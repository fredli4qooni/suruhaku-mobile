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
 * @file        SubmitBidUseCase.ts
 * @description Use case for submitting a bid for a task
 * @created     2026-04-24
 * ──────────────────────────────────────────────────────────────
 */

import { ITaskRepository } from '../../repositories/ITaskRepository';

export class SubmitBidUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string, pesuruhId: string, offerPrice: number): Promise<boolean> {
    if (offerPrice <= 0) throw new Error("Harga penawaran harus lebih dari 0");
    return await this.taskRepository.submitBid(taskId, pesuruhId, offerPrice);
  }
}