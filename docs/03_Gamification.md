# Gamification System

## Overview

The gamification system provides comprehensive rewards, progression, and achievement mechanisms to increase user engagement and motivation. It includes experience points (XP), levels, streaks, virtual currency, and unlockable achievements.

## User Profile Model

```typescript
type UserProfile = {
    id: string; // User identifier (always "local")
    xp: number; // Current experience points
    level: number; // Current level (1-based)
    coins: number; // Virtual currency
    streak: number; // Consecutive days with task completion
    points: number; // Total accumulated points
    badges: Badge[]; // Array of unlocked achievements
    lastCompletionDate: string | null; // ISO date of last task completion
};

type Badge = {
    id: string; // Unique badge identifier
    title: string; // Display title
    icon?: string; // Optional icon identifier
    awardedAt?: string; // ISO timestamp when unlocked
    description: string; // Description of achievement
};
```

## Progression System

### Experience Points (XP) Calculation

When a task is completed, XP is awarded based on:

1. **Base XP**: From the selected tag (e.g., 15 for Urgent)
2. **Streak Bonus**: Additional XP based on consecutive day streak

**Formula**:

```
streakBonus = min(currentStreak, 7) × 2
totalXP = baseXP + floor(streakBonus × 0.5)
```

**Examples**:

- Day 1: baseXP (no streak bonus yet)
- Day 5: baseXP + floor(10 × 0.5) = baseXP + 5
- Day 7+: baseXP + floor(14 × 0.5) = baseXP + 7 (capped at 7 days)

### Points and Coins

Points and coins are awarded based on the same calculation:

**Formula**:

```
streakBonus = min(currentStreak, 7) × 2
totalPoints = basePoints + streakBonus
totalCoins = floor(totalPoints / 5)
```

### Level Progression

Levels are unlocked by accumulating XP. Each level requires an increasing amount of XP:

**Formula**:

```
requiredXP(level) = 100 × 1.4^(level-1)
```

**Examples**:

- Level 1: 100 XP
- Level 2: 140 XP (total: 240)
- Level 5: 384 XP (total: ~1,500)
- Level 10: 5,378 XP (total: ~13,820)
- Level 20: 75,259 XP (total: ~195,000)

**Key Points**:

- No level cap
- XP "overflows" to next level
- Level-up triggers achievement checks
- User receives coins as reward (equal to new level number)

### Streak System

The streak system encourages consistent daily task completion:

**How Streaks Work**:

1. First task completed in a day: streak increases by 1
2. If no tasks completed in 24 hours: streak resets to 0
3. Maximum streak: 365 days
4. Same-day double completion doesn't double-count

**Streak Mechanics**:

```typescript
// Current logic from Gamification.ts
const last = profile.lastCompletionDate?.slice(0, 10) ?? null;
const today = todayString(); // YYYY-MM-DD format

if (last) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (last === yesterday.toISOString().slice(0, 10))
        newStreak = Math.min(profile.streak + 1, 365);
    else if (last === today)
        newStreak = profile.streak; // Same-day completion
    else newStreak = 1; // Reset if gap
} else {
    newStreak = 1; // First completion
}
```

**Streak Bonuses**:

- Multiplies rewards by 1.0 to 1.4x (max at 7 days)
- Provides psychological reinforcement
- Unlocks milestone badges at 7 and 30 days

## Achievement System

### Badge Types

The system includes 9 unique achievement badges:

| ID              | Title                  | Description             | Trigger        |
| --------------- | ---------------------- | ----------------------- | -------------- |
| `first-task`    | Primeiro Passo         | Completed first task    | 1st completion |
| `7-day-streak`  | Uma Semana Incrível    | 7 consecutive days      | streak ≥ 7     |
| `30-day-streak` | Um Mês de Consistência | 30 consecutive days     | streak ≥ 30    |
| `level-5`       | Ascensão               | Reached level 5         | level ≥ 5      |
| `level-10`      | Mestre                 | Reached level 10        | level ≥ 10     |
| `level-20`      | Lenda                  | Reached level 20        | level ≥ 20     |
| `100-points`    | Centenário             | Accumulated 100 points  | points ≥ 100   |
| `500-points`    | Destaque               | Accumulated 500 points  | points ≥ 500   |
| `1000-points`   | Produtividade Extrema  | Accumulated 1000 points | points ≥ 1000  |

### Badge Unlock Logic

Location: `app/services/Gamification.ts::checkBadges()`

```typescript
function checkBadges(profile): Badge[] {
    const newBadges: Badge[] = [];

    // Check each badge condition
    if (!profile.badges.some((b) => b.id === "first-task")) {
        // Unlock if completing first task
        newBadges.push({
            id: "first-task",
            title: "Primeiro Passo",
            description: "Concluiu a primeira tarefa",
            awardedAt: new Date().toISOString(),
        });
    }

    // Similar logic for each badge type
    // ...

    return newBadges;
}
```

**Key Points**:

- Badges unlock automatically when conditions are met
- Each badge unlocks only once
- Badges persist in profile
- Unlock triggers achievement notification

## Gamification Service

Location: `app/services/Gamification.ts`

### Primary Function: applyCompletionRewards

```typescript
async function applyCompletionRewards(task: Task): Promise<{
    profile: UserProfile;
    points: number;
    xpGain: number;
    leveledUp: boolean;
    newBadges: Badge[];
}>;
```

**Process**:

1. Load current user profile
2. Get tag rewards (basePoints, baseXP)
3. Calculate streak (same-day safety check)
4. Calculate rewards with streak bonus
5. Update profile stats (points, coins, xp)
6. Check for level-ups
7. Update streak and completion date
8. Check for new badges
9. Persist updated profile
10. Return result

**Rewards Breakdown**:

```typescript
const tagRewards = getTagRewards(task.selectedTag);
const basePoints = tagRewards.basePoints; // e.g., 20
const baseXP = tagRewards.baseXP; // e.g., 15

const streakBonus = Math.min(newStreak, 7) * 2;
const points = basePoints + streakBonus; // e.g., 20 + 8 = 28
const xpGain = baseXP + Math.floor(streakBonus * 0.5); // e.g., 15 + 4 = 19
```

### Safety Features

**Same-Day Double Completion Prevention**:

```typescript
if (last === today) newStreak = profile.streak; // Don't increment
```

This prevents exploiting same-day completion for streak bonuses.

**Graceful Overflow**:

```typescript
while (profile.xp >= requiredXpForLevel(profile.level + 1)) {
    profile.xp -= requiredXpForLevel(profile.level + 1);
    profile.level += 1;
    leveledUp = true;
}
```

XP automatically overflows to next level without cap.

## User Profile Storage

Location: `app/services/UserProfileStorage.ts`

### Storage Methods

#### `loadProfile(): Promise<UserProfile>`

Loads user profile from AsyncStorage or returns default.

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

#### `requiredXpForLevel(level: number): number`

Calculates XP required to reach given level.

### Storage Key

- `@user_profile_v1` (versioned for future migrations)

## Notifications

Location: `app/services/MotivationalNotifications.ts`

### Gamification-Triggered Notifications

#### Level Up Notification

```typescript
async function notifyLevelUp(level: number, coins: number);
```

**Content**:

```
Title: "🎉 Parabéns! Você subiu para o Nível [level]!"
Body: "Recebeu [coins] moedas como recompensa!"
Sound: true
```

#### Achievement Unlock Notification

```typescript
async function notifyBadgeUnlocked(badgeTitle: string, description: string);
```

**Content**:

```
Title: "🏆 Nova Conquista Desbloqueada!"
Body: "[badgeTitle]: [description]"
Sound: true
```

#### Streak Milestone Notification

```typescript
async function notifyStreakMilestone(streak: number);
```

**Content**:

```
Title: "🔥 Streak Milestone!"
Body: "Uma semana incrível!" (if 7 days)
       OR "[streak] dias de consistência!" (if 30 days)
Sound: true
```

### Motivational Messages

8 random motivational messages are used for daily notifications:

```typescript
-"Você está indo bem! 🌟" -
    "Consecutivo incrível! 🔥" -
    "Parabéns pelo progresso! 🎉" -
    "Tempo de ser produtivo! ⏰" -
    "Quase lá! 💪" -
    "Bom trabalho! ✅" -
    "Você é incrível! 🚀" -
    "Apenas mais um? 📋";
```

## Dashboard Visualization

Location: `app/screens/DashboardScreen.tsx`

### Display Elements

- **Profile Card**: Level, Points, Coins with XP progress bar
- **Streak Counter**: Current consecutive days with fire emoji
- **Statistics**: Completed, Pending, Completion Rate
- **Badges Showcase**: Grid of unlocked achievements
- **Recent Tasks**: Last 10 completed tasks with timestamps

### XP Bar Component

Location: `app/components/XPBar.tsx`

Displays:

- Current level
- Current XP / Required XP
- Visual progress bar
- Percentage indicator

## Event System

TaskStorage emits gamification events via EventEmitter:

```typescript
gamificationEvents.emit("levelup", {
    level: newLevel,
    coins: rewardCoins,
});

gamificationEvents.emit("pointsEarned", {
    points: earnedPoints,
    xp: earnedXP,
});
```

These events allow decoupled UI updates and animations.

## Best Practices

### Reward Design

1. Balance base rewards across difficulty levels
2. Keep streak bonus achievable (7-day cap)
3. Level progression should feel rewarding, not grindy
4. Coin value should incentivize engagement

### Streak Mechanics

1. Always check for same-day exploitation
2. Use ISO date strings for consistency
3. Consider time zones for production
4. Show streak prominently in UI

### Badge Design

1. Unlock conditions should be clear to users
2. Early badges (first-task) for quick dopamine hit
3. Long-term badges (level-20) for retention
4. Milestone badges (streaks) for consistency

### Data Integrity

1. Validate all calculations
2. Prevent negative values
3. Cap streak at 365 days
4. Handle edge cases (no previous completion date)
5. Persist after every significant change

## Performance Considerations

- Badge checking: O(9) - small constant overhead
- Profile loading: Single AsyncStorage query
- XP calculation: Single loop per level-up
- Notification sending: Asynchronous, doesn't block UI

## Testing Scenarios

1. First task completion → all systems activate
2. Same-day multiple completions → streak doesn't double
3. Day gap in streak → proper reset
4. Large point accumulation → multiple level-ups
5. All badges unlocked → showcase display
