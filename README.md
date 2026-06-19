# Fiasco Futball

Fiasco Futball is a mobile-first web game that combines strategy and fun in a fast-paced football environment. This project is built using React, TypeScript, Vite, and Firebase, providing a robust framework for real-time gameplay and user interaction.

## Project Structure

The project is organized into several directories and files, each serving a specific purpose:

- **src/**: Contains all the source code for the application.
  - **components/**: Reusable components that make up the UI.
    - **GameBoard.tsx**: Manages the main gameplay screen.
    - **Player.tsx**: Represents an individual player.
    - **Team.tsx**: Displays team information and players.
    - **ScoreBoard.tsx**: Shows current scores of players and teams.
    - **ui/**: Contains UI elements like buttons, cards, and modals.
  - **pages/**: Contains the main pages of the application.
    - **Home.tsx**: Landing page for creating or joining a room.
    - **Game.tsx**: Manages the game flow and displays the GameBoard.
    - **Results.tsx**: Displays final leaderboard and results.
    - **Settings.tsx**: Allows users to configure game settings.
  - **hooks/**: Custom hooks for managing state and Firebase integration.
  - **services/**: Contains logic for Firebase and game management.
  - **types/**: TypeScript interfaces for data models.
  - **utils/**: Utility functions and constants.
  - **styles/**: CSS files for styling the application.
  - **App.tsx**: Main application component.
  - **main.tsx**: Entry point of the application.
  - **vite-env.d.ts**: TypeScript definitions for Vite environment variables.

- **public/**: Contains static assets like the favicon.
- **package.json**: Configuration file for npm dependencies and scripts.
- **tsconfig.json**: TypeScript configuration file.
- **vite.config.ts**: Vite configuration file.
- **.env.example**: Example environment configuration for Firebase.
- **.gitignore**: Specifies files to be ignored by Git.

## Getting Started

To get started with the Fiasco Futball project, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd fiasco-futball
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Set up Firebase**:
   - Create a Firebase project and configure your app.
   - Update the `.env.example` file with your Firebase configuration and rename it to `.env`.

4. **Run the development server**:
   ```
   npm run dev
   ```

5. **Open your browser**:
   Navigate to `http://localhost:3000` to view the application.

## Live App

**Play Fiasco Futball online:**

🎮 **Live URL**: https://USERNAME.github.io/REPOSITORY_NAME/

Replace `USERNAME` with your GitHub username and `REPOSITORY_NAME` with your repository name.

*Note: The live URL will be available after completing the deployment steps below.*

## Production Build

To create an optimized production build:

```bash
npm run build
npm run preview
```

This will:
- Build optimized bundles in `dist/`
- Start a preview server on `http://localhost:4173`
- Show production performance characteristics

## Deployment to GitHub Pages

Fiasco Futball is configured to deploy automatically to GitHub Pages using GitHub Actions.

### Quick Start (Estimated 15-20 minutes)

**1. Push to GitHub**
```bash
git push origin main
```

**2. Configure GitHub Pages**
- Go to Repository Settings > Pages
- Set Source to "GitHub Actions"
- Wait for first deployment to complete

**3. Add Firebase Configuration (IMPORTANT)**
- Go to Repository Settings > Secrets and variables > Actions
- Create 7 new repository secrets with your Firebase config:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
  - `VITE_FIREBASE_MEASUREMENT_ID`

Get these values from: Firebase Console > Project Settings > Your apps > Web app config

**4. Deploy**
- Push any commit to `main` branch
- GitHub Actions automatically builds and deploys
- Live URL available when workflow completes

For detailed deployment guide, see [PHASE_4_9_DEPLOYMENT.md](docs/PHASE_4_9_DEPLOYMENT.md).

## Environment Variables

Create a `.env.local` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env.local
```

Fill in your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_value
VITE_FIREBASE_AUTH_DOMAIN=your_value
VITE_FIREBASE_PROJECT_ID=your_value
VITE_FIREBASE_STORAGE_BUCKET=your_value
VITE_FIREBASE_MESSAGING_SENDER_ID=your_value
VITE_FIREBASE_APP_ID=your_value
VITE_FIREBASE_MEASUREMENT_ID=your_value
```

**Important**: `.env.local` is in `.gitignore` and should never be committed. For GitHub Pages deployment, use GitHub Actions secrets instead.

## How to Run a Playtest

Use the interactive playtest checklist to guide testing:

```bash
# See detailed playtest procedure
cat docs/PHASE_4_9_PLAYTEST_LAUNCH_CHECKLIST.md
```

**Quick Test Flow:**
1. Create a room (click "Create Room" on home page)
2. Share room code with other players
3. Wait for all players to join
4. Host reveals objectives
5. All players draft their teams
6. Start the live match
7. Host records events (goals, assists, saves, cards)
8. Watch leaderboard update in real-time
9. Complete match and see final results

**Expected Timing:**
- Objective reveal: < 15 seconds
- Full draft: < 60 seconds
- Per event entry: < 5 seconds
- Total match: 30-45 minutes (depends on soccer match)

For detailed playtest guide, see [PHASE_4_9_PLAYTEST_LAUNCH_CHECKLIST.md](docs/PHASE_4_9_PLAYTEST_LAUNCH_CHECKLIST.md).

## Project Status

**Current Phase**: 4.9 - GitHub Pages Launch & Playtest Readiness

- ✅ Phase 4.7: UI Foundation (reusable components, responsive design)
- ✅ Phase 4.8: Visual Polish (design system, microcopy, accessibility)
- ✅ Phase 4.9: GitHub Pages Deployment (live playtest ready)
- 🔜 Phase 5: Live Watch Party Playtest & Fixes

For detailed progress, see [DELIVERABLES.md](DELIVERABLES.md).

## Documentation

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - System architecture overview
- [PHASE_4_9_DEPLOYMENT.md](docs/PHASE_4_9_DEPLOYMENT.md) - Complete deployment guide
- [PHASE_4_9_PLAYTEST_LAUNCH_CHECKLIST.md](docs/PHASE_4_9_PLAYTEST_LAUNCH_CHECKLIST.md) - Playtest procedure
- [FIRESTORE_SCHEMA.md](docs/FIRESTORE_SCHEMA.md) - Database schema
- [STATE_MACHINE.md](docs/STATE_MACHINE.md) - Game state flows
- [QUICKSTART.md](docs/QUICKSTART.md) - Quick reference guide

## Troubleshooting

### Blank screen on GitHub Pages?
1. Check browser console (F12) for errors
2. Verify Firebase secrets are added to GitHub Actions
3. Confirm authorized domains include your GitHub Pages URL
4. See [PHASE_4_9_DEPLOYMENT.md](docs/PHASE_4_9_DEPLOYMENT.md#troubleshooting) for more solutions

### Build fails locally?
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npx tsc --noEmit

# Try building again
npm run build
```

### Firebase connection error?
1. Verify `.env.local` has all 7 Firebase variables
2. Check Firebase project is active
3. Verify Firestore is enabled
4. Check internet connection

## Performance

- **Initial load**: < 5 seconds on 4G mobile
- **Room creation**: < 2 seconds
- **Event entry**: < 5 seconds
- **Real-time sync**: < 100ms via Firestore

Bundle size is ~200 KB gzipped (Firebase SDK: 80KB, React: 40KB, App: 80KB).

## Browser Support

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- Mobile browsers (iOS Safari, Chrome Android)

Tested at 320px minimum viewport width for mobile.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.