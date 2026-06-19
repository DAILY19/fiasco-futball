# Phase 4.6 - Match Template Architecture Design

**Purpose:** Define a reusable Match Template model that allows rooms to reference pre-configured game setups.

---

## Overview

Match Templates are pre-configured game blueprints that define:
- Match name and description
- Teams and player pools
- Draftable players available
- Supported objective pools
- Optional game rule variations

Templates enable:
- **Quick Room Creation:** Host selects a template instead of configuring from scratch
- **Consistency:** Standardized match configurations across game sessions
- **Extensibility:** Support for seasonal matches, tournament modes, league play
- **Simplification:** Reduce decision fatigue for room hosts

### Key Principle
Templates are **immutable reference data**. Rooms reference templates by ID, but can override specific settings.

---

## Data Model

### MatchTemplate Entity

```typescript
/**
 * MatchTemplate - Pre-configured game blueprint
 * Stored in Firestore at: /matchTemplates/{templateId}
 */
interface MatchTemplate {
  // Identity
  id: string;                         // Unique ID (auto-generated)
  name: string;                       // "Liverpool vs Man City - Feb 2025"
  displayName: string;                // Short name for UI
  description?: string;               // Long description
  
  // Versioning & Lifecycle
  version: number;                    // Increments on updates
  createdAt: number;                  // Timestamp
  createdBy: string;                  // User ID of template creator (admin)
  updatedAt: number;                  // Last update timestamp
  isActive: boolean;                  // Template is available for selection
  isArchived?: boolean;               // Hide from UI but keep for historical
  deprecatedAt?: number;              // When template became inactive
  
  // Sport & Category
  sport: Sport;                       // 'FOOTBALL', 'BASKETBALL', etc.
  category: string;                   // 'LEAGUE', 'TOURNAMENT', 'FRIENDLY', 'SEASONAL'
  season?: string;                    // "2024-2025"
  
  // Teams
  homeTeam: TeamInfo;                 // Team A details
  awayTeam: TeamInfo;                 // Team B details
  
  // Match Configuration
  venue?: string;                     // Stadium name
  expectedKickoff?: number;           // Scheduled match timestamp
  estimatedDuration?: number;         // Minutes (usually 90 for football)
  
  // Player Pool Configuration
  playerPoolId?: string;              // Reference to PlayerPool doc
  draftablePlayerCount?: number;      // How many players will be drafted (total)
  playerPositions?: string[];         // ["GK", "DEF", "MID", "FWD"]
  playersPerPosition?: Record<string, number>; // { "FWD": 2, "MID": 3, etc. }
  
  // Objective Configuration
  objectivePoolIds: string[];         // Array of objective pool references
  defaultObjectivePool: string;       // Primary pool ID
  
  // Game Rules (Overrides)
  rules: TemplateRules;               // Game-specific rule variations
  
  // Metadata
  estimatedParticipants?: number;     // Expected number of room players
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  tags?: string[];                    // ["live", "premium", "europe"]
  imageUrl?: string;                  // Template cover image
  
  // Access Control
  isPublic: boolean;                  // Available to all users
  organizationId?: string;            // If organization-specific
  allowDuplicates: boolean;           // Can create multiple rooms from this template
}

interface TeamInfo {
  id: string;                         // Team identifier
  name: string;                       // "Liverpool FC"
  country?: string;                   // "England"
  logo?: string;                      // URL to logo
  color?: string;                     // Primary color hex
}

interface TemplateRules {
  pointsPerCorrection?: number;       // Override default points
  pointsPerWildCard?: number;
  customRules?: Record<string, any>;  // Extensible rule storage
  
  // Objective-specific rules
  objectiveDistribution?: {
    commonPerPlayer: number;          // Usually 2
    rarePerPlayer: number;            // Usually 1
    allowDuplicates: boolean;         // Can player get same objective twice?
  };
}
```

### ObjectivePool Entity (Complementary)

```typescript
/**
 * ObjectivePool - Named collection of objectives
 * Enables different objective combinations for different matches
 * Examples: "Premier League", "Cup Matches", "Friendly Rules"
 */
interface ObjectivePool {
  id: string;                         // "pool_pl_standard"
  name: string;                       // "Premier League Standard"
  description: string;
  
  // Objectives included in this pool
  commonObjectiveIds: string[];       // Objective registry IDs
  rareObjectiveIds: string[];
  
  // Distribution rules
  selectionStrategy: 'RANDOM' | 'WEIGHTED' | 'SEASONAL';
  weights?: Record<string, number>;   // Probability weights for weighted selection
  
  // Lifecycle
  isActive: boolean;
  createdAt: number;
  version: number;
}
```

### Room → Template Reference

```typescript
/**
 * Enhanced Room entity to support templates
 * Adds template reference to existing Room interface
 */
interface Room {
  // ... existing fields ...
  
  // NEW: Template reference
  templateId?: string;                // Which MatchTemplate created this room
  templateVersion?: number;           // Version of template used (for audit)
  
  // Overrides (if room customizes template)
  overrides?: RoomTemplateOverrides;
}

interface RoomTemplateOverrides {
  homeTeam?: TeamInfo;                // Override template's home team
  awayTeam?: TeamInfo;                // Override template's away team
  expectedKickoff?: number;           // Override match time
  playerPool?: MatchPlayer[];         // Override draftable players
  objectivePoolId?: string;           // Override objective pool
  customRules?: Record<string, any>;
}
```

---

## Firestore Collection Structure

```
/matchTemplates
  /{templateId}
    - id: string
    - name: string
    - sport: string
    - homeTeam: { id, name, logo, ... }
    - awayTeam: { id, name, logo, ... }
    - playerPoolId: string
    - objectivePoolIds: string[]
    - defaultObjectivePool: string
    - rules: { ... }
    - isActive: boolean
    - createdAt: number
    - version: number
    
/objectivePools
  /{poolId}
    - id: string
    - name: string
    - commonObjectiveIds: string[]
    - rareObjectiveIds: string[]
    - selectionStrategy: string
    - isActive: boolean
    - version: number

/playerPools
  /{poolId}
    - id: string
    - name: string
    - sport: string
    - matchPlayers: [
        { id, name, position, team, number, ... },
        ...
      ]
    - createdAt: number
    - templateId?: string (for audit trail)

/rooms/{roomId}
  - ... existing fields ...
  - templateId: string (reference)
  - templateVersion: number
  - overrides: { ... } (optional)
```

---

## Use Cases

### Use Case 1: Quick Room Creation (Host)

```typescript
/**
 * Host creates room from template
 * 
 * Flow:
 * 1. Host browses available templates
 * 2. Selects "Liverpool vs Man City - Feb 2025"
 * 3. System populates:
 *    - Home/away teams
 *    - Player pool (draftable players)
 *    - Objective pool
 *    - Default game rules
 * 4. Host can optionally customize (override template settings)
 * 5. Room is created with templateId reference
 */

async function createRoomFromTemplate(
  hostId: string,
  templateId: string,
  roomName: string,
  overrides?: RoomTemplateOverrides
): Promise<ApiResponse<Room>> {
  try {
    // Load template
    const template = await getMatchTemplate(templateId);
    if (!template || !template.isActive) {
      return {
        success: false,
        error: { code: 'TEMPLATE_NOT_FOUND', message: 'Template is not available' },
        timestamp: Date.now(),
      };
    }

    // Load associated data
    const playerPool = await getPlayerPool(template.playerPoolId);
    const objectivePool = await getObjectivePool(template.defaultObjectivePool);

    // Create room with template data
    const newRoom: Room = {
      id: generateId(),
      hostId,
      displayName: roomName,
      sport: template.sport,
      gameMode: 'STANDARD',
      phase: 'LOBBY',
      
      // Template data
      templateId: template.id,
      templateVersion: template.version,
      
      settings: {
        ...DEFAULT_SETTINGS,
        ...template.rules,
        homeTeam: template.homeTeam.name,
        awayTeam: template.awayTeam.name,
        venue: template.venue,
      },
      
      roomCode: generateRoomCode(),
      players: [{ playerId: hostId, displayName: '', joinedAt: Date.now(), role: 'HOST', isReady: false }],
      
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isActive: true,
      maxPlayers: 8,
    };

    // Apply overrides if provided
    if (overrides) {
      if (overrides.homeTeam) newRoom.settings.homeTeam = overrides.homeTeam.name;
      if (overrides.awayTeam) newRoom.settings.awayTeam = overrides.awayTeam.name;
      if (overrides.expectedKickoff) newRoom.settings.expectedKickoff = overrides.expectedKickoff;
      // ... etc
    }

    // Save room
    await saveRoom(newRoom);

    return {
      success: true,
      data: newRoom,
      timestamp: Date.now(),
    };
  } catch (err) {
    return {
      success: false,
      error: { code: 'ROOM_CREATION_FAILED', message: err instanceof Error ? err.message : 'Failed to create room' },
      timestamp: Date.now(),
    };
  }
}
```

### Use Case 2: Template Discovery

```typescript
/**
 * List available templates for user
 * 
 * Could be filtered by:
 * - Sport
 * - Category (League, Tournament, Friendly)
 * - Difficulty
 * - Recency
 * - Popularity
 */

async function getAvailableTemplates(
  sport: Sport,
  filters?: {
    category?: string;
    difficulty?: string;
    isPopular?: boolean;
  }
): Promise<ApiResponse<MatchTemplate[]>> {
  try {
    let query = collection(db, 'matchTemplates')
      .where('sport', '==', sport)
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc');

    if (filters?.category) {
      query = query.where('category', '==', filters.category);
    }

    const snapshot = await getDocs(query);
    const templates = snapshot.docs.map(doc => doc.data() as MatchTemplate);

    return {
      success: true,
      data: templates,
      timestamp: Date.now(),
    };
  } catch (err) {
    return {
      success: false,
      error: { code: 'FETCH_TEMPLATES_FAILED', message: 'Could not fetch templates' },
      timestamp: Date.now(),
    };
  }
}
```

### Use Case 3: Admin Template Management

```typescript
/**
 * Admin creates or updates match template
 * 
 * Could be triggered by:
 * - Upcoming match in real league
 * - Tournament setup
 * - Seasonal event
 */

async function createMatchTemplate(
  adminId: string,
  templateData: Omit<MatchTemplate, 'id' | 'createdAt' | 'version'>
): Promise<ApiResponse<MatchTemplate>> {
  try {
    // Validate admin role
    const user = await getUser(adminId);
    if (user?.role !== 'ADMIN') {
      return {
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Only admins can create templates' },
        timestamp: Date.now(),
      };
    }

    // Create template
    const template: MatchTemplate = {
      ...templateData,
      id: generateId(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Save template
    await saveMatchTemplate(template);

    return {
      success: true,
      data: template,
      timestamp: Date.now(),
    };
  } catch (err) {
    return {
      success: false,
      error: { code: 'TEMPLATE_CREATE_FAILED', message: 'Could not create template' },
      timestamp: Date.now(),
    };
  }
}
```

---

## Migration Plan

### Phase 4.6 - Foundation
**Goal:** Establish template infrastructure without changing existing rooms

#### Steps:
1. **Create MatchTemplate type** in `types/entities.ts`
   - Time: 30 min
   - Change: Add TypeScript interface only
   - Risk: None (type-only)

2. **Create ObjectivePool type** in `types/entities.ts`
   - Time: 15 min
   - Change: Add TypeScript interface
   - Risk: None (type-only)

3. **Update Room type** to support templateId
   - Time: 15 min
   - Change: Add optional `templateId`, `templateVersion`, `overrides` fields
   - Risk: Low (backwards compatible - optional fields)

4. **Create MatchTemplateService**
   ```typescript
   // src/services/matchTemplateService.ts
   class MatchTemplateServiceClass {
     static async getTemplate(id: string): Promise<ApiResponse<MatchTemplate>>
     static async listTemplates(sport: Sport): Promise<ApiResponse<MatchTemplate[]>>
     static async createTemplate(data: MatchTemplate): Promise<ApiResponse<MatchTemplate>>
     static async updateTemplate(id: string, updates: Partial<MatchTemplate>): Promise<ApiResponse<void>>
     static async deactivateTemplate(id: string): Promise<ApiResponse<void>>
   }
   export const MatchTemplateService = MatchTemplateServiceClass;
   ```
   - Time: 1-2 hours
   - Change: New service (no modifications to existing code)
   - Risk: Low (isolated, new functionality)

5. **Create ObjectivePoolService**
   ```typescript
   // src/services/objectivePoolService.ts
   class ObjectivePoolServiceClass {
     static async getPool(id: string): Promise<ApiResponse<ObjectivePool>>
     static async listPools(sport: Sport): Promise<ApiResponse<ObjectivePool[]>>
     static async createPool(data: ObjectivePool): Promise<ApiResponse<ObjectivePool>>
   }
   export const ObjectivePoolService = ObjectivePoolServiceClass;
   ```
   - Time: 1 hour
   - Change: New service
   - Risk: Low (isolated)

6. **Create Firestore collections** (no data yet)
   - Time: 15 min
   - Action: Add security rules for `/matchTemplates`, `/objectivePools`, `/playerPools`
   - Risk: Low (empty collections)

#### Validation:
- TypeScript compiles without errors
- New services implement full ApiResponse pattern
- Existing room creation still works unchanged

---

### Phase 4.7 - Integration
**Goal:** Enable rooms to use templates; support legacy rooms without templates

#### Steps:
1. **Update RoomService** to support template-based creation
   - Add `createRoomFromTemplate()` method
   - Keep `createRoom()` unchanged for backwards compatibility
   - Time: 1-2 hours

2. **Create sample templates** for testing
   - 3-4 templates for football (e.g., "Liverpool vs Man City", "England vs Germany")
   - Time: 30 min
   - Data: Upload to Firestore manually

3. **Update Home page** to show template selection UI
   - Add template browser component
   - Add "Quick Create" button with template list
   - Keep "Custom Create" option for advanced users
   - Time: 2-3 hours
   - Risk: Medium (UI changes)

4. **Test room creation flow**
   - Create room from template
   - Verify draftable players match template pool
   - Verify objectives match template pool
   - Time: 1 hour

#### Validation:
- Rooms created from templates have correct data
- Template data is immutable (can't be edited through room)
- Rooms without templates still work

---

### Phase 4.8 - Advanced Features
**Goal:** Support template customization and advanced features

#### Steps:
1. **Enable room overrides**
   - Allow host to customize template after creation
   - Override home/away team, player pool, objectives
   - Track overrides in `room.overrides` field
   - Time: 2 hours

2. **Create admin template management UI**
   - Admin dashboard for creating/editing/deactivating templates
   - Bulk upload of templates
   - Time: 3-4 hours

3. **Implement template versioning**
   - Track which template version created room
   - Support updating templates with migration path
   - Time: 1-2 hours

4. **Add template analytics**
   - Track: most-used templates, win rates by template
   - Time: 2-3 hours

---

## Data Migration Strategy

### No Data Migration Required Initially

**Reason:** New templates are opt-in; existing rooms are unaffected

**Timeline:**
- **Phase 4.6:** Templates exist but no rooms use them
- **Phase 4.7:** New rooms can choose templates or custom creation
- **Phase 4.8:** Consider migrating legacy rooms to templates (optional)

### If Future Migration Needed

```typescript
/**
 * Migrate existing room to template
 * 
 * Only if we decide to consolidate duplicate room configs
 * Not recommended initially
 */

async function migrateRoomToTemplate(
  roomId: string,
  templateId: string
): Promise<ApiResponse<void>> {
  const room = await getRoom(roomId);
  const template = await getMatchTemplate(templateId);

  // Verify room matches template
  if (
    room.settings.homeTeam !== template.homeTeam.name ||
    room.settings.awayTeam !== template.awayTeam.name
  ) {
    return {
      success: false,
      error: { code: 'TEMPLATE_MISMATCH', message: 'Room data does not match template' },
      timestamp: Date.now(),
    };
  }

  // Update room with template reference
  room.templateId = template.id;
  room.templateVersion = template.version;

  await saveRoom(room);

  return {
    success: true,
    data: undefined,
    timestamp: Date.now(),
  };
}
```

---

## Security Considerations

### Firestore Security Rules

```javascript
// Allow anyone to read public templates
match /matchTemplates/{templateId} {
  allow read: if resource.data.isPublic == true;
  
  // Only admins can create/update templates
  allow create, update, delete: if request.auth.token.admin == true;
}

// ObjectivePools are admin-only
match /objectivePools/{poolId} {
  allow read: if true;
  allow write: if request.auth.token.admin == true;
}

// PlayerPools are admin-only
match /playerPools/{poolId} {
  allow read: if true;
  allow write: if request.auth.token.admin == true;
}

// Rooms can reference templates
match /rooms/{roomId} {
  // Existing rules...
  allow update: if request.resource.data.templateId == resource.data.templateId
    // Only allow changing templateId for new rooms or with admin override
}
```

---

## Database Size Impact

### Estimated Firestore Documents

```
Match Templates:      ~50-100 docs
Objective Pools:      ~20-30 docs
Player Pools:         ~100-200 docs (depends on frequency)
Total Template Data:  ~170-330 docs

Storage impact: <1 MB (very small)
```

---

## API Endpoints Summary

### MatchTemplateService

| Method | Path | Params | Returns |
|--------|------|--------|---------|
| getTemplate | `/api/templates/:id` | templateId | MatchTemplate |
| listTemplates | `/api/templates` | sport, category, filter | MatchTemplate[] |
| createTemplate | `/api/templates` | MatchTemplate data | MatchTemplate |
| updateTemplate | `/api/templates/:id` | updates | void |
| deactivateTemplate | `/api/templates/:id` | - | void |

### ObjectivePoolService

| Method | Path | Params | Returns |
|--------|------|--------|---------|
| getPool | `/api/objectives-pools/:id` | poolId | ObjectivePool |
| listPools | `/api/objectives-pools` | sport | ObjectivePool[] |
| createPool | `/api/objectives-pools` | ObjectivePool data | ObjectivePool |

### RoomService (Enhanced)

| Method | Path | Params | Returns |
|--------|------|--------|---------|
| createRoomFromTemplate | `/api/rooms/from-template` | templateId, roomName | Room |

---

## Rollback Plan

If templates cause issues:

1. **Feature flag:** Disable template UI
   - Rooms created with templates still function
   - Users can't create new template-based rooms

2. **Version tracking:** templateVersion allows identifying problematic templates
   - Can trace which rooms used which template version
   - Can deactivate specific template versions

3. **No schema changes required:** Templates are opt-in
   - Existing rooms work unchanged
   - Can disable templates without database migration

---

## Future Enhancements

### Seasonal Templates
```typescript
interface SeasonalTemplate extends MatchTemplate {
  seasonId: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  rewards?: {
    pointMultiplier: number;
    specialAchievements: string[];
  };
}
```

### Tournament Templates
```typescript
interface TournamentTemplate extends MatchTemplate {
  tournamentId: string;
  round: number;
  bracket: 'GROUP' | 'KNOCKOUT' | 'FINAL';
  nextMatchTemplateId?: string;
}
```

### Organization Templates
```typescript
// Organization-specific templates for leagues
// Only visible to organization members
```

---

## Implementation Checklist

- [ ] Create MatchTemplate type
- [ ] Create ObjectivePool type
- [ ] Update Room type
- [ ] Create MatchTemplateService
- [ ] Create ObjectivePoolService
- [ ] Add Firestore collections
- [ ] Add security rules
- [ ] Create sample templates
- [ ] Build template selector UI
- [ ] Test room creation from template
- [ ] Create admin template management
- [ ] Document template system for admins
- [ ] Monitor template usage analytics

---

**Document Complete:** Match Template Schema & Migration Plan  
**Status:** Ready for Phase 4.7 Implementation
