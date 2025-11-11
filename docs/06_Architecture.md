# Architecture & Development Guide

## Application Architecture

### Layered Architecture

The application follows a clean layered architecture:

```
┌─────────────────────────────────────┐
│  Presentation Layer (Screens/UI)    │
│  DashboardScreen, TaskFormScreen    │
│  TaskListScreen, SettingsScreen     │
└──────────────────┬──────────────────┘
                   │
┌──────────────────▼──────────────────┐
│  Component Layer (Reusable UI)      │
│  Button, Card, TagSelector, etc.    │
└──────────────────┬──────────────────┘
                   │
┌──────────────────▼──────────────────┐
│  Business Logic Layer (Services)    │
│  TaskStorage, Gamification,         │
│  MotivationalNotifications, etc.    │
└──────────────────┬──────────────────┘
                   │
┌──────────────────▼──────────────────┐
│  State Management (Context)         │
│  SettingsContext, Custom Hooks      │
└──────────────────┬──────────────────┘
                   │
┌──────────────────▼──────────────────┐
│  Data Layer (AsyncStorage)          │
│  Local device persistence           │
└─────────────────────────────────────┘
```

### Data Flow

**Task Creation**:

```
User Input → TaskFormScreen → TaskStorage → AsyncStorage
                              ↓
                        Schedule Notifications
```

**Task Completion**:

```
TaskListScreen → TaskStorage → Gamification → UserProfileStorage
                      ↓                      ↓
                  Cancel Notif         Check Badges
                                             ↓
                    GameificationEvents → Notifications → UI Update
```

**State Updates**:

```
UI Components → SettingsContext → AsyncStorage (persisted)
                ↓
         All components subscribed via useSettings()
```

## Navigation Structure

The app uses React Navigation's native-stack navigator:

```
Stack Navigator
├── List (TaskListScreen) - DEFAULT
│   └── Can navigate to: Dashboard, Settings, Form
├── Dashboard (DashboardScreen)
│   └── Can navigate to: List, Settings
├── Form (TaskFormScreen)
│   └── Can navigate back to List
└── Settings (SettingsScreen)
    └── Can navigate to: List
```

**Navigation Configuration**: `app/App.tsx`

```typescript
<Stack.Navigator initialRouteName="List">
    <Stack.Screen name="List" component={TaskListScreen} />
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="Form" component={TaskFormScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
</Stack.Navigator>
```

## State Management

### Global State (Context API)

**SettingsContext** - Manages application-wide settings:

- Theme (light/dark)
- Task filter preference (all/completed/pending)
- Persisted to AsyncStorage

```typescript
const { theme, toggleTheme, taskFilter, setTaskFilter } = useSettings();
```

### Local State

**Screen/Component Level**:

- Form inputs
- Modal visibility
- Loading indicators
- Temporary UI state

**Storage Service State**:

- Tasks array
- User profile
- Notifications

## Type System

### Core Types

**Task.ts**:

```typescript
type Task = {
    id: string;
    title: string;
    selectedTag: string;
    notes?: string;
    dueDate?: string;
    createdAt: string;
    completed: boolean;
    completedAt?: string;
    notificationIds?: string[];
};
```

**GamificationTypes.ts**:

```typescript
type UserProfile = {
    /* ... */
};
type Badge = {
    /* ... */
};
type Transaction = {
    /* ... */
};
```

**StackParamList.ts**:

```typescript
type RootStackParamList = {
    List: undefined;
    Dashboard: undefined;
    Form: { task?: Task } | undefined;
    Settings: undefined;
};
```

### Benefits

- TypeScript strict mode enabled
- Type-safe navigation
- IDE autocomplete support
- Early error detection
- Self-documenting code

## Styling Architecture

### Centralized Styling

**Location**: `app/styles/ScreenStyles.ts`

All styles defined in one place with theme support:

```typescript
export const createStyles = (theme: Theme) => ({
    TaskListStyles: StyleSheet.create({
        /* ... */
    }),
    DashboardStyles: StyleSheet.create({
        /* ... */
    }),
    TaskFormStyles: StyleSheet.create({
        /* ... */
    }),
    // ... more style objects
});
```

### Usage Pattern

```typescript
const { theme } = useSettings();
const { TaskListStyles } = createStyles(theme);

<View style={TaskListStyles.container}>
    <Text style={TaskListStyles.title}>Title</Text>
</View>
```

### Theme Colors

Defined as constants in style creation:

```typescript
const colors = {
    accent: "#0984e3",
    danger: "#e74c3c",
    success: "#27ae60",
    // ... more colors
};
```

Light and dark variants are automatically handled through conditional logic.

## Error Handling Strategy

### Levels of Error Handling

**1. Validation Errors**

```typescript
if (!title.trim()) {
    Alert.alert("Error", "Title is required");
    return;
}
```

**2. Async Operation Errors**

```typescript
try {
    await operation();
} catch (err) {
    console.warn("Operation failed:", err);
    Alert.alert("Error", "Something went wrong");
}
```

**3. Silent Failures**

```typescript
try {
    await cancelNotification(id);
} catch {
    // Silently ignore if already cancelled
}
```

### Error Feedback

- **User-facing**: Alert dialogs, toast messages
- **Developer**: Console warnings and logs
- **No crashes**: All errors handled gracefully

## Performance Optimization

### Memoization

**useCallback** for stable function references:

```typescript
const handleSave = useCallback(() => {
    // ... save logic
}, [dependencies]);
```

**useContext** for efficient state subscription:

```typescript
const { theme } = useSettings();
// Component only re-renders when theme changes
```

### Rendering Optimization

**FlatList** for large lists:

```typescript
<FlatList
    data={tasks}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <TaskItem {...item} />}
/>
```

**Proper key extraction** prevents re-renders:

```typescript
// ✅ Good - stable, unique identifier
keyExtractor={(item) => item.id}

// ❌ Bad - index changes on reorder
keyExtractor={(item, index) => String(index)}
```

### Storage Optimization

**Single query pattern**:

```typescript
// ✅ One query - efficient
const tasks = await getAllTasks();

// ❌ Multiple queries - inefficient
for (let i = 0; i < 100; i++) {
    await getTask(id);
}
```

## Testing Strategy

### Unit Testing Areas

1. **Gamification Logic**
    - Reward calculation
    - Streak mechanics
    - Badge unlock conditions
    - XP calculations

2. **Data Validation**
    - Task creation constraints
    - Profile data integrity
    - Storage persistence

3. **Utility Functions**
    - Date calculations
    - Tag lookups
    - Level requirements

### Integration Testing

1. **Task Lifecycle**
    - Create → Read → Update → Delete
    - Notification scheduling
    - Gamification triggers

2. **User Flows**
    - Complete task and receive rewards
    - Edit task and update notifications
    - Import/export functionality

### Manual Testing Checklist

- [ ] Task creation with all fields
- [ ] Task editing preserves notification settings
- [ ] Task completion triggers rewards
- [ ] Streak calculation correct
- [ ] Badge unlock notifications
- [ ] Theme switching
- [ ] Export/import tasks
- [ ] Notification scheduling
- [ ] Same-day completion doesn't exploit streak

## Development Workflow

### Setup

1. Clone repository
2. Install Expo CLI: `npm install -g expo-cli`
3. Install dependencies: `npm install`
4. Start dev server: `npm start`
5. Scan QR code with Expo Go app

### Making Changes

1. Create feature branch
2. Make changes following code patterns
3. Test functionality
4. Commit with clear messages
5. Push and create PR

### Code Standards

- TypeScript strict mode enabled
- ESLint configuration enforced
- Consistent naming conventions
- Comments for complex logic
- Type annotations required

### Common Commands

```bash
npm start                    # Start development server
npm run android             # Run on Android device
npm run ios                 # Run on iOS device
npm run web                 # Run on web
npm run lint                # Run ESLint
```

## Git Workflow

### Branch Naming

```
feature/feature-name
bugfix/bug-description
refactor/what-was-refactored
docs/what-was-documented
```

### Commit Messages

```
[type] description

fix: Correct notification reset bug
feature: Add task export functionality
refactor: Simplify gamification logic
docs: Update API documentation
```

### PR Guidelines

1. Clear description of changes
2. Reference related issues
3. Testing verification
4. Before/after screenshots if UI changes

## Security Considerations

### Data Security

- **Local Storage Only**: No sensitive data transmitted
- **No Authentication**: Local device scope
- **No Backend**: Eliminates server compromise risk
- **Encryption**: Consider for future versions

### Input Validation

- Validate all user inputs
- Sanitize task titles and notes
- Validate date selections
- Check tag IDs against known values

### Permissions

- Request notification permissions at app start
- Handle permission denial gracefully
- No unnecessary permission requests

## Future Improvements

### Short-term (v1.1)

- [ ] Add task search/filter
- [ ] Task categories/labels
- [ ] Recurring tasks
- [ ] Task priorities
- [ ] Task subtasks

### Mid-term (v1.5)

- [ ] Cloud sync (Firebase)
- [ ] Leaderboards
- [ ] Social sharing
- [ ] Custom themes
- [ ] Analytics dashboard

### Long-term (v2.0)

- [ ] Web app version
- [ ] Collaborative tasks
- [ ] Advanced scheduling
- [ ] AI task suggestions
- [ ] Voice input

## Debugging Tips

### Console Logging

```typescript
console.log("Value:", value); // Normal logs
console.warn("Warning:", message); // Warnings
console.error("Error:", error); // Errors
```

### React DevTools

- Install React DevTools browser extension
- Inspect component hierarchy
- Profile component renders

### AsyncStorage Debugging

```typescript
// View all stored data
const keys = await AsyncStorage.getAllKeys();
for (const key of keys) {
    const value = await AsyncStorage.getItem(key);
    console.log(key, JSON.parse(value));
}
```

### Notification Debugging

```typescript
// Check scheduled notifications
const scheduled = await Notifications.getAllScheduledNotificationsAsync();
console.log("Scheduled:", scheduled);
```

## Code Review Checklist

- [ ] Types defined correctly
- [ ] Error handling in place
- [ ] No console errors/warnings
- [ ] Comments for complex logic
- [ ] Performance optimized
- [ ] Consistent with patterns
- [ ] Tests pass
- [ ] No breaking changes

## Common Issues

### Issue: Notifications don't persist after restart

**Solution**: Ensure notification IDs are stored in task.notificationIds

### Issue: Theme doesn't update all components

**Solution**: Use useSettings() hook to get theme, pass to createStyles()

### Issue: Task list doesn't update after completion

**Solution**: Call loadTasks() callback or use event listener

### Issue: XP calculation seems wrong

**Solution**: Check streak calculation, verify base rewards in tag config

## Documentation Standards

- Update docs when changing architecture
- Document new services with examples
- Keep README current
- Comment complex algorithms
- Link related documentation files
