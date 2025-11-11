# Task Management App - Project Overview

## Application Purpose

This application is a comprehensive task management system with integrated gamification features, built using React Native and Expo. The app allows users to create, manage, and track tasks while incorporating gaming elements such as experience points (XP), levels, streaks, and unlockable achievements to increase user engagement and motivation.

The app implements a full-featured task management system with advanced gamification mechanics, providing users with rewards, progress tracking, and motivational feedback for completing tasks. It uses local storage (AsyncStorage) for data persistence and includes features like tag-based reward systems, multi-time notification scheduling, theme customization, and a comprehensive progress dashboard.

## Project Metadata

- **Author**: Pedro Henrique Spasin Solano
- **Advisor**: Roger Sá da Silva
- **Repository**: Projeto_TCC (GitHub: PedroSolano27)
- **Current Branch**: main
- **Version**: 1.0.0

## Technology Stack

### Core Technologies

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (native-stack)
- **State Management**: React Context API
- **Data Persistence**: AsyncStorage (local device storage)
- **Notifications**: expo-notifications
- **UI Framework**: React Native built-in components

### Key Dependencies

- `@react-navigation/native-stack` - Screen navigation
- `expo-notifications` - Notification scheduling
- `@react-native-async-storage/async-storage` - Local storage
- `@react-native-community/datetimepicker` - Date/time selection
- `expo-document-picker` - File selection for import/export
- `expo-file-system` - File system operations
- `expo-sharing` - Share functionality
- `@expo/vector-icons` - Icon library
- `uuid` - Unique identifier generation

### Development Tools

- TypeScript (~5.9.2)
- ESLint (^9.25.0)
- Expo CLI and tooling

## Core Features at a Glance

### 1. Task Management

- Create, edit, delete tasks with intuitive interface
- Single-select tag categorization
- Due date assignment with optional notifications
- Multi-time notification scheduling (1h, 2h, 4h, 8h, 24h)
- Task completion tracking with immediate rewards
- Support for task notes and descriptions

### 2. Gamification System

- **Experience & Levels**: Dynamic level progression based on accumulated XP
- **Points System**: Points earned per task completion (tag-based)
- **Streaks**: Consecutive day tracking with bonus multiplier
- **Achievements**: 9 unique badges unlocked through milestones
- **Virtual Currency**: Coins earned as rewards for task completion

### 3. User Dashboard

- Comprehensive progress overview
- Real-time statistics (completion rate, pending tasks)
- Achievement showcase
- Recent task history with timestamps
- XP progress bar visualization
- Streak counter

### 4. Settings & Customization

- Theme selection (light/dark mode)
- Task filter preferences (all/completed/pending)
- Data export/import functionality
- Persistent settings storage

## Project Structure

```
app/
├── App.tsx                          # Main app component with navigation setup
├── config/
│   └── tags.ts                      # Tag reward configurations
├── components/                      # Reusable UI components
│   ├── Button.tsx                   # Reusable button with variants
│   ├── Card.tsx                     # Reusable card container
│   ├── FormField.tsx                # Reusable form input wrapper
│   ├── LevelUpModal.tsx             # Level-up celebration modal
│   ├── TagSelector.tsx              # Tag selection component
│   ├── TaskItem.tsx                 # Task list item renderer
│   ├── TimeSelector.tsx             # Notification time selector
│   └── XPBar.tsx                    # XP progress bar
├── context/
│   └── SettingsContext.tsx          # Global app settings state
├── hooks/
│   └── useUserProfile.ts            # Custom hook for profile data
├── screens/                         # Main application screens
│   ├── DashboardScreen.tsx          # Progress dashboard
│   ├── SettingsScreen.tsx           # Settings management
│   ├── TaskFormScreen.tsx           # Task creation/editing
│   └── TaskListScreen.tsx           # Main task list
├── services/                        # Business logic services
│   ├── ExportTasks.ts               # Import/export functionality
│   ├── Gamification.ts              # Gamification logic
│   ├── MotivationalNotifications.ts # Notifications system
│   ├── TaskStorage.ts               # Task CRUD operations
│   └── UserProfileStorage.ts        # Profile persistence
├── styles/
│   └── ScreenStyles.ts              # Centralized theme styling
├── types/                           # TypeScript definitions
│   ├── GamificationTypes.ts         # Gamification interfaces
│   ├── StackParamList.ts            # Navigation types
│   └── Task.ts                      # Task model definition
└── assets/                          # App assets and resources
```

## Key Design Principles

### 1. Component-Based Architecture

- Small, reusable UI components (`Button`, `Card`, `FormField`)
- Specialized components for features (`TagSelector`, `TimeSelector`)
- Screen components handle navigation and data flow

### 2. Separation of Concerns

- **UI Layer**: React components handle presentation
- **Business Logic**: Services handle core functionality (GameState, TaskManagement)
- **State Management**: Context provides global state, local state for UI
- **Data Layer**: AsyncStorage with service abstractions

### 3. Type Safety

- Strict TypeScript configuration
- Defined interfaces for all data structures
- Type-safe navigation parameters
- No `any` types in core logic

### 4. Performance Optimization

- useCallback for memoized functions
- Proper dependency arrays in hooks
- Efficient re-render patterns
- Event emitter for decoupled updates

## Known Issues (Pre-Refactoring)

The following issues have been identified and addressed in this refactoring:

1. ✅ **Notification Reset Bug** - FIXED: Notifications reverted to default when editing tasks
2. ✅ **Default Reminder Setting** - REMOVED: Eliminated problematic default reminder from settings
3. ✅ **Component Documentation** - Split monolithic docs into modular sections
4. ✅ **Code Comments** - Added inline documentation for complex logic

## Supported Platforms

- **iOS**: Via Expo (with native stack navigator support)
- **Android**: Via Expo (with native stack navigator support)
- **Web**: Limited support via Expo web (notifications may not work)

## Data Storage Architecture

### Storage Keys

- `@tasks_v1` - Array of all tasks (JSON)
- `@user_profile_v1` - User profile with stats and achievements
- `@app_settings_v1` - Application settings and preferences

### Data Versioning

- Keys include version suffix (`_v1`) for future migration support
- JSON serialization for all data structures
- ISO 8601 timestamps throughout
- UUID for entity identifiers

## Future Enhancements

Potential improvements for future versions:

1. Cloud synchronization and backup
2. Social features (leaderboards, challenges)
3. Advanced analytics and insights
4. Custom theme editor
5. Voice-based task creation
6. Integration with calendar apps
7. Habit tracking enhancements
8. Multiplayer challenges
9. Machine learning-based task suggestions
10. Backend API integration for data sync

## Limitations

1. **Storage**: Limited to local device storage (~10MB typical)
2. **Performance**: Large task lists (10,000+) may impact performance
3. **Notifications**: Platform-specific limitations (iOS background restrictions)
4. **Cross-Platform**: Some features vary by platform (date picker, dark theme detection)

## Getting Started

For setup and development instructions, see the respective documentation files for each component and service.
