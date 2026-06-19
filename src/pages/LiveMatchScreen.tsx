/**
 * LiveMatchScreen
 * Main game screen during live match
 * Shows fiasco bonuses, player spotlight, leaderboard, event feed, and event entry
 */

import React, { useState, useMemo } from 'react';
import { useGame } from '../contexts/GameContext';
import { useRoom } from '../contexts/RoomContext';
import { FiascoBonusPanel } from '../components/FiascoBonusPanel';
import { PlayerSpotlight } from '../components/PlayerSpotlight';
import { LeaderboardCard } from '../components/LeaderboardCard';
import { EventFeedItem } from '../components/EventFeedItem';
import { FiascoBonus, MatchPlayer, LeaderboardEntry, GameEvent } from '../types/entities';

interface LiveMatchScreenProps {
  onMatchEnd?: () => void;
}

export const LiveMatchScreen: React.FC<LiveMatchScreenProps> = ({ onMatchEnd }) => {
  const { gameState, events } = useGame();
  const { room, isHost, currentPlayerId } = useRoom();

  // TODO: Connect to actual game state
  const [fiascoBonuses, setFiascoBonuses] = useState<FiascoBonus[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [hotPlayer, setHotPlayer] = useState<MatchPlayer | null>(null);
  const [eventEntryStep, setEventEntryStep] = useState<'type' | 'player' | 'minute' | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);

  const matchTime = useMemo(() => {
    // TODO: Calculate real match time from gameState
    return 42;
  }, [gameState]);

  const eventTypes = [
    { id: 'goal', name: 'Goal', icon: '⚽' },
    { id: 'assist', name: 'Assist', icon: '🎯' },
    { id: 'yellowCard', name: 'Yellow Card', icon: '🟨' },
    { id: 'redCard', name: 'Red Card', icon: '🟥' },
    { id: 'save', name: 'Save', icon: '🧤' },
    { id: 'ownGoal', name: 'Own Goal', icon: '💣' },
    { id: 'missedPenalty', name: 'Missed Penalty', icon: '❌' },
  ];

  const handleEventEntry = (typeId: string) => {
    setSelectedEventType(typeId);
    setEventEntryStep('player');
  };

  const containerStyle: React.CSSProperties = {
    padding: '0',
    maxWidth: '100%',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#fafafa',
    minHeight: '100vh',
  };

  const headerStyle: React.CSSProperties = {
    padding: '16px',
    backgroundColor: '#1976d2',
    color: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 20,
  };

  const matchTimeStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '4px',
  };

  const matchStatusStyle: React.CSSProperties = {
    fontSize: '13px',
    opacity: 0.9,
  };

  const mainContentStyle: React.CSSProperties = {
    padding: '16px',
    paddingBottom: '24px',
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '24px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: '12px',
    letterSpacing: '0.5px',
  };

  // Event entry modal styles
  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'flex-end',
    zIndex: 100,
  };

  const modalStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    padding: '20px 16px 32px 16px',
    boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
    maxHeight: '80vh',
    overflowY: 'auto',
  };

  const eventTypeGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))',
    gap: '8px',
    marginBottom: '16px',
  };

  const eventTypeButtonStyle: React.CSSProperties = {
    padding: '16px',
    textAlign: 'center',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
  };

  const closeButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#e0e0e0',
    cursor: 'pointer',
    marginTop: '12px',
  };

  const eventFeedStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column-reverse',
    gap: '8px',
  };

  const leaderboardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const endMatchButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#d32f2f',
    color: '#fff',
    cursor: 'pointer',
    marginTop: '16px',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={matchTimeStyle}>{matchTime}'</div>
        <div style={matchStatusStyle}>Match in Progress</div>
      </div>

      <div style={mainContentStyle}>
        {/* Fiasco Bonuses */}
        <div style={sectionStyle}>
          <FiascoBonusPanel bonuses={fiascoBonuses} compact={false} />
        </div>

        {/* Player Spotlight */}
        {hotPlayer && (
          <div style={sectionStyle}>
            <PlayerSpotlight
              player={hotPlayer}
              draftedBy="Player Name"
              currentScore={25}
              triggeredObjectives={[]}
              triggeredFiascoBonuses={[]}
              compact={false}
            />
          </div>
        )}

        {/* Leaderboard */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Leaderboard</div>
          <div style={leaderboardStyle}>
            {leaderboard.map((entry, idx) => (
              <LeaderboardCard
                key={entry.playerName}
                entry={entry}
                rank={idx + 1}
                variant="live"
              />
            ))}
          </div>
        </div>

        {/* Recent Events */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Recent Events</div>
          <div style={eventFeedStyle}>
            {events.slice(0, 10).map((event) => (
              <EventFeedItem
                key={event.id}
                event={event}
                playerName="Player Name"
                pointsAwarded={0}
                variant="feed"
                showTimestamp={true}
              />
            ))}
          </div>
        </div>

        {/* Event Entry Controls - Commissioner Only */}
        {isHost && (
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>Record Event</div>
            <div style={eventTypeGridStyle}>
              {eventTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleEventEntry(type.id)}
                  style={{
                    ...eventTypeButtonStyle,
                    fontSize: '24px',
                    padding: '24px 8px',
                  }}
                  title={type.name}
                >
                  {type.icon}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* End Match Button - Host Only */}
        {isHost && (
          <button style={endMatchButtonStyle} onClick={onMatchEnd}>
            End Match
          </button>
        )}
      </div>

      {/* Event Entry Modal */}
      {eventEntryStep && (
        <div style={modalOverlayStyle} onClick={() => setEventEntryStep(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
              {eventEntryStep === 'type' && 'Select Event Type'}
              {eventEntryStep === 'player' && 'Select Player'}
              {eventEntryStep === 'minute' && 'Confirm Minute'}
            </div>

            {eventEntryStep === 'player' && (
              <div>
                {/* TODO: Show player list */}
                <div style={{ color: '#999', textAlign: 'center', padding: '32px 16px' }}>
                  Player selection coming soon
                </div>
              </div>
            )}

            <button
              style={closeButtonStyle}
              onClick={() => setEventEntryStep(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
