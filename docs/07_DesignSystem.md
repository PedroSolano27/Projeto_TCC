# UI/UX Design System Documentation

## Overview

This document outlines the comprehensive UI/UX redesign of the Task Management App with gamification features. The design follows modern principles with a strong focus on usability, accessibility (WCAG compliance), and visual hierarchy.

---

## Design Philosophy

### Core Principles

1. **Dark-First, Accessible Design**: Dark theme as default with high contrast for readability
2. **Usability Over Aesthetics**: Intuitive interactions that prioritize user understanding
3. **Clarity Through Hierarchy**: Clear visual hierarchy helps users understand information priority
4. **WCAG AA/AAA Compliance**: All colors meet accessibility contrast ratios
5. **Mobile-First Responsive**: Optimized for mobile devices with touch-friendly interactions
6. **Minimalist Approach**: Clean interfaces without clutter or information overload

---

## Color System

### Color Palette (WCAG Compliant)

#### Dark Theme

- **Primary (Blue)**: #2196F3 (Actions, Links, Highlights)
- **Success (Green)**: #22C55E (Positive actions, Completed tasks)
- **Warning (Amber)**: #F59E0B (Warnings, Pending tasks)
- **Danger (Red)**: #EF4444 (Destructive actions, Errors)
- **Surface**: #1A1A1A (Cards, Containers)
- **Text Primary**: #FFFFFF (19.56:1 contrast ratio - WCAG AAA)
- **Text Secondary**: #D1D5DB (7.38:1 contrast ratio - WCAG AA)
- **Background**: #0F0F0F (Main background)

#### Light Theme

- **Primary (Blue)**: #3B82F6
- **Success (Green)**: #16A34A
- **Warning (Amber)**: #D97706
- **Danger (Red)**: #DC2626
- **Surface**: #FFFFFF
- **Text Primary**: #0F172A (16.77:1 contrast ratio - WCAG AAA)
- **Background**: #FAFBFC

### Contrast Ratios

All text and interactive elements meet minimum WCAG AA standards (4.5:1 for normal text). Most meet WCAG AAA (7:1 for enhanced readability).

---

## Typography System

### Font Scale

| Size | Value | Use Case                  |
| ---- | ----- | ------------------------- |
| 4xl  | 36px  | Main titles (rarely used) |
| 3xl  | 30px  | Section titles            |
| 2xl  | 24px  | Screen titles             |
| xl   | 20px  | Important headings        |
| lg   | 18px  | Card titles               |
| base | 16px  | Body text, inputs         |
| sm   | 14px  | Secondary text, labels    |
| xs   | 12px  | Hints, timestamps         |

### Font Weights

- **Light**: 300 (Rarely used)
- **Normal**: 400 (Body text)
- **Medium**: 500 (Section labels)
- **Semibold**: 600 (Emphasized text, button labels)
- **Bold**: 700 (Important headings)
- **Extrabold**: 800 (Main titles)

### Line Heights

- **Tight**: 1.2 (Headlines)
- **Normal**: 1.5 (Body text - recommended)
- **Relaxed**: 1.625 (Longer paragraphs)
- **Loose**: 2 (Special spacing)

---

## Spacing System

Built on 8px base unit for consistency:

| Name | Value | Use Case                        |
| ---- | ----- | ------------------------------- |
| 1    | 4px   | Tight spacing, internal spacing |
| 2    | 8px   | Small gaps between elements     |
| 3    | 12px  | Form field padding              |
| 4    | 16px  | Standard padding, margins       |
| 5    | 20px  | Section margins                 |
| 6    | 24px  | Large sections                  |
| 8    | 32px  | Major spacing                   |
| 10   | 40px  | Screen sections                 |
| 12   | 48px  | Large sections                  |

---

## Component Design

### Button

**Minimum Size**: 44x44 dp (WCAG touch target)

**Variants**:

- **Primary (Blue)**: Main actions (Create, Save)
- **Success (Green)**: Confirmations (Approve, Complete)
- **Danger (Red)**: Destructive actions (Delete, Remove)
- **Secondary (Gray)**: Alternative actions (Cancel)

**States**:

- Default: Full opacity
- Hover: Slight elevation shadow
- Pressed: Slightly darker
- Disabled: 60% opacity

### Input Fields

**Minimum Height**: 44px (WCAG touch target)

**States**:

- Default: 1.5px border in secondary color
- Focused: 2px border in primary color
- Error: 2px border in danger color
- Disabled: 60% opacity

**Padding**: 12px vertical, 16px horizontal

### Cards

**Structure**:

- 16px padding (all sides)
- 12px border-radius
- 1px subtle border
- Light shadow for elevation

### Icons

**Sizes**:

- Small: 18px (inline with text)
- Medium: 24px (in cards)
- Large: 32px (standalone)

**Colors**: Match surrounding text or use status colors

---

## Screen Designs

### 1. Task List Screen

**Layout**:

- Header with title and action icons (Progress, Settings, New Task)
- Statistics bar showing Total/Pending/Completed counts
- Visual filter buttons (All, Pending, Completed)
- Task list with detailed items
- Empty state with icon and messaging

**Key Features**:

- Filter pills with icons and smooth transitions
- Task cards with checkbox, title, due date, and category badge
- Action buttons (Edit, Delete) with icons
- Visual feedback for completed tasks (strikethrough, muted colors)
- Overdue indicator for tasks past due date

### 2. Task Form Screen

**Layout**:

- Two main sections: "Tarefa" and "Configurações"
- Section separator for visual grouping
- Fields organized logically

**Section 1: Basic Information**

- Title input (required, with error state)
- Notes textarea
- Inline hints for guidance

**Section 2: Configuration**

- Tag selector (category)
- Due date picker with smart date formatting
- Notification time selector
- Action buttons (Cancel, Create/Update)

**Smart Defaults**:

- Today's date can be auto-selected for due dates
- Previous tag selection is remembered
- Notes field provides example text

### 3. Dashboard Screen

**Layout**:

- Profile section with level, points, coins
- XP progress bar with percentage
- Streak card with emoji indicator
- Productivity statistics (3-column grid)
- Achievements section (3-column grid)
- Recent completed tasks list

**Key Features**:

- Visual XP progress with smooth bar
- Emoji indicators for achievement tiers
- Stats cards with icons
- Achievement showcase with descriptions
- Recent task history with timestamps

### 4. Settings Screen

**Layout**:

- Grouped sections with icons:
    - Appearance (Theme toggle)
    - Filter Settings (Default filter selection)
    - Data Management (Export/Import)
    - Information (App version, credits)
- Separators between sections
- Descriptions under each setting

**Accessibility**:

- Clear labels and descriptions
- Radio buttons for filter selection
- Toggle switch for theme
- Icon indicators for section types

---

## Accessibility Features

### WCAG Compliance

#### Color Contrast

- All text meets minimum AA standards (4.5:1)
- Important elements meet AAA standards (7:1+)
- Colors are never the only indicator (icons + text used)

#### Touch Targets

- Minimum 44x44 dp for interactive elements
- Adequate spacing between targets (minimum 8dp gap)
- Clear visual feedback on interaction

#### Keyboard Navigation

- All interactive elements are keyboard accessible
- Tab order follows visual hierarchy
- Focus indicators are visible

#### Screen Reader Support

- Semantic labels on all interactive elements
- Descriptive accessibility labels
- Alternative text for icons
- Proper heading hierarchy

### Implementation

```typescript
// Example accessible button
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Create new task"
  accessibilityHint="Opens the task creation form"
  accessibilityRole="button"
  style={styles.button}
  onPress={handlePress}
>
  <Feather name="plus" size={20} color="#fff" />
</TouchableOpacity>
```

---

## Animation & Feedback

### Transitions

- **Fast**: 150ms (Micro-interactions, hovers)
- **Base**: 250ms (Normal transitions, modal opens)
- **Slow**: 350ms (Page transitions)
- **Slower**: 500ms (Complex animations)

### Visual Feedback

- **Button Press**: Color shift + shadow change
- **Task Completion**: Checkmark animation + color transition
- **Filter Selection**: Smooth color and text transition
- **Modal Open**: Fade-in with scale animation
- **Loading**: Activity indicator with consistent spinner

---

## Component API Reference

### Button Component

```typescript
<Button
  label="Save Task"
  variant="success"  // "primary" | "success" | "danger" | "secondary"
  theme="dark"  // "light" | "dark"
  onPress={handleSave}
  disabled={!title}
/>
```

### Badge Component

```typescript
<Badge
  label="Important • +15 XP"
  theme="dark"
  variant="primary"  // "primary" | "success" | "warning" | "danger" | "secondary"
  size="small"  // "small" | "medium" | "large"
/>
```

### IconButton Component

```typescript
<IconButton
  name="plus"
  size={24}
  color="#2196F3"
  library="feather"  // "feather" | "material" | "materialCommunity"
  theme="dark"
  variant="primary"
  accessibilityLabel="Create"
  accessibilityHint="Opens task creation form"
/>
```

### Separator Component

```typescript
<Separator
  theme="dark"
  variant="medium"  // "small" | "medium" | "large"
/>
```

---

## Design Tokens

All design tokens are centralized in `app/styles/DesignTokens.ts`:

- **ColorPalette**: Complete color system
- **Typography**: Font families, sizes, weights
- **Spacing**: 8px-based scale
- **BorderRadius**: Consistent radius values
- **Shadows**: Shadow elevation system
- **Breakpoints**: Responsive design points
- **Animation**: Transition timings
- **ComponentTokens**: Predefined component sizes

---

## Best Practices

### 1. Color Usage

- Always use colors from the palette
- Never hardcode color values outside the palette
- Use semantic color names (primary, success, danger)

### 2. Typography

- Use the font scale for consistency
- Maintain proper line height (1.5 for body text)
- Never mix font families

### 3. Spacing

- Use the spacing scale (multiples of 8px)
- Maintain consistent gaps between elements
- Group related elements with smaller gaps

### 4. Accessibility

- Always add accessibility labels
- Use proper semantic HTML elements
- Test with screen readers
- Ensure proper color contrast

### 5. Responsiveness

- Test on multiple screen sizes
- Use flexible layouts
- Avoid hardcoded dimensions
- Test landscape orientation

---

## Dark/Light Theme Support

The app fully supports both themes:

```typescript
// Get current theme colors
const colors = isDark ? ColorPalette.dark : ColorPalette.light;

// All components automatically adapt
const isDark = theme === "dark";
```

### Theme Switching

- User can toggle theme in Settings
- Theme preference persists locally
- Smooth transition between themes
- All colors update automatically

---

## Performance Considerations

- Memoize styled components
- Use `StyleSheet.create()` for static styles
- Lazy load images and lists
- Optimize animations for 60fps
- Use consistent shadow systems (avoid custom shadows)

---

## Future Enhancements

1. **Animations**: Add Lottie animations for achievements
2. **Haptics**: Add vibration feedback for interactions
3. **Custom Themes**: Allow user-defined color schemes
4. **Dynamic Type**: Support iOS dynamic type sizes
5. **High Contrast Mode**: Enhanced contrast option
6. **RTL Support**: Right-to-left language support
