# Services Architecture

## Overview

Services contain the business logic and data access layer of the application. They handle task management, gamification, notifications, storage, and file operations. Services are organized by responsibility and are independent of UI components.

## Task Storage Service

**Location**: `app/services/TaskStorage.ts`

### Purpose

Manages all task CRUD operations, notification scheduling, and task-related events.

### Key Methods

#### `getAllTasks(): Promise<Task[]>`

Retrieves all tasks from AsyncStorage, newest first.

```typescript
const tasks = await getAllTasks();
// Returns: Task[] (empty array if no tasks exist)
```

#### `addTask(task: Task): Promise<void>`

Creates and persists a new task with notification scheduling.

```typescript
const newTask: Task = {
    /* ... */
};
await addTask(newTask);
```

**Process**:

1. Get all existing tasks
2. Schedule reminders based on due date and notification times
3. Add task to beginning of array
4. Persist to storage

#### `updateTask(updated: Task): Promise<void>`

Updates existing task or adds if not found.

```typescript
await updateTask({ ...existingTask, title: "New Title" });
```

**Process**:

1. Find task by ID in storage
2. Cancel old notifications
3. Schedule new notifications if task incomplete
4. Update task in storage
5. If task just completed, apply gamification rewards

#### `removeTask(id: string): Promise<void>`

Deletes a task and cancels notifications.

```typescript
await removeTask(taskId);
```

#### `completeTask(taskId: string): Promise<void>`

Marks task complete and applies gamification rewards.

```typescript
await completeTask(taskId);
```

**Triggers**:

- Task marked as completed
- Notifications cancelled
- Gamification rewards applied
- Gamification events emitted
- Profile updated with new stats

#### `scheduleReminders(task: Task): Promise<string[]>`

Schedules multiple notifications for a task.

```typescript
const notificationIds = await scheduleReminders(task);
```

**Returns**: Array of scheduled notification IDs

**Constraints**:

- Task must have `dueDate`
- Task must not be completed
- Deadline must be between now and 7 days
- Each time calculated from deadline

#### `cancelReminder(id: string): Promise<void>`

Cancels a single scheduled notification.

```typescript
await cancelReminder(notificationId);
```

**Error Handling**: Silently ignores cancellation errors

### Event Emitter

```typescript
import { gamificationEvents } from "../services/TaskStorage";

gamificationEvents.on("levelup", (data) => {
    console.log(`Level: ${data.level}, Coins: ${data.coins}`);
});

gamificationEvents.on("pointsEarned", (data) => {
    console.log(`+${data.points} points, +${data.xp} XP`);
});
```

### Storage Key

- `@tasks_v1` - Main tasks array

### Error Handling

- Try-catch blocks around all AsyncStorage operations
- Silently continues on notification errors
- Returns partial results on partial failures

---

## Gamification Service

**Location**: `app/services/Gamification.ts`

### Purpose

Calculates rewards, manages achievement system, and applies progression changes.

### Main Function: `applyCompletionRewards`

```typescript
async function applyCompletionRewards(task: Task): Promise<{
    profile: UserProfile;
    points: number;
    xpGain: number;
    leveledUp: boolean;
    newBadges: Badge[];
}>;
```

**Return Value**:

```typescript
{
    profile: /* Updated user profile */,
    points: 28,           // Actual points awarded (including bonuses)
    xpGain: 19,           // Actual XP awarded
    leveledUp: true,      // Whether level increased
    newBadges: [/* array of newly unlocked badges */]
}
```

### Reward Calculation Process

1. **Get Tag Rewards**

    ```typescript
    const { basePoints, baseXP } = getTagRewards(task.selectedTag);
    ```

2. **Calculate Streak**

    ```typescript
    // Checks for same-day double-completion to prevent exploitation
    let newStreak = 1;
    if (lastDate === yesterday) newStreak = streak + 1;
    else if (lastDate === today)
        newStreak = streak; // Same day
    else newStreak = 1; // Gap - reset
    ```

3. **Apply Bonus**

    ```typescript
    const streakBonus = Math.min(newStreak, 7) * 2;
    const points = basePoints + streakBonus;
    const xpGain = baseXP + Math.floor(streakBonus * 0.5);
    ```

4. **Update Profile**

    ```typescript
    profile.points += points;
    profile.coins += Math.floor(points / 5);
    profile.xp += xpGain;
    ```

5. **Check Level-Up**

    ```typescript
    while (profile.xp >= requiredXpForLevel(profile.level + 1)) {
        profile.xp -= requiredXpForLevel(profile.level + 1);
        profile.level += 1;
        leveledUp = true;
    }
    ```

6. **Check Achievements**

    ```typescript
    const newBadges = checkBadges(profile);
    if (newBadges.length) {
        profile.badges = [...profile.badges, ...newBadges];
    }
    ```

7. **Persist**
    ```typescript
    await saveProfile(profile);
    ```

### Badge Unlock Logic

Internal function `checkBadges()` validates unlock conditions for each badge:

```typescript
function checkBadges(profile): Badge[] {
    const newBadges: Badge[] = [];

    // First task
    if (!profile.badges.some((b) => b.id === "first-task")) {
        newBadges.push({ id: "first-task" /* ... */ });
    }

    // 7-day streak
    if (
        !profile.badges.some((b) => b.id === "7-day-streak") &&
        profile.streak >= 7
    ) {
        newBadges.push({ id: "7-day-streak" /* ... */ });
    }

    // Similar for all other badges...

    return newBadges;
}
```

### Helper Functions

#### `requiredXpForLevel(level: number): number`

Calculates XP needed for a specific level.

```typescript
function requiredXpForLevel(level: number): number {
    return Math.round(100 * Math.pow(1.4, level - 1));
}
```

#### `todayString(): string`

Returns today's date as YYYY-MM-DD string.

```typescript
function todayString(): string {
    return new Date().toISOString().slice(0, 10);
}
```

---

## User Profile Storage Service

**Location**: `app/services/UserProfileStorage.ts`

### Purpose

Manages user profile persistence and XP calculations.

### Methods

#### `loadProfile(): Promise<UserProfile>`

Loads profile from storage or returns defaults on first run.

```typescript
const profile = await loadProfile();
```

**Default Profile**:

```typescript
{
    id: "local",
    xp: 0,
    level: 1,
    coins: 0,
    streak: 0,
    points: 0,
    badges: [],
    lastCompletionDate: null,
}
```

#### `saveProfile(profile: UserProfile): Promise<void>`

Persists profile to AsyncStorage.

```typescript
await saveProfile(updatedProfile);
```

#### `requiredXpForLevel(level: number): number`

Calculates total XP needed for a specific level.

```typescript
const xpForLevel5 = requiredXpForLevel(5);
```

### Storage Key

- `@user_profile_v1`

### Error Handling

- Logs warnings to console
- Returns defaults on storage errors
- No exceptions thrown to UI

---

## Motivational Notifications Service

**Location**: `app/services/MotivationalNotifications.ts`

### Purpose

Sends gamification and motivational notifications.

### Public Functions

#### `sendGamificationNotification(title, body, delay?)`

Sends a custom notification with sound.

```typescript
await sendGamificationNotification(
    "🎉 Level Up!",
    "You reached level 5!",
    0, // delay in seconds (optional)
);
```

#### `notifyLevelUp(level, coins)`

Sends level-up celebration notification.

```typescript
await notifyLevelUp(5, 100);
```

**Output**:

```
Title: "🎉 Parabéns! Você subiu para o Nível 5!"
Body: "Recebeu 100 moedas como recompensa!"
```

#### `notifyBadgeUnlocked(badgeTitle, description)`

Sends achievement unlock notification.

```typescript
await notifyBadgeUnlocked(
    "Uma Semana Incrível",
    "Concluiu tarefas por 7 dias consecutivos",
);
```

**Output**:

```
Title: "🏆 Nova Conquista Desbloqueada!"
Body: "Uma Semana Incrível: Concluiu tarefas por 7 dias consecutivos"
```

#### `notifyStreakMilestone(streak)`

Sends streak milestone notification.

```typescript
await notifyStreakMilestone(7); // "Uma semana incrível!"
await notifyStreakMilestone(30); // "30 dias de consistência!"
```

#### `scheduleMotivationalNotification(hoursFromNow?)`

Schedules a random motivational message.

```typescript
await scheduleMotivationalNotification(24); // Tomorrow
```

**Motivational Messages** (8 variations):

- "Você está indo bem! 🌟"
- "Consecutivo incrível! 🔥"
- "Parabéns pelo progresso! 🎉"
- "Tempo de ser produtivo! ⏰"
- "Quase lá! 💪"
- "Bom trabalho! ✅"
- "Você é incrível! 🚀"
- "Apenas mais um? 📋"

### Error Handling

- All errors logged to console
- No errors thrown to UI
- Notifications are best-effort

### Notification Format

- Type: DATE-based trigger
- Sound: true (gamification), false (motivational)
- Data: Attached for analytics

---

## Export/Import Service

**Location**: `app/services/ExportTasks.ts`

### Purpose

Handles task data export and import functionality.

### Hook: `ExportTasks()`

Returns:

```typescript
{
    exportTasks: () => Promise<void>;
    importTasks: () => Promise<void>;
    loading: boolean;
}
```

### Export Process

```typescript
await exportTasks();
```

**Steps**:

1. Gets all tasks from storage
2. Converts to JSON with formatting
3. Writes to filesystem with timestamped name
4. Shares file or shows path alert
5. File format: `tarefas-export-YYYY-MM-DDTHH-MM-SS.json`

### Import Process

```typescript
await importTasks();
```

**Steps**:

1. Opens document picker (JSON only)
2. Reads file content
3. Validates JSON structure
4. Shows merge/replace dialog
5. Applies selected option

### Import Options

**Merge**:

- Adds new tasks
- Updates existing tasks (by ID)
- Preserves existing non-conflicting tasks

**Replace**:

- Removes all current tasks
- Adds all imported tasks
- Destructive operation

### File Format

JSON array of Task objects:

```json
[
    {
        "id": "uuid",
        "title": "Task 1",
        "selectedTag": "personal",
        "notes": "Notes here",
        "dueDate": "2025-01-15T10:00:00.000Z",
        "createdAt": "2025-01-10T09:00:00.000Z",
        "completed": false,
        "notificationIds": ["1h", "24h"]
    }
]
```

### Error Handling

- File read errors: Shows alert
- JSON parse errors: Shows alert
- Permission errors: Shows alert
- Gracefully handles cancelled selections

---

## Service Integration Pattern

Typical service usage in screens:

```typescript
import { TaskStorage } from "../services/TaskStorage";
import { loadProfile } from "../services/UserProfileStorage";

export default function MyScreen() {
    const { addTask, updateTask, removeTask } = TaskStorage();

    const handleCreateTask = async (task) => {
        try {
            await addTask(task);
            // Update UI
        } catch (err) {
            console.error("Failed:", err);
            // Show error alert
        }
    };

    return (/* ... */);
}
```

## Best Practices

### 1. Error Handling

```typescript
// ✅ Always wrap in try-catch
try {
    const result = await gamificationService.doSomething();
} catch (err) {
    console.warn("Error:", err);
    Alert.alert("Error", "Operation failed");
}
```

### 2. Async Operations

```typescript
// ✅ Use async/await
const profile = await loadProfile();

// ❌ Avoid promises without handling
loadProfile(); // Fire and forget - bad
```

### 3. Loading States

```typescript
// ✅ Show feedback while loading
const [loading, setLoading] = useState(false);
setLoading(true);
await operation();
setLoading(false);
```

### 4. Storage Keys

```typescript
// ✅ Always version storage keys
const KEY = "@entity_v1"; // Enables future migrations
```

### 5. Event Handling

```typescript
// ✅ Subscribe and cleanup
useEffect(() => {
    const handler = (data) => {
        /* ... */
    };
    gamificationEvents.on("event", handler);

    return () => {
        gamificationEvents.off("event", handler);
    };
}, []);
```

## Service Dependencies

- **TaskStorage**: Uses Notifications, Gamification
- **Gamification**: Uses UserProfileStorage
- **UserProfileStorage**: Uses AsyncStorage
- **MotivationalNotifications**: Uses Notifications
- **ExportTasks**: Uses TaskStorage, DocumentPicker, FileSystem

Dependency graph is acyclic and well-defined.
