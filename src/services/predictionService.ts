/**
 * Prediction Service
 * Handles player predictions about events
 */

import { GamePrediction, ApiResponse } from '../types/entities';
import { MakePredictionRequest } from '../types/api';

export class PredictionService {
  /**
   * Create a prediction
   */
  static async makePrediction(request: MakePredictionRequest): Promise<ApiResponse<GamePrediction>> {
    // TODO: Create prediction document
    // - Validate player drafted the category
    // - Validate event exists
    // - Create document in predictions subcollection
    // - Cannot create after match starts (or with time limit)
    throw new Error('Not implemented');
  }

  /**
   * Get all predictions for a room
   */
  static async getRoomPredictions(roomId: string): Promise<ApiResponse<GamePrediction[]>> {
    // TODO: Fetch all predictions for a room
    // - Query predictions subcollection
    throw new Error('Not implemented');
  }

  /**
   * Get predictions for a specific player
   */
  static async getPlayerPredictions(
    roomId: string,
    playerId: string
  ): Promise<ApiResponse<GamePrediction[]>> {
    // TODO: Query predictions where playerId = specified player
    throw new Error('Not implemented');
  }

  /**
   * Get predictions for a specific category
   */
  static async getCategoryPredictions(
    roomId: string,
    categoryId: string
  ): Promise<ApiResponse<GamePrediction[]>> {
    // TODO: Query predictions where categoryId = specified category
    throw new Error('Not implemented');
  }

  /**
   * Update prediction (before match starts)
   */
  static async updatePrediction(
    predictionId: string,
    updates: Partial<GamePrediction>
  ): Promise<ApiResponse<GamePrediction>> {
    // TODO: Update prediction (only before match starts)
    throw new Error('Not implemented');
  }

  /**
   * Delete prediction (before match starts)
   */
  static async deletePrediction(predictionId: string): Promise<ApiResponse<void>> {
    // TODO: Delete prediction if allowed
    throw new Error('Not implemented');
  }

  /**
   * Score predictions when event occurs
   */
  static async scorePredictions(roomId: string, eventId: string): Promise<ApiResponse<GamePrediction[]>> {
    // TODO: Find all predictions for this event and update with points
    // - Called by scoreService when event is verified
    // - Set result to CORRECT or INCORRECT
    // - Calculate and assign points
    throw new Error('Not implemented');
  }

  /**
   * Get predictions statistics for a player
   */
  static async getPlayerPredictionStats(
    roomId: string,
    playerId: string
  ): Promise<ApiResponse<{
    total: number;
    correct: number;
    incorrect: number;
    pending: number;
    accuracy: number;
    totalPointsFromPredictions: number;
  }>> {
    // TODO: Calculate statistics from predictions
    throw new Error('Not implemented');
  }

  /**
   * Close predictions (start match)
   */
  static async closePredictions(roomId: string): Promise<ApiResponse<number>> {
    // TODO: Prevent new predictions and lock existing ones
    // - Called when transitioning to MATCH phase
    // - Returns count of predictions locked
    throw new Error('Not implemented');
  }

  /**
   * Get open predictions (during prediction window)
   */
  static async getOpenPredictions(roomId: string): Promise<ApiResponse<GamePrediction[]>> {
    // TODO: Get predictions where result = PENDING
    throw new Error('Not implemented');
  }
}
