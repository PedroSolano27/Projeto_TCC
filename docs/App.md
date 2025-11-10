# Task Management App with Gamification - Developer Documentation

## Overview

This application is a task management system with integrated gamification features, built using React Native and Expo. The app allows users to create, manage, and track tasks while incorporating gaming elements such as experience points (XP), levels, streaks, and badges to increase user engagement and motivation.

The app implements a comprehensive task management system with gamification mechanics, providing users with rewards and progress tracking for completing tasks. It uses local storage for data persistence and includes features like task filtering, notifications, and theme customization.

## Dependencies

### Core Dependencies

- React Native
- Expo
- @react-navigation/native-stack
- expo-notifications
- AsyncStorage (implied from storage implementations)

### Development Dependencies

- TypeScript
- ESLint

## Types and Interfaces

### Task

```typescript
type Task = {
    id: string;
    title: string;
    tags: string[];
    notes?: string;
    points?: number;
    dueDate?: string;
    createdAt: string;
    xpReward?: number;
    completed: boolean;
    completedAt?: string;
    notificationId?: string | null;
};
```

### Gamification Types

```typescript
type Badge = {
    id: string;
    title: string;
    icon?: string;
    awardedAt?: string;
    description: string;
};

type UserProfile = {
    id: string;
    xp: number;
    level: number;
    coins: number;
    streak: number;
    points: number;
    badges: Badge[];
    lastCompletionDate: string | null;
};

type Transaction = {
    id: string;
    date: string;
    amount: number;
    reason: string;
    type: "earn" | "spend";
};
```

## Core Components

### TaskItem

Location: `app/components/TaskItem.tsx`

- Purpose: Renders individual task items in the task list
- Props: Task data and callback functions for task management

### XPBar

Location: `app/components/XPBar.tsx`

- Purpose: Visual representation of user's XP progress
- Props: Current XP and level information

### LevelUpModal

Location: `app/components/LevelUpModal.tsx`

- Purpose: Displays celebration modal when user levels up
- Props: Level achievement information

## Services

### TaskStorage

Location: `app/services/TaskStorage.ts`

- Purpose: Manages task persistence and CRUD operations
- Key Methods:
    - `getAllTasks(): Promise<Task[]>`
    - `updateTask(task: Task): Promise<void>`
    - `removeTask(id: string): Promise<void>`

### Gamification

Location: `app/services/Gamification.ts`

- Purpose: Handles gamification logic and rewards
- Key Features:
    - Task completion rewards
    - Streak calculations
    - XP and level progression
    - Badge awards

Example usage:

```typescript
await applyCompletionRewards(task, { basePoints: 20 });
```

### UserProfileStorage

Location: `app/services/UserProfileStorage.ts`

- Purpose: Manages user profile data persistence
- Key Methods:
    - `loadProfile(): Promise<UserProfile>`
    - `saveProfile(profile: UserProfile): Promise<void>`
    - `requiredXpForLevel(level: number): number`

## Screens

### TaskListScreen

Location: `app/screens/TaskListScreen.tsx`

- Purpose: Main screen displaying task list
- Features:
    - Task filtering (all/completed/pending)
    - Task completion toggling
    - Navigation to task form
    - Task deletion

### TaskFormScreen

Location: `app/screens/TaskFormScreen.tsx`

- Purpose: Screen for creating and editing tasks
- Features:
    - Task input form
    - Tag management
    - Due date selection
    - Points assignment

### SettingsScreen

Location: `app/screens/SettingsScreen.tsx`

- Purpose: User preferences and settings management
- Features:
    - Theme selection
    - Task filter preferences
    - Data export options

## Context

### SettingsContext

Location: `app/context/SettingsContext.tsx`

- Purpose: Global state management for app settings
- Features:
    - Theme management
    - Task filter preferences
    - Settings persistence

Usage:

```typescript
const { theme, taskFilter } = useSettings();
```

## Error Handling

The application implements error handling in several key areas:

1. Task Operations:
    - Task creation/update validation
    - Duplicate task checking
    - Storage operation error handling

2. Gamification:
    - Invalid reward calculations prevention
    - Streak calculation edge cases
    - Profile data validation

3. Storage:
    - AsyncStorage error handling
    - Data corruption prevention
    - Migration handling for data structure updates

## Notes and Implementation Details

### Performance Considerations

1. Task List:
    - Implements FlatList for efficient list rendering
    - Pagination for large task lists
    - Memoization of task items

### Data Persistence

1. Local Storage:
    - Uses AsyncStorage for data persistence
    - Implements data versioning
    - Handles data migration

### Gamification System

1. XP Calculation:
    - Base points for task completion
    - Bonus points for important tasks
    - Streak multipliers (up to 7 days)
    - Level progression system

### Best Practices

1. State Management:
    - Uses React Context for global state
    - Local state for component-specific data
    - Proper TypeScript typing

2. Code Organization:
    - Separate concerns into services
    - Reusable components
    - Type definitions in dedicated files

3. UI/UX:
    - Consistent theming
    - Responsive design
    - Loading states handling

## Limitations and Considerations

1. Data Storage:
    - Limited to local device storage
    - No cloud synchronization

2. Performance:
    - Large task lists may impact performance
    - Consider implementing virtual scrolling for large datasets

3. Notifications:
    - Platform-specific limitations apply
    - Background task restrictions on iOS
