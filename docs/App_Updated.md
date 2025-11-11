# Task Management App with Gamification - Developer Documentation

## Overview

This application is a comprehensive task management system with integrated gamification features, built using React Native and Expo. The app allows users to create, manage, and track tasks while incorporating gaming elements such as experience points (XP), levels, streaks, and unlockable achievements to increase user engagement and motivation.

The app implements a full-featured task management system with advanced gamification mechanics, providing users with rewards, progress tracking, and motivational feedback for completing tasks. It uses local storage (AsyncStorage) for data persistence and includes features like tag-based reward systems, multi-time notification scheduling, theme customization, and a comprehensive progress dashboard.

## Key Features

### Task Management

- Add, edit, and delete tasks with intuitive single-select tag categorization
- Tag-based reward system (points and XP automatically calculated based on selected category)
- Assign due dates with optional deadline notifications
- Simple, intuitive interface for quick task entry
- Task completion toggling with automatic gamification rewards
- Multi-time notification scheduling (1h, 2h, 4h, 8h, 24h before deadline)

### Tag System

Tasks are categorized using a single-select tag system, where each tag defines its own reward configuration. Tags are centralized in `app/config/tags.ts` for easy maintenance and updates.

**Available Tags:**

- **Urgente**: 20 points, 15 XP - High priority urgent tasks
- **Importante**: 15 points, 12 XP - Important tasks
- **Trabalho**: 10 points, 8 XP - Work-related tasks
- **Estudo**: 12 points, 10 XP - Study-related tasks
- **Pessoal**: 8 points, 6 XP - Personal tasks
- **Saúde**: 14 points, 11 XP - Health and fitness tasks
- **Finanças**: 16 points, 13 XP - Financial tasks
- **Criativo**: 11 points, 9 XP - Creative and artistic activities

### Notification Scheduling

Users can select multiple notification times when creating/editing tasks:

- **1 hour** before deadline
- **2 hours** before deadline
- **4 hours** before deadline
- **8 hours** before deadline
- **24 hours** before deadline

All selected notification times are scheduled simultaneously, allowing users to receive multiple reminders as desired. If no notification times are selected, the task will not trigger deadline reminders.

### Gamification System

- Award points and XP for each completed task (automatic calculation based on selected tag)
- Streak bonus: +2 XP per consecutive day (up to 7 days max)
- Dynamic levels and progression based on accumulated XP
- Streak tracking (up to 365 days)
- Multiple unlockable achievements and badges:
    - **Primeiro Passo**: Concluiu a primeira tarefa
    - **Uma Semana Incrível**: 7 dias consecutivos de tarefas concluídas
    - **Um Mês de Consistência**: 30 dias consecutivos
    - **Ascensão**: Atingiu nível 5
    - **Mestre**: Atingiu nível 10
    - **Lenda**: Atingiu nível 20
    - **Centenário**: Acumulou 100 pontos
    - **Destaque**: Acumulou 500 pontos
    - **Produtividade Extrema**: Acumulou 1000 pontos

### Progress Dashboard

- Statistics on productivity (tasks completed, pending, completion rate)
- Current level, XP progress, points, and coins display
- Streak counter with visual indicator
- Unlocked achievements and badges showcase
- Historical view of recently completed tasks with timestamps
- Visual progress bars and metric cards

### Gamification-Triggered Notifications

- Level-up celebrations
- New achievement unlocks
- Streak milestone notifications (7 days, 30 days)
- Motivational messages tied to user progress

### User Experience & Design

- Clean, responsive interface with reusable components
- Extracted UI components for consistency and reusability (Button, Card, FormField)
- Light and dark theme support with centralized global styles
- Motivational visuals and feedback
- Offline functionality with local data persistence
- Task filtering (All, Completed, Pending)

## Dependencies

### Core Dependencies

- React Native
- Expo
- @react-navigation/native-stack
- expo-notifications
- AsyncStorage (@react-native-async-storage/async-storage)
- react-native-screens
- expo-document-picker (for export/import)
- expo-file-system (for export/import)
- expo-sharing (for export/import)
- @expo/vector-icons

### Development Dependencies

- TypeScript
- ESLint

## Project Structure

```
app/
├── App.tsx                          # Main app component with navigation setup
├── config/
│   └── tags.ts                      # Tag reward configurations and utilities
├── components/
│   ├── LevelUpModal.tsx            # Level-up celebration modal
│   ├── TaskItem.tsx                # Individual task list item component
│   ├── XPBar.tsx                   # XP progress bar component
│   ├── TagSelector.tsx             # Single-select tag dropdown component
│   ├── TimeSelector.tsx            # Multi-select notification time component
│   ├── FormField.tsx               # Reusable form input wrapper
│   ├── Button.tsx                  # Reusable button component with variants
│   └── Card.tsx                    # Reusable card container component
├── context/
│   └── SettingsContext.tsx         # Global settings and theme state management
├── hooks/
│   └── useUserProfile.ts           # Custom hook for user profile data
├── screens/
│   ├── DashboardScreen.tsx         # Progress and statistics dashboard
│   ├── SettingsScreen.tsx          # Application settings screen
│   ├── TaskFormScreen.tsx          # Task creation/editing screen
│   └── TaskListScreen.tsx          # Main task list screen
├── services/
│   ├── Gamification.ts             # Gamification logic and badge system
│   ├── MotivationalNotifications.ts # Notifications and motivational messages
│   ├── TaskStorage.ts              # Task persistence and management
│   ├── UserProfileStorage.ts       # User profile persistence
│   └── ExportTasks.ts              # Export/import functionality
├── styles/
│   └── ScreenStyles.ts             # Centralized styling for all screens
├── types/
│   ├── GamificationTypes.ts        # Gamification type definitions
│   ├── StackParamList.ts           # Navigation stack parameter types
│   └── Task.ts                     # Task type definition
└── assets/                         # App assets and resources
```

## Types and Interfaces

### Task

```typescript
type Task = {
    id: string; // Unique identifier (UUID)
    title: string; // Task title
    selectedTag: string; // Single-selected tag ID from tag system
    notes?: string; // Optional notes or description
    dueDate?: string; // ISO string due date
    createdAt: string; // ISO string creation timestamp
    completed: boolean; // Completion status
    completedAt?: string; // ISO string completion timestamp
    notificationIds?: string[]; // Scheduled notification IDs (multiple times)
};
```

### Gamification Types

```typescript
type Badge = {
    id: string; // Unique badge identifier
    title: string; // Badge display title
    icon?: string; // Optional icon identifier
    awardedAt?: string; // ISO string award timestamp
    description: string; // Badge description
};

type UserProfile = {
    id: string; // User identifier
    xp: number; // Current experience points
    level: number; // Current level (1-based)
    coins: number; // Virtual currency
    streak: number; // Current streak (consecutive days)
    points: number; // Total accumulated points
    badges: Badge[]; // Unlocked badges array
    lastCompletionDate: string | null; // ISO string of last task completion
};

type Transaction = {
    id: string; // Transaction identifier
    date: string; // ISO string transaction date
    amount: number; // Transaction amount
    reason: string; // Reason for transaction
    type: "earn" | "spend"; // Transaction type
};
```

## Core Components

### DashboardScreen

Location: `app/screens/DashboardScreen.tsx`

- Purpose: Displays comprehensive user statistics and progress information
- Features:
    - User profile summary (level, points, coins)
    - XP progress bar with percentage
    - Streak counter with visual indicator
    - Productivity statistics (completed, pending, completion rate)
    - Achievements showcase
    - Recently completed tasks with timestamps
- Data: Loads from UserProfileStorage and TaskStorage
- Styling: Uses DashboardStyles from centralized ScreenStyles.ts

### TaskListScreen

Location: `app/screens/TaskListScreen.tsx`

- Purpose: Main screen displaying and managing task list
- Features:
    - Task filtering (all/completed/pending)
    - Task completion toggling with reward triggers
    - Navigation to task form and other screens
    - Task deletion with confirmation
    - Access to Dashboard and Settings
- Props: Navigation properties and route parameters
- Optimization: Uses useCallback for memoized functions

### TaskFormScreen

Location: `app/screens/TaskFormScreen.tsx`

- Purpose: Screen for creating and editing tasks
- Features:
    - Task input form with title and notes
    - Tag/category management via TagSelector
    - Due date selection with date picker
    - Multi-time notification scheduling via TimeSelector
    - Edit existing tasks or create new ones
- Props: Optional task data for editing
- Auto-Calculation: Points and XP are automatically calculated based on selected tag

### SettingsScreen

Location: `app/screens/SettingsScreen.tsx`

- Purpose: User preferences and settings management
- Features:
    - Theme selection (light/dark)
    - Task filter preferences
    - Default reminder timing configuration
    - Data export/import options
    - Settings persistence

### TaskItem

Location: `app/components/TaskItem.tsx`

- Purpose: Renders individual task items in the task list
- Props: Task data and callback functions for toggle/delete/edit operations
- Features: Task display, completion checkbox, edit and delete buttons

### XPBar

Location: `app/components/XPBar.tsx`

- Purpose: Visual representation of user's XP progress
- Props: None (uses useUserProfile hook)
- Features: Animated progress bar with percentage display and level information

### LevelUpModal

Location: `app/components/LevelUpModal.tsx`

- Purpose: Displays celebration modal when user levels up
- Props: Level achievement and reward coin information
- Features: Animated modal with congratulations message

### TagSelector

Location: `app/components/TagSelector.tsx`

- Purpose: Reusable component for single-select tag selection
- Features:
    - Modal-based dropdown interface
    - Displays tag name, description, and reward values
    - Visual selection indicator
    - Easy integration with forms

### TimeSelector

Location: `app/components/TimeSelector.tsx`

- Purpose: Reusable component for multi-select notification times
- Features:
    - Modal-based multi-select interface
    - Displays all available time options (1h, 2h, 4h, 8h, 24h)
    - Checkmarks for selected times
    - Summary display of selected times
    - "Feito" (Done) button to close modal

### Button

Location: `app/components/Button.tsx`

- Purpose: Reusable button component with multiple variants
- Props: label, variant (primary/success/danger/secondary), theme, disabled
- Features: Consistent styling, disabled state handling

### Card

Location: `app/components/Card.tsx`

- Purpose: Reusable card container component
- Props: theme, children, and standard View props
- Features: Consistent background and border styling

### FormField

Location: `app/components/FormField.tsx`

- Purpose: Reusable form input wrapper with label and error support
- Props: label, error, theme, and standard TextInput props
- Features: Consistent styling, error state visual feedback

## Services

### TaskStorage

Location: `app/services/TaskStorage.ts`

- Purpose: Manages task persistence and CRUD operations
- Key Methods:
    - `getAllTasks(): Promise<Task[]>` - Retrieves all tasks
    - `addTask(task: Task): Promise<void>` - Creates new task
    - `updateTask(updated: Task): Promise<void>` - Updates existing task
    - `removeTask(id: string): Promise<void>` - Deletes task
    - `completeTask(taskId: string): Promise<void>` - Marks task as complete and applies rewards
    - `scheduleReminders(task: Task): Promise<string[]>` - Schedules multiple notifications
    - `cancelReminder(notificationId: string): Promise<void>` - Cancels notification
- Features:
    - Multi-time notification scheduling (1h, 2h, 4h, 8h, 24h)
    - Event emission for gamification updates
    - Automatic notification cancellation on task completion/deletion
- Events: Emits `levelup` and `pointsEarned` events on task completion

### Gamification

Location: `app/services/Gamification.ts`

- Purpose: Handles gamification logic, rewards, and achievement system
- Key Features:
    - Tag-based task completion rewards calculation
    - Streak calculation and maintenance (up to 365 days)
    - XP and level progression with exponential formula
    - Dynamic badge/achievement awards based on milestones
- Key Methods:
    - `applyCompletionRewards(task: Task): Promise<{...}>` - Applies rewards and checks for level-ups and badges
    - `checkBadges(profile: UserProfile): Badge[]` - Validates and returns newly unlocked badges

### UserProfileStorage

Location: `app/services/UserProfileStorage.ts`

- Purpose: Manages user profile data persistence
- Key Methods:
    - `loadProfile(): Promise<UserProfile>` - Loads user profile from storage
    - `saveProfile(profile: UserProfile): Promise<void>` - Persists profile changes
    - `requiredXpForLevel(level: number): number` - Calculates XP needed for a level
- Formula: XP required = 100 × 1.4^(level-1)

### MotivationalNotifications

Location: `app/services/MotivationalNotifications.ts`

- Purpose: Provides motivational and gamification-triggered notifications
- Key Methods:
    - `scheduleMotivationalNotification(hoursFromNow?: number): Promise<void>` - Schedules random motivational message
    - `sendGamificationNotification(title: string, body: string, delay?: number): Promise<void>` - Sends custom notification
    - `notifyLevelUp(level: number, coins: number): Promise<void>` - Level-up notification
    - `notifyBadgeUnlocked(badgeTitle: string, description: string): Promise<void>` - Achievement notification
    - `notifyStreakMilestone(streak: number): Promise<void>` - Streak milestone notification
- Features:
    - Motivational message bank with 8+ variations
    - Delayed scheduling for gamification events

### ExportTasks

Location: `app/services/ExportTasks.ts`

- Purpose: Handles task data export and import
- Key Methods:
    - `exportTasks(): Promise<void>` - Exports tasks to JSON file
    - `importTasks(): Promise<void>` - Imports tasks from JSON file
- Features: Document picker, file sharing, error handling

## Context

### SettingsContext

Location: `app/context/SettingsContext.tsx`

- Purpose: Global state management for app settings
- State:
    - `theme` - Current theme (light/dark)
    - `taskFilter` - Default task filter preference
    - `defaultReminderMinutes` - Default reminder offset
- Methods:
    - `toggleTheme()` - Switches between light and dark themes
    - `setTheme(t: Theme)` - Sets specific theme
    - `setTaskFilter(f: TaskFilter)` - Sets task filter preference
    - `setDefaultReminderMinutes(m: number | null)` - Sets reminder timing
    - `resetSettings()` - Resets to default settings
- Persistence: Stores settings in AsyncStorage
- Optimization: Uses useCallback for memoized functions

## Hooks

### useUserProfile

Location: `app/hooks/useUserProfile.ts`

- Purpose: Custom hook for loading and managing user profile state
- Returns: `{ profile: UserProfile | null, setProfile: Function }`
- Usage: Provides reactive profile data in components

## Error Handling

The application implements comprehensive error handling in several key areas:

1. **Task Operations**:
    - Task creation/update validation
    - Duplicate task prevention
    - Storage operation error handling
    - Notification scheduling with fallbacks

2. **Gamification**:
    - Invalid reward calculations prevention
    - Streak calculation edge cases (same-day double completion)
    - Profile data validation and defaults
    - Badge unlock condition validation

3. **Storage**:
    - AsyncStorage try-catch blocks
    - Data corruption prevention with JSON validation
    - Migration handling for data structure updates
    - Graceful fallbacks to default values

4. **Notifications**:
    - Permission request handling
    - Schedule failure recovery
    - Notification cancellation error handling

## Performance Considerations

1. **Task List Optimization**:
    - FlatList implementation for efficient rendering
    - Task filtering performed in-memory
    - Memoization of task items and callbacks to prevent unnecessary re-renders
    - useCallback hooks for function stability

2. **Data Management**:
    - Single AsyncStorage key per entity type
    - Efficient JSON serialization
    - Minimal re-renders with proper dependency arrays

3. **Notifications**:
    - Asynchronous scheduling prevents UI blocking
    - Event emitter for decoupled gamification updates

## Data Persistence

1. **Local Storage** (AsyncStorage):
    - `@tasks_v1` - Array of all tasks
    - `@user_profile_v1` - User profile data
    - `@app_settings_v1` - Application settings
    - Versioning for future migrations

2. **Data Formats**:
    - JSON serialization for all data structures
    - ISO 8601 timestamps for dates
    - UUID for entity identifiers

## Gamification System Details

### XP Calculation

- **Base Points**: From tag configuration (e.g., 20 for Urgent, 8 for Personal)
- **Base XP**: From tag configuration (e.g., 15 for Urgent, 6 for Personal)
- **Streak Bonus**: 2 XP per consecutive day (up to 7 days max = 14 bonus)
- **Total XP Gain**: baseXP + (min(streak, 7) × 2) × 0.5

### Level Progression

- Formula: Required XP = 100 × 1.4^(level-1)
- Level 1: 100 XP
- Level 10: ~14,000 XP
- Level 20: ~196,000 XP
- No level cap

### Badge System

- Badges unlock automatically based on profile milestones
- Each badge has unique identifier, title, description, and award timestamp
- Badges are cumulative and persistent
- 9 different badge types covering various achievements

### Streak System

- Increments on first task completion each day
- Resets if no tasks completed for 24 hours
- Maximum cap: 365 days
- Provides bonus points and unlocks milestone badges
- Prevents double-counting same-day completions

### Tag-Based Reward System

Tasks no longer have manual point/XP inputs. Instead, rewards are determined by the selected tag:

**Calculation Flow:**

1. User selects a tag when creating/editing a task
2. Tag's `basePoints` and `baseXP` are read from tag configuration
3. Streak bonus is calculated (min(streak, 7) × 2)
4. On task completion:
    - Points = tag.basePoints + streakBonus
    - XP = tag.baseXP + floor(streakBonus × 0.5)
5. Profile is updated with new totals

**Benefits:**

- Consistent and predictable rewards
- Easy to maintain and adjust via config file
- Encourages task categorization
- Supports gamification balance adjustments

## Navigation

The app uses React Navigation with a native stack navigator:

- **List** (TaskListScreen) - Main task list view
- **Dashboard** - Progress and statistics view
- **Form** (TaskFormScreen) - Task creation/editing
- **Settings** (SettingsScreen) - Application settings

## Best Practices Implemented

1. **State Management**:
    - React Context for global settings
    - Local component state for UI-specific data
    - Custom hooks for reusable logic
    - Proper TypeScript typing throughout
    - useCallback for function memoization

2. **Code Organization**:
    - Separation of concerns (UI, logic, storage)
    - Reusable, composable components
    - Centralized type definitions
    - Service-based architecture
    - Cleaned code without unnecessary comments

3. **UI/UX**:
    - Consistent theming and styling
    - Responsive design patterns
    - Loading states and error feedback
    - Accessible component interactions
    - Visual feedback for user actions

4. **Data Integrity**:
    - Transaction-like updates in gamification
    - Duplicate prevention for same-day rewards
    - Atomic operations with rollback capability

## Code Quality Improvements

1. **Comment Cleanup**:
    - Removed non-essential header comments
    - Removed ESLint disable directives where unnecessary
    - Preserved important documentation comments

2. **Component Consistency**:
    - Standardized naming conventions
    - Consistent error handling patterns
    - Uniform styling approach across all screens

3. **Performance Optimization**:
    - Memoized callbacks with useCallback
    - Efficient dependency arrays
    - Optimized re-render patterns

## Limitations and Considerations

1. **Data Storage**:
    - Limited to local device storage (~10MB typical limit)
    - No cloud synchronization
    - Device backup depends on platform-specific backup solutions

2. **Performance**:
    - Large task lists (10,000+) may impact performance
    - Consider implementing virtual scrolling for very large datasets
    - Notification scheduling has platform-specific limitations

3. **Notifications**:
    - iOS has stricter background task restrictions
    - Notification permissions required per platform
    - Maximum scheduled notifications limited by OS

4. **Cross-Platform**:
    - Dark theme support depends on platform version
    - Icon availability varies by platform
    - Date picker behavior differs between iOS and Android

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
9. Push notification scheduling optimization
10. Machine learning-based task suggestions

## Recent Changes (Version Update)

### New Features

1. **Multi-Time Notifications**: Users can now select multiple notification times (1h, 2h, 4h, 8h, 24h) instead of a single reminder
2. **Automatic Reward Calculation**: Points and XP are now automatically determined by the selected task tag
3. **Centralized Dashboard Styling**: Dashboard screen now uses consistent styles from ScreenStyles.ts

### Component Improvements

1. **Reusable Components**: Extracted common UI patterns into Button, Card, and FormField components
2. **Improved Performance**: Added useCallback hooks in context and screens to prevent unnecessary re-renders
3. **Better Type Safety**: Enhanced TypeScript usage throughout components

### Code Quality

1. **Cleaned Codebase**: Removed unnecessary comments and ESLint disables
2. **Consistent Patterns**: Standardized function naming and error handling
3. **Optimized Dependencies**: Fixed React Hook dependency arrays for better performance

### Documentation

1. Updated to reflect multi-time notification system
2. Clarified automatic XP/points calculation based on tags
3. Added notes on component architecture and styling patterns
