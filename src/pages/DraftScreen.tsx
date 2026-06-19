/**
 * DraftScreen
 * Mobile-first draft experience
 * Players quickly select from available pool while seeing objectives
 */

import React, { useState, useMemo } from 'react';
import { useGame } from '../contexts/GameContext';
import { useRoom } from '../contexts/RoomContext';
import { ObjectiveCard } from '../components/ObjectiveCard';
import { DraftPlayerCard } from '../components/DraftPlayerCard';
import { Objective, MatchPlayer, ObjectiveAssignment } from '../types/entities';

interface DraftScreenProps {
  onDraftComplete?: () => void;
}

export const DraftScreen: React.FC<DraftScreenProps> = ({ onDraftComplete }) => {
  const { gameState } = useGame();
  const { room, currentPlayerId } = useRoom();

  // TODO: Connect to actual game state
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [assignedObjectives, setAssignedObjectives] = useState<Record<string, ObjectiveAssignment>>({});
  const [availablePlayers, setAvailablePlayers] = useState<MatchPlayer[]>([]);
  const [draftedPlayers, setDraftedPlayers] = useState<string[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<MatchPlayer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<string | null>(null);

  const currentPickNumber = useMemo(() => draftedPlayers.length + 1, [draftedPlayers]);
  const maxPicks = 3; // TODO: Get from room settings

  // Get recommended positions from objectives
  const recommendedPositions = useMemo(() => {
    const positions = new Set<string>();
    objectives.forEach((obj) => {
      obj.recommendedPositions.forEach((pos) => positions.add(pos));
    });
    return Array.from(positions);
  }, [objectives]);

  // Filter players based on search and position
  const filteredPlayers = useMemo(() => {
    return availablePlayers
      .filter((p) => !draftedPlayers.includes(p.id))
      .filter((p) => {
        if (!searchQuery) return true;
        return (
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.team.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
      .filter((p) => {
        if (!positionFilter) return true;
        return p.position === positionFilter;
      });
  }, [availablePlayers, draftedPlayers, searchQuery, positionFilter]);

  const handleSelectPlayer = (player: MatchPlayer) => {
    setSelectedPlayer(player);
  };

  const handleConfirmPick = (player: MatchPlayer) => {
    // TODO: Call game service to record pick
    setDraftedPlayers([...draftedPlayers, player.id]);
    setSelectedPlayer(null);

    if (draftedPlayers.length + 1 >= maxPicks) {
      onDraftComplete?.();
    }
  };

  const handleSkip = () => {
    // TODO: Implement skip logic if allowed
  };

  const containerStyle: React.CSSProperties = {
    padding: '0',
    maxWidth: '100%',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const headerStyle: React.CSSProperties = {
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #ddd',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  };

  const pickCounterStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '4px',
  };

  const progressBarStyle: React.CSSProperties = {
    height: '4px',
    backgroundColor: '#e0e0e0',
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: '8px',
  };

  const progressFillStyle: React.CSSProperties = {
    height: '100%',
    backgroundColor: '#4CAF50',
    width: `${(currentPickNumber / maxPicks) * 100}%`,
    transition: 'width 0.3s ease',
  };

  const mainContentStyle: React.CSSProperties = {
    padding: '16px',
    maxWidth: '100%',
  };

  const objectivesPanelStyle: React.CSSProperties = {
    marginBottom: '24px',
    padding: '12px',
    backgroundColor: '#fff3e0',
    borderRadius: '8px',
    border: '1px solid #FFE0B2',
  };

  const objectivesPanelTitleStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#E65100',
    textTransform: 'uppercase',
    marginBottom: '8px',
    letterSpacing: '0.5px',
  };

  const objectiveListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  };

  const objectiveItemStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#333',
  };

  const recommendedBadgeStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '2px 6px',
    backgroundColor: '#c8e6c9',
    borderRadius: '3px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#2e7d32',
    marginLeft: '8px',
  };

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  };

  const searchInputStyle: React.CSSProperties = {
    flex: 1,
    minWidth: '150px',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontFamily: 'inherit',
  };

  const filterButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: 'bold',
    border: `2px solid ${active ? '#1976d2' : '#ddd'}`,
    borderRadius: '6px',
    backgroundColor: active ? '#e3f2fd' : '#fff',
    color: active ? '#1976d2' : '#666',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  });

  const playerListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '24px',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '32px 16px',
    color: '#999',
  };

  const selectionPanelStyle: React.CSSProperties = {
    padding: '16px',
    backgroundColor: '#e3f2fd',
    borderTop: '2px solid #1976d2',
    borderRadius: '6px',
    marginTop: '16px',
  };

  const selectionInfoStyle: React.CSSProperties = {
    marginBottom: '12px',
    fontSize: '14px',
  };

  const selectionNameStyle: React.CSSProperties = {
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '4px',
  };

  const selectionActionStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
  };

  const buttonStyle = (variant: 'primary' | 'secondary'): React.CSSProperties => ({
    flex: 1,
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: variant === 'primary' ? '#1976d2' : '#e0e0e0',
    color: variant === 'primary' ? '#fff' : '#666',
    transition: 'all 0.2s ease',
  });

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={pickCounterStyle}>
          Pick {currentPickNumber} of {maxPicks}
        </div>
        <div style={progressBarStyle}>
          <div style={progressFillStyle} />
        </div>
      </div>

      <div style={mainContentStyle}>
        {/* Objectives Panel */}
        {objectives.length > 0 && (
          <div style={objectivesPanelStyle}>
            <div style={objectivesPanelTitleStyle}>Your Objectives</div>
            <div style={objectiveListStyle}>
              {objectives.slice(0, 3).map((obj) => (
                <div key={obj.id} style={objectiveItemStyle}>
                  {obj.name}
                  <div style={recommendedBadgeStyle}>
                    {obj.recommendedPositions.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter Controls */}
        <div style={controlsStyle}>
          <input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInputStyle}
          />
        </div>

        {/* Position Filters */}
        {Array.from(new Set(availablePlayers.map((p) => p.position))).map((position) => (
          <button
            key={position}
            onClick={() => setPositionFilter(positionFilter === position ? null : position)}
            style={filterButtonStyle(positionFilter === position)}
          >
            {position}
          </button>
        ))}

        {/* Player List */}
        <div style={playerListStyle}>
          {filteredPlayers.length === 0 ? (
            <div style={emptyStateStyle}>
              <div style={{ fontSize: '14px', marginBottom: '8px' }}>No players available</div>
              <div style={{ fontSize: '12px' }}>Try adjusting your filters</div>
            </div>
          ) : (
            filteredPlayers.map((player) => (
              <div
                key={player.id}
                onClick={() => handleSelectPlayer(player)}
                style={{ cursor: 'pointer' }}
              >
                <DraftPlayerCard
                  player={player}
                  isSelected={selectedPlayer?.id === player.id}
                  isRecommended={recommendedPositions.includes(player.position)}
                  isDrafted={draftedPlayers.includes(player.id)}
                  variant="available"
                />
              </div>
            ))
          )}
        </div>

        {/* Selection Panel */}
        {selectedPlayer && (
          <div style={selectionPanelStyle}>
            <div style={selectionNameStyle}>{selectedPlayer.name}</div>
            <div style={selectionInfoStyle}>
              {selectedPlayer.team} • {selectedPlayer.position}
            </div>
            <div style={selectionActionStyle}>
              <button
                onClick={() => handleConfirmPick(selectedPlayer)}
                style={buttonStyle('primary')}
              >
                Confirm Pick
              </button>
              <button
                onClick={() => setSelectedPlayer(null)}
                style={buttonStyle('secondary')}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
