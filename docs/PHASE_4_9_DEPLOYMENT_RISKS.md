# Phase 4.9 - GitHub Pages Deployment Risk Analysis

## Project Status Before Deployment

### Framework & Build
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 2.x
- **Current Output Directory**: `dist/`
- **Dev Server Port**: 3000
- **Package Manager**: npm (inferred from package.json)

### Routing
- **Router Type**: Context-based internal state machine (NOT React Router)
- **Phases**: LOBBY → OBJECTIVES_REVEAL → DRAFT → MATCH → RESULTS
- **URL Handling**: No URL-based routing needed (state stored in contexts)
- **Impact**: GitHub Pages deployment should be straightforward; no refresh/404 issues expected

### Firebase Configuration
- **Environment Variables**: Using VITE_* prefix (correct for Vite)
- **Validation**: Firebase config has runtime validation with helpful error messages
- **Emulator Support**: Available but requires .env configuration

### Known Issues Before Deployment

| Risk | Severity | Status | Mitigation |
|------|----------|--------|-----------|
| Missing index.html | HIGH | TBD | Will verify/create if needed |
| Base path not configured in vite.config.ts | HIGH | CONFIRMED | Need to add `base: '/repo-name/'` |
| .env.example uses wrong prefix (FIREBASE_ instead of VITE_FIREBASE_) | MEDIUM | CONFIRMED | Will update to VITE_ prefix |
| No GitHub Actions workflow exists | HIGH | CONFIRMED | Will create deploy.yml |
| Build not tested in production | HIGH | TBD | Will run `npm run build` and test |
| Asset paths may break under base path | MEDIUM | TBD | Will verify after build |
| Firebase may not allow GitHub Pages domain | MEDIUM | TBD | Will verify CORS/domain settings |
| No 404.html for GitHub Pages fallback | LOW | TBD | May need for future deep linking |

### Pre-Deployment Checklist

- [ ] index.html exists and references correct root div
- [ ] vite.config.ts has base path configured
- [ ] .env.example uses VITE_ prefix
- [ ] Production build succeeds (`npm run build`)
- [ ] Build output exists in `dist/` folder
- [ ] dist/index.html loads without errors
- [ ] dist/assets/ folder contains JS/CSS bundles
- [ ] Public assets are in dist/
- [ ] Firebase environment variables work in production
- [ ] No TypeScript errors
- [ ] No build warnings (or documented as non-blocking)
- [ ] mobile.css is optimized (no overflow issues at 320px)
- [ ] Assets load correctly in production build

## Deployment Strategy

**Strategy**: GitHub Actions → GitHub Pages
- **Trigger**: Push to main branch
- **Build**: `npm ci` + `npm run build`
- **Deploy**: Upload dist/ to GitHub Pages
- **URL Format**: `https://USERNAME.github.io/REPOSITORY_NAME/`
- **Configuration**: Set Pages source to "GitHub Actions" in repository settings

## Firebase Production Configuration

### Required Steps
1. Add Firebase web config to .env.local (user responsibility)
2. Verify Firebase domain allows GitHub Pages origin
3. Test room creation from live domain
4. Test multi-device sync from different networks

### Firestore Security
- Verify rules allow public room creation
- Verify rules allow room joining
- Verify rules allow event submission
- Test with actual devices

## Asset & Performance Considerations

### Bundle Size
- React 18: ~40KB gzipped
- Firebase SDK: ~80KB gzipped
- App code + CSS: ~50KB gzipped
- **Total estimated**: ~170KB (acceptable for prototype)

### Soccer Assets
- Static frames only (no animations at deploy)
- Soccer ball icon: ~2KB SVG or PNG
- Player idle sprites: deferred (too large for live playtest)
- No stadium background at deploy

### Loading Strategy
- CSS: Inline in build
- JS: Split by Vite default (main + vendor chunks)
- Assets: Lazy-loaded as needed

## Success Criteria (Go/No-Go)

### Go (Phase 4.9 Success)
- ✅ Production build completes without errors
- ✅ GitHub Actions workflow deploys successfully
- ✅ Live URL loads without blank screen
- ✅ Firebase connects from live domain
- ✅ Room creation works from live URL
- ✅ Room joining works from another device
- ✅ Game flow completes (objectives → draft → match → results)
- ✅ Mobile viewport works at 320px width
- ✅ No gameplay-breaking console errors

### No-Go (requires fixes before playtest)
- ❌ Build fails
- ❌ Blank screen on load
- ❌ Firebase connection error
- ❌ 404 errors on assets
- ❌ Routing breaks after refresh
- ❌ Mobile layout broken at 320px

## Next Phase Considerations

If deployment succeeds, Phase 5 will:
1. Schedule live playtest with 4-6 friends
2. Monitor performance and UX during match
3. Collect feedback
4. Prioritize fixes based on user confusion
5. Iterate on mobile UX if needed

If deployment fails, diagnostic approach:
1. Check build logs for errors
2. Verify .env.local has all Firebase config
3. Test locally with `npm run preview`
4. Check GitHub Pages settings
5. Review asset paths in dist/
