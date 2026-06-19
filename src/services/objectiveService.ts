/**
 * Objective Service
 * Manages objective assignment, tracking, and scoring
 */

import { collection, doc, setDoc, getDocs, query, where, QueryConstraint } from 'firebase/firestore';
import { db } from './firebase';
import { ApiResponse } from '../types/api';
import { ObjectiveAssignment, GameEvent } from '../types/entities';
import { objectiveRegistry, getObjectiveSet } from '../registries/objectiveRegistry';

class ObjectiveServiceClass {
  /**
   * Assign random objectives to all players in a room
   * Each player gets: 2 Common + 1 Rare
   */
  static async assignObjectivesToPlayers(roomId: string, playerIds: string[]): Promise<ApiResponse<void>> {
    try {
      const batch: { [key: string]: ObjectiveAssignment } = {};

      for (const playerId of playerIds) {
        const objectives = getObjectiveSet();

        for (const objective of objectives) {
          const assignment: ObjectiveAssignment = {
            id: `${playerId}_${objective.id}`,
            roomId,
            playerId,
            objectiveId: objective.id,
            assignedAt: Date.now(),
            completed: false,
            pointsEarned: 0,
          };

          batch[`${playerId}_${objective.id}`] = assignment;
        }
      }

      // Store all objectives
      const objectivesRef = collection(db, 'rooms', roomId, 'objectives');
      for (const [key, assignment] of Object.entries(batch)) {
        await setDoc(doc(objectivesRef, key), assignment);
      }

      return {
        success: true,
        data: undefined,
        timestamp: Date.now(),
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'OBJECTIVE_ASSIGNMENT_FAILED',
          message: err instanceof Error ? err.message : 'Failed to assign objectives',
        },
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get objectives assigned to a player
   */
  static async getPlayerObjectives(roomId: string, playerId: string): Promise<ApiResponse<ObjectiveAssignment[]>> {
    try {
      const objectivesRef = collection(db, 'rooms', roomId, 'objectives');
      const q = query(objectivesRef, where('playerId', '==', playerId) as QueryConstraint);
      const snapshot = await getDocs(q);

      const objectives = snapshot.docs.map((doc) => doc.data() as ObjectiveAssignment);

      return {
        success: true,
        data: objectives,
        timestamp: Date.now(),
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'GET_OBJECTIVES_FAILED',
          message: err instanceof Error ? err.message : 'Failed to get objectives',
        },
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Check if an objective is completed based on events
   * Returns points if objective is met
   */
  static checkObjectiveCompletion(
    objectiveId: string,
    events: GameEvent[],
    matchPlayerId: string
  ): { completed: boolean; points: number } {
    const objective = objectiveRegistry[objectiveId];
    if (!objective) {
      return { completed: false, points: 0 };
    }

    const relevantEvents = events.filter(
      (e) => e.matchPlayerId === matchPlayerId && !e.verified
    );

    switch (objective.id) {
      case 'FINISHER':
        // +3 per GOAL
        return {
          completed: relevantEvents.some((e) => e.eventDefinitionId === 'GOAL'),
          points: objective.points * relevantEvents.filter((e) => e.eventDefinitionId === 'GOAL').length,
        };

      case 'CREATOR':
        // +2 per ASSIST
        return {
          completed: relevantEvents.some((e) => e.eventDefinitionId === 'ASSIST'),
          points: objective.points * relevantEvents.filter((e) => e.eventDefinitionId === 'ASSIST').length,
        };

      case 'MARKSMAN':
        // +1 per SHOT_ON_TARGET
        const shotsOnTarget = relevantEvents.filter((e) => e.eventDefinitionId === 'SHOT_ON_TARGET').length;
        return {
          completed: shotsOnTarget > 0,
          points: objective.points * shotsOnTarget,
        };

      case 'ENFORCER':
        // +1 per FOUL_COMMITTED
        const fouls = relevantEvents.filter((e) => e.eventDefinitionId === 'FOUL_COMMITTED').length;
        return {
          completed: fouls > 0,
          points: objective.points * fouls,
        };

      case 'CARD_MAGNET':
        // +2 per YELLOW_CARD
        const yellows = relevantEvents.filter((e) => e.eventDefinitionId === 'YELLOW_CARD').length;
        return {
          completed: yellows > 0,
          points: objective.points * yellows,
        };

      case 'BRICK_WALL':
        // +1 per SAVE
        const saves = relevantEvents.filter((e) => e.eventDefinitionId === 'SAVE').length;
        return {
          completed: saves > 0,
          points: objective.points * saves,
        };

      case 'WORKHORSE':
        // +1 for starting
        const starter = relevantEvents.filter((e) => e.eventDefinitionId === 'STARTER').length;
        return {
          completed: starter > 0,
          points: objective.points * starter,
        };

      case 'BRACE_HUNTER':
        // +10 if 2+ GOALS
        const goals = relevantEvents.filter((e) => e.eventDefinitionId === 'GOAL').length;
        return {
          completed: goals >= 2,
          points: goals >= 2 ? objective.points : 0,
        };

      case 'CLUTCH_PLAYER':
        // +8 for GOAL after minute 80
        const lateGoals = relevantEvents.filter(
          (e) => e.eventDefinitionId === 'GOAL' && (e.matchMinute || 0) >= 80
        ).length;
        return {
          completed: lateGoals > 0,
          points: lateGoals > 0 ? objective.points : 0,
        };

      case 'MATCH_WINNER':
        // +10 for winning goal (special event)
        const winningGoal = relevantEvents.filter((e) => e.eventDefinitionId === 'WINNING_GOAL').length;
        return {
          completed: winningGoal > 0,
          points: winningGoal > 0 ? objective.points : 0,
        };

      case 'SUPER_SUB':
        // +8 if substitute scores
        const subGoal = relevantEvents.filter((e) => e.eventDefinitionId === 'SUBSTITUTE_GOAL').length;
        return {
          completed: subGoal > 0,
          points: subGoal > 0 ? objective.points : 0,
        };

      case 'CLEAN_SHEET_KING':
        // +8 for clean sheet (no goals against)
        // This would need to check team events, simplified for now
        return {
          completed: false, // Would need match context
          points: 0,
        };

      case 'ASSIST_MACHINE':
        // +8 if 2+ ASSISTS
        const assists = relevantEvents.filter((e) => e.eventDefinitionId === 'ASSIST').length;
        return {
          completed: assists >= 2,
          points: assists >= 2 ? objective.points : 0,
        };

      default:
        return { completed: false, points: 0 };
    }
  }

  /**
   * Evaluate all objectives for a player and calculate total points
   */
  static evaluatePlayerObjectives(
    assignments: ObjectiveAssignment[],
    draftedMatchPlayers: string[],
    events: GameEvent[]
  ): { totalPoints: number; breakdown: { objectiveId: string; points: number }[] } {
    let totalPoints = 0;
    const breakdown: { objectiveId: string; points: number }[] = [];

    for (const assignment of assignments) {
      if (!draftedMatchPlayers.includes(assignment.objectiveId)) continue;

      for (const matchPlayerId of draftedMatchPlayers) {
        const { points } = ObjectiveServiceClass.checkObjectiveCompletion(
          assignment.objectiveId,
          events,
          matchPlayerId
        );

        if (points > 0) {
          totalPoints += points;
          breakdown.push({
            objectiveId: assignment.objectiveId,
            points,
          });
        }
      }
    }

    return { totalPoints, breakdown };
  }
}

export const ObjectiveService = ObjectiveServiceClass;
