# Task Management System

## Overview

The task management system provides a comprehensive solution for creating, organizing, and tracking tasks. Tasks are the core entity of the application and support multiple features including categorization, deadline tracking, notification scheduling, and automatic reward calculation.

## Task Model

```typescript
type Task = {
    id: string; // Unique identifier (UUID v4)
    title: string; // Task title (required, non-empty)
    selectedTag: string; // Single category from tag system
    notes?: string; // Optional additional notes
    dueDate?: string; // Optional ISO date+time string (scheduled timestamp)
    createdAt: string; // ISO timestamp when created
    completed: boolean; // Completion status
    completedAt?: string; // ISO timestamp when completed
    notificationIds?: string[]; // Array of scheduled notification IDs
};
```

### Field Descriptions

| Field             | Type            | Description                                      | Required |
| ----------------- | --------------- | ------------------------------------------------ | -------- |
| `id`              | `string` (UUID) | Unique identifier generated on creation          | Yes      |
| `title`           | `string`        | Task name/title displayed in lists               | Yes      |
| `selectedTag`     | `string`        | Category ID from tag system (determines rewards) | Yes      |
| `notes`           | `string`        | Additional task details and description          | No       |
| `dueDate`         | `string` (ISO)  | Scheduled date and time for task deadline        | No       |
| `createdAt`       | `string` (ISO)  | Task creation timestamp                          | Yes      |
| `completed`       | `boolean`       | Whether task is marked as complete               | Yes      |
| `completedAt`     | `string` (ISO)  | When task was completed                          | No       |
| `notificationIds` | `string[]`      | Expo notification IDs for scheduled reminders    | No       |

## Tag System

### Available Tags

The tag system provides predefined categories with associated reward values:

| Tag ID      | Label      | Points | XP  | Description                |
| ----------- | ---------- | ------ | --- | -------------------------- |
| `urgent`    | Urgente    | 20     | 15  | High-priority urgent tasks |
| `important` | Importante | 15     | 12  | Important but not urgent   |
| `work`      | Trabalho   | 10     | 8   | Work-related tasks         |
| `study`     | Estudo     | 12     | 10  | Educational activities     |
| `personal`  | Pessoal    | 8      | 6   | Personal tasks (default)   |
| `health`    | Saúde      | 14     | 11  | Health and fitness         |
| `finance`   | Finanças   | 16     | 13  | Financial tasks            |
| `creative`  | Criativo   | 11     | 9   | Creative/artistic projects |

### Tag Configuration

Location: `app/config/tags.ts`

```typescript
type TagRewardConfig = {
    id: string; // Unique tag identifier
    label: string; // Display name in Portuguese
    basePoints: number; // Base points awarded
    baseXP: number; // Base experience points
    description: string; // User-friendly description
    icon?: string; // Optional icon identifier
};
```

### Benefits of Tag System

- **Consistency**: All tasks of a type award the same base rewards
- **Maintainability**: Rewards configured in one place
- **Balance**: Easy to adjust game economy
- **Motivation**: Different task types have different value
- **Analytics**: Understand which task types are most frequent

## Task Lifecycle

### Creation

1. User navigates to TaskFormScreen
2. Enters task title (required)
3. Optionally adds notes, selects tag, sets due date
4. Selects notification times (none = no reminders)
5. Saves task
    - New Task object created with UUID
    - Notifications scheduled based on settings
    - Task persisted to AsyncStorage
    - UI updates task list

### Editing

1. User selects edit on existing task
2. Form pre-populates with current values
3. User modifies desired fields
4. On save:
    - Old notification timers cancelled
    - New notifications scheduled if needed
    - Task updated in storage
    - If task was just completed, rewards applied

### Completion

1. User toggles checkbox on task item
2. If completing (not uncompleting):
    - Task marked as completed
    - completedAt timestamp set
    - Notifications cancelled
    - Gamification rewards applied:
        - Points based on tag
        - XP calculation with streak bonus
        - Streak incremented
        - Badges checked and unlocked if earned
        - Profile updated
3. Gamification events emitted for UI updates

### Deletion

1. User selects delete button with confirmation
2. All associated notifications cancelled
3. Task removed from storage
4. UI updates immediately

## Task Status and Overdue Logic

### Overdue Determination

A task is marked as **overdue** only if:

1. Its exact scheduled timestamp (`dueDate`) is strictly earlier than the current time
2. The task is not yet completed

**Key Points**:

- Overdue status uses **precise timestamp comparison** (`dueDate.getTime() < Date.now()`)
- A task scheduled for 2:00 PM becomes overdue at 2:00:01 PM
- Completed tasks are never marked as overdue, regardless of when they're marked complete
- Overdue status is re-evaluated in real-time as the user views the task list

**Display Behavior**:

- Overdue tasks show with red styling in the task list
- Calendar icon changes to red (#ef4444)
- Due date text shows in red with "(vencida)" indicator
- Example: "Hoje (vencida)"

### TaskItem Component Display

The `TaskItem` component determines overdue status using:

```typescript
const isOverdue =
    dueDateObj && dueDateObj.getTime() < Date.now() && !task.completed;
```

This ensures:

- Precision: Millisecond-level accuracy for overdue determination
- Accuracy: Only compares exact scheduled timestamps
- Reliability: Uncompleting a task removes overdue status

## Notification System

### Overview

Tasks can have multiple notification times scheduled before their due date. Each time is independently scheduled using Expo notifications.

### Available Notification Times

#### Preset Times

- **1 hour** before deadline
- **2 hours** before deadline
- **4 hours** before deadline
- **8 hours** before deadline
- **24 hours** before deadline

#### Custom Hour/Minute Notifications

Users can also create custom notification times using the HourMinuteSelector component:

- **Hours**: 0-23 (24-hour format)
- **Minutes**: 0-59
- **Format**: `custom_Xh_Ym` (e.g., `custom_3h_30m` for 3 hours 30 minutes)

**Key Features**:

- **Timestamp-Based Scheduling**: The selected date + hour/minute produces a single scheduled timestamp
- **Past Prevention**: Users cannot schedule reminders for times already in the past
- **Clear Error Messaging**: Inline error display when attempting past scheduling
- **Validation**: Confirm button disabled when time is in past or no date selected

**Example Custom Notifications**:

| Time Input | ID               | Description               |
| ---------- | ---------------- | ------------------------- |
| 14:30      | `custom_14h_30m` | 2:30 PM on selected date  |
| 00:15      | `custom_0h_15m`  | 12:15 AM on selected date |
| 23:59      | `custom_23h_59m` | 11:59 PM on selected date |

**Validation Rules**:

| Scenario              | Error Message                           | Action                                   |
| --------------------- | --------------------------------------- | ---------------------------------------- |
| No date selected      | "Selecione uma data primeiro"           | Inputs disabled, confirm button disabled |
| Selected time in past | "O horário selecionado está no passado" | Confirm button disabled (50% opacity)    |
| Valid future time     | None                                    | Confirm button enabled                   |

**Workflow**:

1. User selects a due date
2. HourMinuteSelector inputs become enabled
3. User enters hour and minute
4. Component validates against current time:
    - If valid: No error, confirm button enabled
    - If invalid: Shows error, confirm button disabled
5. On confirm: Timestamp created, callback triggered
6. TaskFormScreen extracts hour/minute and generates ID `custom_Xh_Ym`

### Notification Selection UI

The task form provides two complementary notification selection methods:

1. **TimeSelector Component**: Quick access to preset times
    - Located: `app/components/TimeSelector.tsx`
    - Use case: Common reminder intervals
    - Multi-select: Yes

2. **HourMinuteSelector Component**: Custom time input
    - Located: `app/components/HourMinuteSelector.tsx`
    - Use case: Personalized notification timing
    - Multi-select: Yes (multiple custom times can be added)

Both components work together, allowing users to mix preset and custom notification times for flexible task management.

### Scheduling Logic

Location: `app/services/TaskStorage.ts::scheduleReminders()`

**Overview**:

Notifications are scheduled relative to the task's due date. For each selected notification time (preset or custom), the system calculates when the notification should trigger and schedules it with Expo.

```
For each selected notification time (preset or custom):
  1. Parse notification ID to extract hours and minutes
  2. Calculate target time: dueDate - hours:minutes
  3. If target time is in future (at least 10 seconds away):
     - Schedule using expo-notifications
     - Store returned notification ID
  4. If target time is in past:
     - Skip scheduling (cannot notify about past events)
  5. Continue with next time if any fail

Return array of successfully scheduled notification IDs
```

**Timestamp Calculation Example**:

```
Task Due Date: 2025-11-18T14:30:00Z (Nov 18, 2:30 PM)
Current Time: 2025-11-18T10:00:00Z (Nov 18, 10:00 AM)

Preset Notification "1h":
  - Trigger Time: 2025-11-18T13:30:00Z (Nov 18, 1:30 PM)
  - Status: Valid (4.5 hours from now) ✓ Scheduled

Custom Notification "custom_14h_30m":
  - Trigger Time: 2025-11-18T14:30:00Z (Nov 18, 2:30 PM)
  - Status: Valid (4.5 hours from now) ✓ Scheduled

Custom Notification "custom_9h_0m":
  - Trigger Time: 2025-11-18T05:30:00Z (Nov 18, 5:30 AM)
  - Status: Invalid (in past) ✗ Skipped
```

**Custom Time Parsing Example**:

```typescript
// Input: ["1h", "custom_3h_30m", "24h"]
// Processing:
// - "1h" → notification 1 hour before dueDate
// - "custom_3h_30m" → notification 3 hours 30 minutes before dueDate
// - "24h" → notification 24 hours before dueDate
```

## Notification Persistence

**🔧 CRITICAL FIX - Notification Saving Issue Resolved**

The task's `notificationIds` field stores **user-selected time periods** (e.g., `["1h", "24h"]`), NOT Expo notification IDs:

```typescript
// Correctly stored in AsyncStorage
task.notificationIds: ["1h", "24h"]  // User time selections - PERSISTS
```

**What Changed:**

Previously, Expo notification IDs were overwriting user selections, causing notifications to disappear when editing. This has been fixed:

- ✅ User time selections now persist through app restarts
- ✅ Edited tasks show previously selected notification times
- ✅ Form properly displays saved notification preferences
- ✅ Notifications reschedule correctly when due date changes

**How It Works:**

1. User creates task and selects notification times: `["1h", "24h"]`
2. Task saved with these selections: `{ notificationIds: ["1h", "24h"] }`
3. Internally, Expo schedules these and returns temporary IDs (not saved)
4. When editing, task loads with original selections: `["1h", "24h"]`
5. Form displays correctly in TimeSelector
6. On save, old notifications cancelled, new ones scheduled
7. Original time selections persist for next edit

### Notification Content

```
Title: "Tarefa próxima do vencimento"
Body: "[Task Title]"
Data: { taskId: "[task.id]" }
Sound: false (for deadline reminders)
```

## Task Storage Service

Location: `app/services/TaskStorage.ts`

### Key Methods

#### `getAllTasks(): Promise<Task[]>`

Retrieves all tasks from storage, sorted by creation time (newest first).

**Returns**: Array of all tasks, empty array if none exist.

**Usage**:

```typescript
const { getAllTasks } = TaskStorage();
const tasks = await getAllTasks();
```

#### `addTask(task: Task): Promise<void>`

Creates and persists a new task.

**Process**:

1. Retrieves existing tasks
2. Schedules reminders if task has due date
3. Adds task to beginning of array
4. Persists to storage

**Usage**:

```typescript
const newTask: Task = {
    /* task data */
};
await addTask(newTask);
```

#### `updateTask(updated: Task): Promise<void>`

Updates an existing task or adds if not found.

**Process**:

1. Finds task by ID
2. Cancels old notifications
3. Schedules new notifications if needed
4. Updates or inserts task
5. If task just became completed, applies rewards
6. Persists to storage

**Usage**:

```typescript
const updated = { ...oldTask, title: "New Title" };
await updateTask(updated);
```

#### `removeTask(id: string): Promise<void>`

Deletes a task by ID.

**Process**:

1. Finds task
2. Cancels all scheduled notifications
3. Removes from storage

**Usage**:

```typescript
await removeTask(taskId);
```

#### `completeTask(taskId: string): Promise<void>`

Marks task as complete and applies gamification rewards.

**Process**:

1. Finds task by ID
2. Marks as completed with timestamp
3. Cancels notifications
4. Applies completion rewards (see Gamification section)
5. Emits gamification events
6. Persists to storage

**Usage**:

```typescript
await completeTask(taskId);
```

#### `scheduleReminders(task: Task): Promise<string[]>`

Schedules notifications for a task based on its notificationIds.

**Returns**: Array of scheduled notification IDs.

**Process**:

- Validates task has due date and isn't completed
- Checks deadline isn't past or too far in future (>7 days)
- For each time ID, calculates trigger date
- Schedules with Expo notifications
- Returns array of IDs

**Note**: Handles errors gracefully, returning successfully scheduled IDs.

#### `cancelReminder(notificationId: string): Promise<void>`

Cancels a scheduled notification by ID.

**Error Handling**: Silently ignores errors.

### Event Emitter

TaskStorage exports a `gamificationEvents` EventEmitter for decoupled updates:

**Events Emitted**:

- `levelup` - { level: number, coins: number }
- `pointsEarned` - { points: number, xp: number }

**Usage**:

```typescript
import { gamificationEvents } from "../services/TaskStorage";

gamificationEvents.on("levelup", (data) => {
    console.log(`Leveled up to ${data.level}`);
});
```

## Task Form Screen

Location: `app/screens/TaskFormScreen.tsx`

### Features

- Create new tasks
- Edit existing tasks
- Title input (required, validates non-empty)
- Notes input (optional, multiline)
- Tag selection via TagSelector component
- Due date selection with date picker
- Notification time selection via TimeSelector
- Form validation
- Error alerts

### Key Logic

```typescript
// Initialize notification times from existing task
const [selectedTimes, setSelectedTimes] = useState<string[]>(
    existing?.notificationIds || [],
);

// Save new task
const newTask: Task = {
    id: uuidv4(),
    title: title.trim(),
    notes,
    selectedTag,
    dueDate,
    completed: false,
    createdAt: new Date().toISOString(),
    notificationIds: selectedTimes.length > 0 ? selectedTimes : undefined,
};
```

**Important Fix**: Previously defaulted to `["1h"]` when editing, now properly uses actual `notificationIds`.

## Task List Screen

Location: `app/screens/TaskListScreen.tsx`

### Features

- Displays filterable list of tasks
- Filter options: All, Completed, Pending
- Toggle task completion
- Edit existing tasks
- Delete tasks with confirmation
- Real-time updates
- Navigation to Dashboard and Settings

### Filter Logic

```typescript
const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true; // all tasks
});
```

### Task Item Component

Location: `app/components/TaskItem.tsx`

Renders individual task with:

- Completion checkbox
- Task title with strikethrough when completed
- Due date display
- Edit button
- Delete button

## Best Practices

### Task Creation

1. Always validate title is non-empty
2. Generate UUID for new tasks
3. Set `createdAt` to current ISO timestamp
4. Set `completed` to `false`
5. Clear or set `notificationIds` appropriately

### Task Updates

1. Always preserve `id` and `createdAt`
2. Update `completedAt` only when transitioning to complete
3. Cancel old notifications before scheduling new ones
4. Validate all required fields

### Error Handling

1. Wrap storage operations in try-catch
2. Show user-friendly alerts
3. Log errors to console for debugging
4. Don't lose data on validation errors

### Performance

1. Use useCallback for memoized handlers
2. Implement FlatList with keyExtractor for large lists
3. Filter in-memory, not on storage queries
4. Debounce frequent updates
