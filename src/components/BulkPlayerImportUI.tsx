/**
 * BulkPlayerImportUI Component
 * Allows commissioners to import players quickly from formatted text
 * Detects teams and creates draftable players
 */

import React, { useState, useMemo } from 'react';
import { MatchPlayer } from '../types/entities';

interface BulkPlayerImportUIProps {
  onImport?: (players: MatchPlayer[]) => void;
  onCancel?: () => void;
}

interface ParsedPlayer {
  name: string;
  team: string;
  position?: string;
  errors: string[];
}

export const BulkPlayerImportUI: React.FC<BulkPlayerImportUIProps> = ({
  onImport,
  onCancel,
}) => {
  const [inputText, setInputText] = useState('');
  const [parsedPlayers, setParsedPlayers] = useState<ParsedPlayer[]>([]);
  const [step, setStep] = useState<'paste' | 'preview' | 'edit'>('paste');
  const [selectedPositions, setSelectedPositions] = useState<Record<string, string>>({});

  const parsePlayerText = (text: string): ParsedPlayer[] => {
    const lines = text.split('\n').filter((line) => line.trim());
    const players: ParsedPlayer[] = [];
    let currentTeam = '';

    for (const line of lines) {
      const trimmed = line.trim();

      // Check if line looks like a team name (all caps or title case with no numbers)
      if (!trimmed.match(/\d/) && trimmed.length < 50) {
        const isTeamLike =
          trimmed === trimmed.toUpperCase() ||
          (trimmed.split(' ').length <= 3 &&
            trimmed.split(' ').every((word) => word[0] === word[0].toUpperCase()));

        if (isTeamLike) {
          currentTeam = trimmed;
          continue;
        }
      }

      // Parse as player
      const parts = trimmed.split(/\s+/);
      if (parts.length >= 1) {
        players.push({
          name: trimmed,
          team: currentTeam || 'Unassigned',
          position: undefined,
          errors: [],
        });
      }
    }

    return players;
  };

  const handlePaste = () => {
    const players = parsePlayerText(inputText);
    setParsedPlayers(players);
    if (players.length > 0) {
      setStep('preview');
    }
  };

  const handleConfirmPlayers = () => {
    const matchPlayers: MatchPlayer[] = parsedPlayers
      .filter((p) => p.errors.length === 0)
      .map((p, idx) => ({
        id: `player_${idx}`,
        name: p.name,
        team: p.team,
        position: selectedPositions[p.name] || 'FWD',
      }));

    onImport?.(matchPlayers);
  };

  const handlePositionChange = (playerName: string, position: string) => {
    setSelectedPositions({
      ...selectedPositions,
      [playerName]: position,
    });
  };

  const containerStyle: React.CSSProperties = {
    padding: '24px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#333',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
    lineHeight: '1.5',
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    height: '300px',
    padding: '12px',
    fontSize: '13px',
    fontFamily: 'monospace',
    border: '1px solid #ddd',
    borderRadius: '6px',
    marginBottom: '16px',
    boxSizing: 'border-box',
  };

  const buttonStyle = (variant: 'primary' | 'secondary'): React.CSSProperties => ({
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: variant === 'primary' ? '#1976d2' : '#e0e0e0',
    color: variant === 'primary' ? '#fff' : '#666',
  });

  const actionStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
  };

  const previewTableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '16px',
  };

  const tableHeadStyle: React.CSSProperties = {
    backgroundColor: '#f5f5f5',
    borderBottom: '2px solid #ddd',
  };

  const tableCellStyle: React.CSSProperties = {
    padding: '12px',
    textAlign: 'left',
    fontSize: '13px',
    borderBottom: '1px solid #e0e0e0',
  };

  const tableHeaderCellStyle: React.CSSProperties = {
    ...tableCellStyle,
    fontWeight: 'bold',
    color: '#333',
  };

  const positionSelectStyle: React.CSSProperties = {
    padding: '6px 8px',
    fontSize: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontFamily: 'inherit',
  };

  const successBoxStyle: React.CSSProperties = {
    padding: '12px 16px',
    backgroundColor: '#e8f5e9',
    borderLeft: '4px solid #4CAF50',
    borderRadius: '4px',
    marginBottom: '16px',
    color: '#2e7d32',
    fontSize: '13px',
  };

  const exampleBoxStyle: React.CSSProperties = {
    padding: '12px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '16px',
  };

  if (step === 'paste') {
    return (
      <div style={containerStyle}>
        <div style={titleStyle}>📋 Import Players</div>
        <div style={descriptionStyle}>
          Paste your player lineup below. Format: Team name, then player names, one per line.
        </div>

        <div style={exampleBoxStyle}>
          USA<br />
          Pulisic<br />
          Balogun<br />
          Adams<br />
          <br />
          Australia<br />
          Duke<br />
          Irvine
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your lineup here..."
          style={textareaStyle}
        />

        <div style={actionStyle}>
          <button
            onClick={onCancel}
            style={buttonStyle('secondary')}
          >
            Cancel
          </button>
          <button
            onClick={handlePaste}
            disabled={!inputText.trim()}
            style={{
              ...buttonStyle('primary'),
              opacity: !inputText.trim() ? 0.5 : 1,
            }}
          >
            Parse
          </button>
        </div>
      </div>
    );
  }

  if (step === 'preview') {
    const validPlayers = parsedPlayers.filter((p) => p.errors.length === 0);

    return (
      <div style={containerStyle}>
        <div style={titleStyle}>
          Preview: {validPlayers.length} Players Found
        </div>

        {validPlayers.length === 0 ? (
          <div style={descriptionStyle}>
            No valid players were parsed. Please check your formatting and try again.
          </div>
        ) : (
          <>
            <div style={successBoxStyle}>
              ✓ {validPlayers.length} player{validPlayers.length !== 1 ? 's' : ''} ready to import
            </div>

            <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
              <table style={previewTableStyle}>
                <thead style={tableHeadStyle}>
                  <tr>
                    <th style={tableHeaderCellStyle}>Name</th>
                    <th style={tableHeaderCellStyle}>Team</th>
                    <th style={tableHeaderCellStyle}>Position</th>
                  </tr>
                </thead>
                <tbody>
                  {validPlayers.map((player, idx) => (
                    <tr key={idx}>
                      <td style={tableCellStyle}>{player.name}</td>
                      <td style={tableCellStyle}>{player.team}</td>
                      <td style={tableCellStyle}>
                        <select
                          value={selectedPositions[player.name] || 'FWD'}
                          onChange={(e) =>
                            handlePositionChange(player.name, e.target.value)
                          }
                          style={positionSelectStyle}
                        >
                          <option>GK</option>
                          <option>DEF</option>
                          <option>MID</option>
                          <option>FWD</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div style={actionStyle}>
          <button
            onClick={() => {
              setStep('paste');
              setParsedPlayers([]);
              setInputText('');
            }}
            style={buttonStyle('secondary')}
          >
            Back
          </button>
          <button
            onClick={handleConfirmPlayers}
            disabled={validPlayers.length === 0}
            style={{
              ...buttonStyle('primary'),
              opacity: validPlayers.length === 0 ? 0.5 : 1,
            }}
          >
            Import
          </button>
        </div>
      </div>
    );
  }

  return null;
};
