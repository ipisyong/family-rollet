# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Korean family-friendly roulette game web application designed for GitHub Pages deployment. The project creates an engaging, fair, and customizable wheel-spinning game for family gatherings and group activities using React, TypeScript, and Three.js.

## Development Commands

```bash
npm install                    # Install dependencies
npm run dev                   # Start development server at http://localhost:5173/rollet-games/
npm run build                 # Build for production
npm run preview               # Preview production build
npm run lint                  # Run ESLint
npm run type-check            # Run TypeScript compiler check
```

## Core Architecture

### Technology Stack
- **Frontend**: React 19 + TypeScript + Vite
- **3D Rendering**: react-three-fiber + three.js for 2.5D wheel visualization
- **State Management**: Zustand with persistence
- **Audio**: WebAudio API for sound effects and haptic feedback
- **PWA**: Vite PWA plugin with service worker for offline support
- **Deployment**: GitHub Pages with automated CI/CD

### Project Structure
```
src/
├── components/
│   ├── Wheel3D.tsx           # Main 3D wheel with physics and interaction
│   ├── SegmentEditor.tsx     # Modal for editing wheel segments
│   ├── PresetPicker.tsx      # Preset selection interface
│   └── Confetti.tsx          # Victory animation system
├── state/
│   └── wheel.store.ts        # Zustand store for app state
├── lib/
│   ├── rng.ts               # Cryptographically secure random number generation
│   ├── physics.ts           # Wheel rotation physics and easing
│   ├── probability.ts       # Weighted probability calculations
│   └── audio.ts             # WebAudio sound effects and vibration
├── data/
│   └── presets.ts           # Korean family-friendly wheel presets
└── types/
    └── index.ts             # TypeScript type definitions
```

## Key Implementation Details

### Fairness & Randomness System
- **CSPRNG**: Uses `crypto.getRandomValues()` for truly fair results
- **Pre-determined Results**: Outcome is calculated at spin start, animation is purely visual
- **Weighted Probability**: Integer-based weights with cumulative distribution
- **Anti-manipulation**: No result modification during animation

### 3D Wheel Implementation (`Wheel3D.tsx`)
- **Ring Geometry**: Uses Three.js ring geometry for segment rendering
- **React Three Fiber**: Declarative 3D scene management
- **Click Interaction**: Segments are clickable for inline editing
- **Physics Integration**: Real-time rotation with easing functions

### Physics System (`physics.ts`)
- **Easing Function**: `easeOutCubic` for natural deceleration
- **Duration**: 3-7 seconds with random variation
- **Target Calculation**: Pre-calculated final angle with extra rotations
- **Boundary Detection**: Near-boundary detection for enhanced tension

### Audio System (`audio.ts`)
- **Tick Sounds**: Frequency-modulated clicks on segment boundaries
- **Spin Sounds**: Start/win sound sequences
- **Mobile Safari**: Handles autoplay restrictions with user gesture initialization
- **Vibration API**: Haptic feedback for supported devices

### State Management (`wheel.store.ts`)
- **Persistent Storage**: localStorage with versioning
- **Default Segments**: Korean family-friendly defaults
- **History Tracking**: Last 20 spin results
- **Settings**: Sound, vibration, theme preferences

## Korean Content & Localization

The app includes 6 preset categories with Korean text:
- **가족 보상** (Family Rewards): 게임 30분, 과자 고르기, 영화 선택권
- **당번 정하기** (Chore Assignment): 설거지 당번, 청소 당번
- **메뉴 고르기** (Menu Selection): 치킨, 피자, 짜장면, 한식
- **주말 활동** (Weekend Activities): 영화관 가기, 공원 산책
- **공부 휴식** (Study Break): 15분 휴식, 스트레칭
- **생일 선물** (Birthday Gifts): 책, 게임, 옷

## PWA & Deployment

### Service Worker
- **Vite PWA Plugin**: Automatic SW generation with Workbox
- **Offline Support**: Core functionality works without internet
- **Update Strategy**: Auto-update with user notification

### GitHub Pages Deployment
- **Base URL**: `/rollet-games/` for GitHub Pages
- **Workflow**: `.github/workflows/deploy.yml` with type-check and lint
- **Build Target**: ES2020 with chunk optimization
- **Manual Chunks**: Separate chunks for three.js and react-three libraries

## Performance Considerations

### Bundle Optimization
- **Manual Chunks**: Three.js (703KB), React-Three (469KB), Spring (36KB)
- **Code Splitting**: Automatic chunk splitting for better loading
- **Gzip Compression**: ~360KB total gzipped size

### Browser Compatibility
- **ES2020 Target**: Modern browser features
- **WebAudio**: Graceful degradation for unsupported browsers
- **Three.js**: Hardware-accelerated WebGL rendering

## Testing & Quality

Run these commands before committing:
```bash
npm run type-check    # Verify TypeScript types
npm run lint          # Check code style
npm run build         # Ensure production build works
```

Common issues to watch for:
- **Three.js Performance**: Monitor frame rates on low-end devices
- **Audio Context**: Ensure proper initialization after user gesture
- **Mobile Safari**: Test PWA installation and audio playback
- **Persistence**: Verify localStorage state management

## Accessibility Features

- **Keyboard Navigation**: Space/Enter for spinning
- **ARIA Labels**: Screen reader support for UI elements
- **Motion Reduction**: Respects `prefers-reduced-motion`
- **High Contrast**: Support for high contrast mode
- **Touch Targets**: Minimum 44px touch targets for mobile