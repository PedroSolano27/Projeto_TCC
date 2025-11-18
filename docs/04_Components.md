# UI Components Guide

## Overview

The application uses a modular component architecture with both generic reusable components and feature-specific components. All components support light/dark theming through the centralized `ScreenStyles.ts` styling system.

## Reusable Components

These components are designed to be used throughout the application:

### Button

**Location**: `app/components/Button.tsx`

**Purpose**: Reusable button component with multiple style variants

**Props**:

```typescript
type Props = TouchableOpacityProps & {
    label: string; // Button text
    variant?: "primary" | "success" | "danger" | "secondary";
    theme: "light" | "dark"; // Current theme
    disabled?: boolean; // Disabled state
};
```

**Variants**:

- `primary`: Blue button (default) - main actions
- `success`: Green button - positive/confirmation actions
- `danger`: Red button - destructive actions
- `secondary`: Neutral button - alternative actions

**Styling**:

- Padding: 12px horizontal, 12px vertical
- Border radius: 8px
- Full width: No (set parent flex to control)
- Disabled state: 50% opacity

**Usage Example**:

```typescript
import { Button } from "../components/Button";

<Button
    label="Save Task"
    variant="success"
    theme={theme}
    onPress={() => handleSave()}
    disabled={!title.trim()}
/>
```

---

### Card

**Location**: `app/components/Card.tsx`

**Purpose**: Reusable card container with consistent styling

**Props**:

```typescript
type Props = ViewProps & {
    theme: "light" | "dark"; // Current theme
    children?: React.ReactNode; // Card content
};
```

**Styling**:

- Background: Theme-aware card background
- Border: 1px light border
- Border radius: 10px
- Padding: 12px
- Margin bottom: 12px

**Usage Example**:

```typescript
import { Card } from "../components/Card";

<Card theme={theme}>
    <Text>Card content goes here</Text>
</Card>
```

---

### FormField

**Location**: `app/components/FormField.tsx`

**Purpose**: Reusable form input wrapper with label and error support

**Props**:

```typescript
type Props = TextInputProps & {
    label: string; // Field label
    error?: boolean; // Error state
    theme: "light" | "dark"; // Current theme
};
```

**Features**:

- Automatic label rendering above input
- Error state visual feedback (red border)
- Theme-aware styling
- Inherits all TextInput props

**Error Styling**:

- Border color changes to red (#e74c3c)
- Visual feedback for validation failures

**Usage Example**:

```typescript
import { FormField } from "../components/FormField";

<FormField
    label="Task Title"
    error={!title && attemptedSubmit}
    theme={theme}
    placeholder="Enter task title"
    value={title}
    onChangeText={setTitle}
/>
```

---

## Feature-Specific Components

### TagSelector

**Location**: `app/components/TagSelector.tsx`

**Purpose**: Modal-based single-select dropdown for task categories

**Props**:

```typescript
type Props = {
    selectedTag: string; // Currently selected tag ID
    onSelectTag: (tagId: string) => void; // Callback on selection
    theme: "light" | "dark"; // Current theme
};
```

**Features**:

- Modal overlay with scrollable options
- Displays tag name, description, and reward values
- Visual indicator for selected tag
- Tap overlay to close modal

**Tag Display Format**:

```
[Tag Label]
[Tag Description]
[basePoints] pontos • [baseXP] XP
```

**Implementation Details**:

- Uses `getAllTags()` from tags config
- Modal animates in/out
- Single-select only (previous selection is replaced)
- Closes automatically on selection

**Usage Example**:

```typescript
import { TagSelector } from "../components/TagSelector";

<TagSelector
    selectedTag={selectedTag}
    onSelectTag={setSelectedTag}
    theme={theme}
/>
```

---

### TimeSelector

**Location**: `app/components/TimeSelector.tsx`

**Purpose**: Modal-based multi-select for notification times

**Props**:

```typescript
type Props = {
    selectedTimes: string[]; // Currently selected time IDs
    onSelectTimes: (timeIds: string[]) => void;
    theme: "light" | "dark"; // Current theme
};
```

**Features**:

- Modal overlay with scrollable options
- Multiple selection with checkboxes
- Display summary of selected times
- Shows "Sem notificações" if none selected

**Available Times**:

- `1h` - 1 hour before deadline
- `2h` - 2 hours before deadline
- `4h` - 4 hours before deadline
- `8h` - 8 hours before deadline
- `24h` - 1 day before deadline

**Implementation Details**:

- Clicking checkbox toggles time
- Selected times shown in trigger button
- All times optional (can select none)
- "Feito" button closes modal

**Usage Example**:

```typescript
import { TimeSelector } from "../components/TimeSelector";

<TimeSelector
    selectedTimes={selectedTimes}
    onSelectTimes={setSelectedTimes}
    theme={theme}
/>
```

---

### HourMinuteSelector

**Location**: `app/components/HourMinuteSelector.tsx`

**Purpose**: Modal-based custom time input for scheduling tasks at specific times. Produces a single scheduled timestamp based on selected date and time.

**Props**:

```typescript
type Props = {
    onSelectTime: (timestamp: string) => void; // Callback with ISO timestamp string
    theme: "light" | "dark"; // Current theme
    selectedDate?: string; // ISO date string (required for scheduling)
};
```

**Features**:

- Modal overlay with number inputs for hours and minutes
- Requires a date to be selected first
- Input validation: hours (0-23), minutes (0-59)
- Real-time input parsing and bounds checking
- **Past prevention**: Prevents scheduling in the past with clear inline error
- Disabled submit button when error is present or no date selected
- Cancel and Confirm buttons
- Clean, centered modal design
- Accessibility labels for all inputs

**Input Constraints**:

- **Hours**: 0-23 (24-hour format)
- **Minutes**: 0-59
- Invalid values are automatically corrected to nearest valid value
- Empty inputs default to 0
- **Cannot schedule in the past**: If the selected time is before the current moment, an error message is displayed and the confirm button is disabled

**Error Handling**:

| Condition           | Error Message                           | Confirm Disabled |
| ------------------- | --------------------------------------- | ---------------- |
| No date selected    | "Selecione uma data primeiro"           | Yes              |
| Time is in past     | "O horário selecionado está no passado" | Yes              |
| Updating form state | "O horário selecionado está no passado" | Yes              |

**Implementation Details**:

- Opens modal when trigger button is pressed
- Accepts only numeric keyboard input
- Hours and minutes inputs are disabled until a date is selected
- Cancel button clears inputs and closes modal
- Confirm button validates that the scheduled time is not in the past
- Display format: "Xh Ym" or "Tempo customizado" if empty
- Returns ISO timestamp string (e.g., `2025-11-18T14:30:00.000Z`)

**Timestamp Generation**:

The component combines the selected date with the chosen hour and minute to produce a single scheduled timestamp:

```
Selected Date: 2025-11-18
Selected Hour/Minute: 14:30
Output Timestamp: 2025-11-18T14:30:00.000Z
```

**Integration with Task Form**:

When a user selects a custom time via HourMinuteSelector:

1. The component calculates the exact scheduled timestamp
2. Validates that it's not in the past
3. If valid, the timestamp callback is triggered
4. TaskFormScreen extracts hour/minute info and generates a unique ID (`custom_Xh_Ym`)
5. This ID is added to the task's notification list

**Usage Example**:

```typescript
import { HourMinuteSelector } from "../components/HourMinuteSelector";

const handleCustomTime = (timestamp: string) => {
    // timestamp is ISO string like "2025-11-18T14:30:00.000Z"
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const customId = `custom_${hours}h_${minutes}m`;
    // Add to notification list
    setSelectedTimes([...selectedTimes, customId]);
};

<View style={formStyles.formGroup}>
    <Text style={formStyles.label}>Notificação Customizada</Text>
    <Text style={formStyles.hint}>
        Defina um horário customizado para ser notificado
    </Text>
    <HourMinuteSelector
        onSelectTime={handleCustomTime}
        theme={theme}
        selectedDate={dueDate}
    />
</View>
```

**Styling**:

- Trigger Button:
    - Border: 1.5px, theme-aware color
    - Padding: 12px horizontal, 12px vertical
    - Border radius: 8px
    - Min height: 44px (touch target)
    - Background: theme-aware surface color

- Modal Dialog:
    - Max width: 360px
    - Background: theme-aware surface color
    - Border radius: 12px
    - Shadow: Large elevation

- Input Fields:
    - Border: 1.5px, theme-aware
    - Text alignment: Center
    - Font size: Large (18px)
    - Font weight: Bold
    - Min width: 70px
    - Min height: 44px

- Buttons:
    - Width: Flex (equal split)
    - Height: 44px minimum
    - Border radius: 8px
    - Gap between: 12px

**Accessibility**:

- All inputs have accessibility labels
- Touch targets meet 44px minimum (WCAG 2.1 AA)
- Color contrast follows theme requirements
- Keyboard navigation supported
- Screen reader compatible

**Testing Recommendations**:

1. **Input Validation**:
    - Test values 0-23 for hours
    - Test values 0-59 for minutes
    - Verify bounds enforcement (e.g., 25 hours → 23)
    - Check empty input handling

2. **Modal Interaction**:
    - Verify modal opens/closes correctly
    - Test Cancel button clears inputs
    - Test Confirm button returns correct values
    - Verify overlay dismissal

3. **Device Compatibility**:
    - Test on iOS and Android
    - Verify keyboard appearance and dismissal
    - Check touch responsiveness
    - Test with different screen sizes

4. **Theme Support**:
    - Test dark mode colors
    - Test light mode colors
    - Verify contrast ratios

---

### TaskItem

**Location**: `app/components/TaskItem.tsx`

**Purpose**: Renders individual task in list with actions

**Props**:

```typescript
type Props = {
    task: Task; // Task data to display
    onToggle: (id: string) => void; // Completion toggle callback
    onEdit: (task: Task) => void; // Edit navigation callback
    onDelete: (id: string) => void; // Delete confirmation callback
};
```

**Features**:

- Left-side checkbox for completion toggle
- Task title with strikethrough when completed
- Due date display (if set)
- Edit button
- Delete button

**Layout**:

```
[Checkbox] [Title]          [Edit] [Delete]
           [Due Date]
```

**Visual Feedback**:

- Checkbox: 24x24, green when checked
- Title: Strikethrough and gray text when completed
- Due date: Small gray text below title

**Usage Example**:

```typescript
import TaskItem from "../components/TaskItem";

<FlatList
    data={tasks}
    renderItem={({ item }) => (
        <TaskItem
            task={item}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    )}
    keyExtractor={(item) => item.id}
/>
```

---

### LevelUpModal

**Location**: `app/components/LevelUpModal.tsx`

**Purpose**: Celebration modal when user levels up

**Props**:

```typescript
type Props = {
    visible: boolean; // Modal visibility
    onClose: () => void; // Close callback
    level: number; // New level achieved
    rewardCoins?: number; // Coin reward (optional)
};
```

**Features**:

- Modal overlay (semi-transparent)
- "Parabéns!" message
- New level display
- Optional coin reward display
- Close button

**Content Format**:

```
Parabéns!
Você subiu para o nível [level].
Recebeu [coins] moedas.
[Close Button]
```

**Styling**:

- Card background: theme-aware
- Modal overlay: 50% black transparency
- Animation: Fade in/out
- Button: Primary accent color

**Usage Example**:

```typescript
import LevelUpModal from "../components/LevelUpModal";

const [levelUpInfo, setLevelUpInfo] = useState(null);

<LevelUpModal
    visible={!!levelUpInfo}
    level={levelUpInfo?.level}
    rewardCoins={levelUpInfo?.coins}
    onClose={() => setLevelUpInfo(null)}
/>
```

---

### XPBar

**Location**: `app/components/XPBar.tsx`

**Purpose**: Visual representation of XP progress toward next level

**Props**: None (uses hooks)

**Features**:

- Hooks into user profile automatically
- Shows current level
- Displays current XP vs required
- Visual progress bar
- Percentage indicator

**Display Format**:

```
Nível [level]                           [current]/[required] XP
[████████░░░░░░░░░░░░░░░░░░░░░░░░] 45%
```

**Implementation**:

```typescript
const percentage = Math.min(100, (current / required) * 100);
```

**Usage Example**:

```typescript
import XPBar from "../components/XPBar";

<XPBar />
// No props needed - gets data from useUserProfile hook
```

---

## Styling System

### Theme Support

All components support light and dark themes via the `ScreenStyles.ts` system.

**Usage Pattern**:

```typescript
const { theme } = useSettings();  // Get current theme
const { ComponentNameStyles } = createStyles(theme);

// Apply styles
<View style={ComponentNameStyles.containerStyle}>
    ...
</View>
```

### Color Palette

**Light Theme**:

- Background: #ffffff
- Surface: #ffffff
- Card: #f1f2f6
- Text Primary: #222222
- Text Secondary: #666666
- Accent: #0984e3
- Success: #27ae60
- Danger: #e74c3c

**Dark Theme**:

- Background: #121212
- Surface: #1e1e1e
- Card: #2d3436
- Text Primary: #eeeeee
- Text Secondary: #bdbdbd
- Accent: #0984e3 (same)
- Success: #27ae60 (same)
- Danger: #e74c3c (same)

## Component Best Practices

### 1. Always Pass Theme

```typescript
// ✅ Correct
<TagSelector theme={theme} {...props} />

// ❌ Wrong - missing theme
<TagSelector {...props} />
```

### 2. Use Consistent Naming

```typescript
// ✅ Good naming
<TimeSelector selectedTimes={times} onSelectTimes={setTimes} />

// ❌ Inconsistent
<TimeSelector times={times} onChange={setTimes} />
```

### 3. Memoize Callbacks

```typescript
// ✅ Prevents re-renders
const handleEdit = useCallback((task) => {
    navigation.navigate("Form", { task });
}, [navigation]);

<TaskItem {...props} onEdit={handleEdit} />
```

### 4. Use FlatList with keyExtractor

```typescript
// ✅ Optimal performance
<FlatList
    data={tasks}
    keyExtractor={(item) => item.id}
    renderItem={...}
/>
```

### 5. PropTypes Documentation

```typescript
// ✅ Clear prop documentation
type Props = {
    value: string; // Current input value
    onChange: (text: string) => void; // Change handler
    theme: "light" | "dark"; // Current theme
};
```

## Common Patterns

### Loading State

```typescript
{loading ? (
    <ActivityIndicator size="large" />
) : (
    <FlatList data={items} {...props} />
)}
```

### Error Display

```typescript
{error && (
    <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
    </View>
)}
```

### Modal Pattern

```typescript
const [visible, setVisible] = useState(false);

<Modal visible={visible} transparent animationType="fade">
    <Pressable onPress={() => setVisible(false)}>
        <View style={styles.modal}>
            {/* Modal content */}
        </View>
    </Pressable>
</Modal>

<TouchableOpacity onPress={() => setVisible(true)}>
    <Text>Open Modal</Text>
</TouchableOpacity>
```

## Integration Notes

- All components are TypeScript-first
- Use semantic naming (TaskItem vs Task, TimeSelector vs NotificationPicker)
- Prefer function components with hooks
- Minimize external dependencies
- Follow React Native best practices
- Support accessibility (TouchableOpacity for interactivity)
