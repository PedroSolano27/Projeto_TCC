# Diagramas de Classes (UML) - Task Management App com Gamificação

## 1. Diagrama de Classes - Modelo de Dados Principal

```
┌─────────────────────────────────────────────────────────┐
│                      Task                               │
├─────────────────────────────────────────────────────────┤
│ Atributos:                                              │
│ - id: string (UUID v4)                                  │
│ - title: string                                         │
│ - selectedTag: string                                   │
│ - notes?: string                                        │
│ - dueDate?: string (ISO format)                         │
│ - createdAt: string (ISO timestamp)                     │
│ - completed: boolean                                    │
│ - completedAt?: string (ISO timestamp)                  │
│ - notificationIds?: string[]                            │
├─────────────────────────────────────────────────────────┤
│ Métodos:                                                │
│ + getId(): string                                       │
│ + isCompleted(): boolean                                │
│ + getDueDate(): Date | null                             │
│ + getCreatedDate(): Date                                │
│ + getCompletionTime(): number (em ms)                   │
│ + hasPendingNotifications(): boolean                    │
└─────────────────────────────────────────────────────────┘
         △                △               △
         │ utiliza        │ referencia     │ gera eventos
         │                │                │
         │                │                │
         ├────────────────┼────────────────┘
         │                │
         ▼                ▼
┌──────────────────────┐  ┌──────────────────────────┐
│  TagRewardConfig     │  │    UserProfile           │
├──────────────────────┤  ├──────────────────────────┤
│ Atributos:           │  │ Atributos:               │
│ - id: string         │  │ - id: string ("local")   │
│ - label: string      │  │ - xp: number             │
│ - basePoints: number │  │ - level: number (≥1)     │
│ - baseXP: number     │  │ - coins: number          │
│ - description: string│  │ - streak: number         │
│ - icon?: string      │  │ - points: number         │
├──────────────────────┤  │ - badges: Badge[]        │
│ Métodos:             │  │ - lastCompletionDate     │
│ + getRewards()       │  │   : string | null (ISO)  │
│ + updateRewards()    │  ├──────────────────────────┤
│ + isValid(): boolean │  │ Métodos:                 │
│ + toJSON(): object   │  │ + addXP(amount): void    │
└──────────────────────┘  │ + addPoints(amount): void│
                          │ + addCoins(amount): void │
                          │ + levelUp(): void        │
                          │ + incrementStreak(): void│
                          │ + resetStreak(): void    │
                          │ + addBadge(badge): void  │
                          │ + getTotalXP(): number   │
                          │ + getXPForLevel(): #     │
                          │ + getXPProgress(): #     │
                          │ + isBadgeUnlocked(id): # │
                          └──────────────────────────┘
                                    △
                                    │ contém (array)
                                    │
                         ┌──────────┴──────────────┐
                         │                         │
                         ▼                         ▼
                    ┌──────────────┐         ┌──────────────────┐
                    │    Badge     │         │  RewardCalculat. │
                    ├──────────────┤         ├──────────────────┤
                    │ Atributos:   │         │ Atributos:       │
                    │ - id: string │         │ - baseXP: number │
                    │ - title: str │         │ - basePoints: #  │
                    │ - icon?: str │         │ - bonusXP: num   │
                    │ - awardedAt? │         │ - bonusPoints: # │
                    │   : string   │         │ - totalCoins: #  │
                    │ - description│         ├──────────────────┤
                    │   : string   │         │ Métodos:         │
                    ├──────────────┤         │ + calculate()    │
                    │ Métodos:     │         │ + withStreak():# │
                    │ + isUnlocked │         │ + getCoinValue() │
                    │   (): bool   │         └──────────────────┘
                    │ + getDays    │
                    │   Since(): # │
                    │ + toJSON()   │
                    └──────────────┘
```

---

## 2. Diagrama de Classes - Camada de Serviços (Services)

```
┌───────────────────────────────────────────────────────────────────────┐
│                       TaskStorage (Service)                           │
├───────────────────────────────────────────────────────────────────────┤
│ Atributos Privados:                                                   │
│ - STORAGE_KEY: string = "@tasks_v1"                                   │
│ - NOTIFICATION_HOURS: Record<string, number>                          │
│                                                                       │
│ - notificationScheduler: NotificationScheduler                        │
│ - eventEmitter: EventEmitter                                          │
├───────────────────────────────────────────────────────────────────────┤
│ Métodos Públicos:                                                     │
│ + getAllTasks(): Promise<Task[]>                                      │
│ + saveAllTasks(tasks: Task[]): Promise<void>                          │
│ + addTask(task: Task): Promise<void>                                  │
│ + updateTask(id: string, updates: Partial<Task>): Promise<void>       │
│ + deleteTask(taskId: string): Promise<void>                           │
│ + completeTask(taskId: string): Promise<RewardResult>                 │
│ + scheduleReminders(task: Task): Promise<void>                        │
│ + cancelReminder(notificationId: string): Promise<void>               │
│ + cancelAllReminders(task: Task): Promise<void>                       │
│ + getTasksByTag(tag: string): Promise<Task[]>                         │
│ + getCompletedTasksToday(): Promise<Task[]>                           │
│ + getTasksForDate(date: Date): Promise<Task[]>                        │
│ + searchTasks(query: string): Promise<Task[]>                         │
├───────────────────────────────────────────────────────────────────────┤
│ Event Emitter (gamificationEvents):                                   │
│ - "levelup": { level: number, coins: number }                         │
│ - "badge-unlock": { badge: Badge, level: number }                     │
│ - "streak-update": { streak: number, bonus: number }                  │
│ - "task-completed": { taskId: string, xp: number }                    │
│ - "profile-updated": { profile: UserProfile }                         │
└───────────────────────────────────────────────────────────────────────┘
         △                                       △
         │ calls                                 │ emits
         │                                       │
         ├─────────────────────────────────────┬─┘
         │                                     │
         ▼                                     ▼
┌──────────────────────────┐      ┌───────────────────────────────┐
│ UserProfileStorage       │      │ Gamification (Service)        │
├──────────────────────────┤      ├───────────────────────────────┤
│ Atributos Privados:      │      │ Atributos Privados:           │
│ - STORAGE_KEY: string    │      │ - badgeConfigs: BadgeConfig[] │
│ - defaults: UserProfile  │      │ - levelFormula: LevelCalc     │
├──────────────────────────┤      ├───────────────────────────────┤
│ Métodos Públicos:        │      │ Métodos Públicos:             │
│ + loadProfile()          │      │ + applyCompletionRewards()    │
│   : Promise<UserProfile> │      │   (task): Promise<Result>     │
│ + saveProfile()          │      │ + checkBadges()               │
│   : Promise<void>        │      │   (profile): Badge[]          │
│ + initProfile()          │      │ + calculateXP()               │
│   : Promise<UserProfile> │      │   (tag, streak): number       │
│ + resetProfile()         │      │ + calculatePoints()           │
│   : Promise<void>        │      │   (tag, streak): number       │
│ + updateProfile()        │      │ + calculateCoins()            │
│   (profile): Promise<void>      │   (points): number            │
│ + requiredXpForLevel()   │      │ + calculateStreak()           │
│   (level): number        │      │   (last, today): number       │
│ + getProfileStats()      │      │ + updateStreak()              │
│   : Promise<Stats>       │      │   (profile, task): Profile    │
│                          │      │ + unlockBadges()              │
│                          │      │   (profile): Badge[]          │
│                          │      │ + isNewBadge()                │
│                          │      │   (badge, profile): boolean   │
│                          │      └───────────────────────────────┘
│                          │                  △
│                          │                  │ calcula
│                          │                  │
│                          │      ┌───────────┴────────────────┐
│                          │      │                            │
│                          │      ▼                            ▼
│                          │  ┌────────────────┐  ┌──────────────────┐
│                          │  │ BadgeChecker   │  │ LevelCalculator  │
│                          │  ├────────────────┤  ├──────────────────┤
│                          │  │+ BADGE_CONFIGS │  │+ BASE_XP: 100    │
│                          │  │+ checkAll()    │  │+ MULTIPLIER: 1.4 │
│                          │  │+ isBadgeEarned │  │+ requiredXP()    │
│                          │  │  (): boolean   │  │+ currentXP()     │
│                          │  │+ getBadges()   │  │+ xpOverflow()    │
│                          │  │  (): Badge[]   │  │+ levelForXP()    │
│                          │  │+ validateBadges│  └──────────────────┘
│                          │  │  (): Badge[]   │
│                          │  └────────────────┘
│                          │
│                          │
└──────────────────────────┘
         △
         │ persists
         │
         └─────────────────────┐
                               │
         ┌─────────────────────┴──────────────────────┐
         │                                            │
         ▼                                            ▼
┌──────────────────────────────┐  ┌──────────────────────────────┐
│ MotivationalNotifications    │  │     ExportTasks (Service)    │
├──────────────────────────────┤  ├──────────────────────────────┤
│ Atributos Privados:          │  │ Atributos Privados:          │
│ - messages: Message[]        │  │ - EXPORT_FILENAME: string    │
│ - scheduledNotifications: #[]│  │ - IMPORT_SCHEMA: JSONSchema  │
├──────────────────────────────┤  ├──────────────────────────────┤
│ Métodos Públicos:            │  │ Métodos Públicos:            │
│ + scheduleMotivational()     │  │ + exportTasksAsJSON()        │
│   (hours): Promise<void>     │  │   : Promise<void>            │
│ + sendGamification()         │  │ + importTasksFromJSON()      │
│   Notification()             │  │   (file): Promise<void>      │
│ + notifyLevelUp()            │  │ + validateImportData()       │
│   (level, coins)             │  │   (data): boolean            │
│ + notifyBadgeUnlocked()      │  │ + generateExportData()       │
│   (badge, profile)           │  │   : ExportData               │
│ + notifyStreakMilestone()    │  │ + parseImportedTasks()       │
│   (streak)                   │  │   (json): Task[]             │
│ + cancelMotivational()       │  │ + shareExportedTasks()       │
│   : Promise<void>            │  │   : Promise<void>            │
│ + getRandomMessage()         │  │ + validateTaskSchema()       │
│   : Message                  │  │   (task): boolean            │
│                              │  │ + mergeWithExisting()        │
│                              │  │   (tasks): Task[]            │
│                              │  └──────────────────────────────┘
│                              │
└──────────────────────────────┘
```

---

## 3. Diagrama de Classes - Componentes UI (Reusable)

```
┌────────────────────────────────────────────────────────────────────┐
│                  Componentes Reutilizáveis (Presentational)        │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐    │
│  │         Button               │  │        Card              │    │
│  ├──────────────────────────────┤  ├──────────────────────────┤    │
│  │ Props:                       │  │ Props:                   │    │
│  │ - label: string              │  │ - title?: string         │    │
│  │ - onPress: () => void        │  │ - children: ReactNode    │    │
│  │ - variant?: 'primary'|'seco' │  │ - onPress?: () => void   │    │
│  │ - disabled?: boolean         │  │ - style?: StyleProp      │    │
│  │ - loading?: boolean          │  │ - testID?: string        │    │
│  │ - testID?: string            │  │                          │    │
│  ├──────────────────────────────┤  ├──────────────────────────┤    │
│  │ + render(): JSX.Element      │  │ + render(): JSX.Element  │    │
│  │ + handlePress(): void        │  │ + renderHeader(): JSX    │    │ 
│  │ + getButtonStyle(): StyleProp│  │ + renderContent(): JSX   │    │
│  │ + showLoading(): void        │  │ + getCardStyle(): Style  │    │
│  └──────────────────────────────┘  └──────────────────────────┘    │
│                                                                    │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐    │
│  │       FormField              │  │    TagSelector           │    │
│  ├──────────────────────────────┤  ├──────────────────────────┤    │
│  │ Props:                       │  │ Props:                   │    │
│  │ - label: string              │  │ - tags: Tag[]            │    │
│  │ - value: string              │  │ - selected: Tag | null   │    │
│  │ - onChangeText: (txt) => void│  │ - onSelect: (tag) => void│    │
│  │ - placeholder?: string       │  │ - disabled?: boolean     │    │
│  │ - error?: string             │  │ - multiSelect?: boolean  │    │
│  │ - secureTextEntry?: bool     │  │ - testID?: string        │    │
│  ├──────────────────────────────┤  ├──────────────────────────┤    │
│  │ + render(): JSX.Element      │  │ + render(): JSX.Element  │    │
│  │ + handleInputChange(): void  │  │ + renderTags(): JSX      │    │
│  │ + showError(): boolean       │  │ + handleTagSelect(): void│    │
│  │ + getFieldStyle(): StyleProp │  │ + getSelectedTags(): Tag │    │
│  └──────────────────────────────┘  └──────────────────────────┘    │
│                                                                    │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐    │
│  │      TimeSelector            │  │    XPBar                 │    │
│  ├──────────────────────────────┤  ├──────────────────────────┤    │
│  │ Props:                       │  │ Props:                   │    │
│  │ - times: string[]            │  │ - current: number        │    │
│  │ - selected: string[]         │  │ - required: number       │    │
│  │ - onSelect: (times) => void  │  │ - level: number          │    │
│  │ - disabled?: boolean         │  │ - animated?: boolean     │    │
│  │ - testID?: string            │  │ - testID?: string        │    │
│  ├──────────────────────────────┤  ├──────────────────────────┤    │
│  │ + render(): JSX.Element      │  │ + render(): JSX.Element  │    │
│  │ + renderTimeOptions(): JSX   │  │ + renderBar(): JSX       │    │
│  │ + getSelectedTimes(): string │  │ + calculateProgress(): # │    │
│  │ + toggleTime(time): void     │  │ + animateProgress(): void│    │
│  └──────────────────────────────┘  └──────────────────────────┘    │
│                                                                    │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐    │
│  │      LevelUpModal            │  │    TaskItem              │    │
│  ├──────────────────────────────┤  ├──────────────────────────┤    │
│  │ Props:                       │  │ Props:                   │    │
│  │ - visible: boolean           │  │ - task: Task             │    │
│  │ - level: number              │  │ - onPress?: () => void   │    │
│  │ - coins: number              │  │ - onDelete?: () => void  │    │
│  │ - onClose: () => void        │  │ - onComplete?: () => void│    │
│  │ - testID?: string            │  │ - testID?: string        │    │
│  ├──────────────────────────────┤  ├──────────────────────────┤    │
│  │ + render(): JSX.Element      │  │ + render(): JSX.Element  │    │
│  │ + renderContent(): JSX       │  │ + renderTitle(): JSX     │    │
│  │ + playAnimation(): Promise   │  │ + renderMetadata(): JSX  │    │
│  │ + handleClose(): void        │  │ + handleLongPress(): void│    │
│  └──────────────────────────────┘  └──────────────────────────┘    │
│                                                                    │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐    │
│  │       Badge                  │  │    Separator             │    │
│  ├──────────────────────────────┤  ├──────────────────────────┤    │
│  │ Props:                       │  │ Props:                   │    │
│  │ - badge: Badge               │  │ - margin?: number        │    │
│  │ - unlocked: boolean          │  │ - color?: string         │    │
│  │ - onPress?: () => void       │  │ - thickness?: number     │    │
│  │ - showDetails?: boolean      │  │ - testID?: string        │    │
│  ├──────────────────────────────┤  ├──────────────────────────┤    │
│  │ + render(): JSX.Element      │  │ + render(): JSX.Element  │    │
│  │ + renderBadgeIcon(): JSX     │  │ + getSeparatorStyle()    │    │
│  │ + renderDetails(): JSX       │  │ + getMarginStyle()       │    │
│  │ + handleBadgePress(): void   │  └──────────────────────────┘    │
│  └──────────────────────────────┘                                  │
│                                                                    │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐    │
│  │      IconButton              │  │  HourMinuteSelector      │    │
│  ├──────────────────────────────┤  ├──────────────────────────┤    │
│  │ Props:                       │  │ Props:                   │    │
│  │ - icon: string               │  │ - hours: number[]        │    │
│  │ - onPress: () => void        │  │ - minutes: number[]      │    │
│  │ - size?: number              │  │ - onSelect: (h,m)=> void │    │
│  │ - color?: string             │  │ - testID?: string        │    │
│  ├──────────────────────────────┤  ├──────────────────────────┤    │
│  │ + render(): JSX.Element      │  │ + render(): JSX.Element  │    │
│  │ + handlePress(): void        │  │ + renderSelectors(): JSX │    │
│  │ + getIconStyle(): StyleProp  │  │ + handleSelection(): void│    │
│  └──────────────────────────────┘  └──────────────────────────┘    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 4. Diagrama de Classes - Telas (Screens)

```
┌────────────────────────────────────────────────────────────────────┐
│            Componentes de Tela (Navigation Screens)                │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────┐                          │
│  │    TaskListScreen                    │                          │
│  ├──────────────────────────────────────┤                          │
│  │ Props:                               │                          │
│  │ - navigation: StackNavigation        │                          │
│  │ - route: RouteProp                   │                          │
│  │                                      │                          │
│  │ State:                               │                          │
│  │ - tasks: Task[]                      │                          │
│  │ - filteredTasks: Task[]              │                          │
│  │ - loading: boolean                   │                          │
│  │ - refreshing: boolean                │                          │
│  │ - selectedTasks: Set<string>         │                          │
│  │                                      │                          │
│  ├──────────────────────────────────────┤                          │
│  │ Métodos:                             │                          │
│  │ + loadTasks(): Promise<void>         │                          │
│  │ + handleCompleteTask(id): Promise    │                          │
│  │ + handleDeleteTask(id): Promise      │                          │
│  │ + handleEditTask(task): void         │                          │
│  │ + handleNavigateToDashboard(): void  │                          │
│  │ + handleNavigateToForm(): void       │                          │
│  │ + handleNavigateToSettings(): void   │                          │
│  │ + onRefresh(): Promise<void>         │                          │
│  │ + applyFilter(): Task[]              │                          │
│  │ + renderTaskList(): JSX              │                          │
│  │ + renderEmptyState(): JSX            │                          │
│  │ + renderHeader(): JSX                │                          │
│  │ + renderFloatingAction(): JSX        │                          │
│  │                                      │                          │
│  │ Dependencies:                        │                          │
│  │ - TaskStorage (service)              │                          │
│  │ - useUserProfile() hook              │                          │
│  │ - useSettings() context              │                          │
│  └──────────────────────────────────────┘                          │
│                                                                    │
│  ┌──────────────────────────────────────┐  ┌─────────────────┐     │
│  │   DashboardScreen                    │  │ SettingsScreen  │     │
│  ├──────────────────────────────────────┤  ├─────────────────┤     │
│  │ Props:                               │  │ Props:          │     │
│  │ - navigation: StackNavigation        │  │- navigation     │     │
│  │ - route: RouteProp                   │  │- route          │     │
│  │                                      │  │                 │     │
│  │ State:                               │  │ State:          │     │
│  │ - profile: UserProfile               │  │- theme: string  │     │
│  │ - badges: Badge[]                    │  │- filter: string │     │
│  │ - stats: DashboardStats              │  │- exporting: bool│     │
│  │ - loading: boolean                   │  │- importing: bool│     │
│  │ - recentTasks: Task[]                │  │- importError?: #│     │
│  │                                      │  │                 │     │
│  ├──────────────────────────────────────┤  ├─────────────────┤     │
│  │ Métodos:                             │  │ Métodos:        │     │
│  │ + loadProfile(): Promise<void>       │  │+ loadSettings() │     │
│  │ + getStats(): DashboardStats         │  │+ handleTheme()  │     │
│  │ + calculateCompletion(): number      │  │+ handleFilter() │     │
│  │ + getRecentTasks(): Task[]           │  │+ handleExport() │     │
│  │ + getStreakBonus(): number           │  │+ handleImport() │     │
│  │ + renderProfile(): JSX               │  │+ handleReset()  │     │
│  │ + renderStats(): JSX                 │  │+ saveSetting()  │     │
│  │ + renderBadges(): JSX                │  │+ renderTheme()  │     │
│  │ + renderXPBar(): JSX                 │  │+ renderFilters()│     │
│  │ + renderRecentTasks(): JSX           │  │+ renderExport() │     │
│  │ + onFocus(): void (refresh)          │  │+ renderImport() │     │
│  │                                      │  │+ validateImport │     │
│  │ Dependencies:                        │  │                 │     │
│  │ - UserProfileStorage                 │  │ Dependencies:   │     │
│  │ - TaskStorage                        │  │- SettingsContext│     │
│  │ - useUserProfile()                   │  │- ExportTasks    │     │ 
│  │ - useSettings()                      │  │- useSettings()  │     │
│  └──────────────────────────────────────┘  └─────────────────┘     │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │          TaskFormScreen                                    │    │
│  ├────────────────────────────────────────────────────────────┤    │
│  │ Props:                                                     │    │
│  │ - navigation: StackNavigation                              │    │
│  │ - route: RouteProp<'Form', { taskId?: string }>            │    │
│  │                                                            │    │
│  │ State:                                                     │    │
│  │ - formData: {                                              │    │
│  │     title: string,                                         │    │
│  │     notes?: string,                                        │    │
│  │     tag: string,                                           │    │
│  │     dueDate?: Date,                                        │    │
│  │     times: string[],                                       │    │ 
│  │   }                                                        │    │ 
│  │ - loading: boolean                                         │    │
│  │ - editing: boolean                                         │    │
│  │ - taskId?: string                                          │    │
│  │ - errors: Map<string, string>                              │    │
│  │                                                            │    │
│  ├────────────────────────────────────────────────────────────┤    │
│  │ Métodos:                                                   │    │
│  │ + handleTitleChange(text): void                            │    │
│  │ + handleNotesChange(text): void                            │    │
│  │ + handleTagSelect(tag): void                               │    │
│  │ + handleDateSelect(date): void                             │    │
│  │ + handleTimeSelect(times): void                            │    │
│  │ + handleSubmit(): Promise<void>                            │    │
│  │ + loadTaskForEdit(): Promise<void>                         │    │
│  │ + validateForm(): boolean                                  │    │
│  │ + renderTitleInput(): JSX                                  │    │
│  │ + renderNotesInput(): JSX                                  │    │
│  │ + renderTagSelector(): JSX                                 │    │
│  │ + renderDatePicker(): JSX                                  │    │
│  │ + renderTimeSelector(): JSX                                │    │
│  │ + renderSubmitButton(): JSX                                │    │
│  │ + showValidationError(field): string | null                │    │
│  │                                                            │    │
│  │ Dependencies:                                              │    │
│  │ - TaskStorage                                              │    │
│  │ - SettingsContext                                          │    │
│  │ - expo-notifications                                       │    │
│  │ - @react-native-community/datetimepicker                   │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---
