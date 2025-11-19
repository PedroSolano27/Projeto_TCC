# Diagramas de Caso de Uso - Task Management App com Gamificação

## 1. Diagrama de Caso de Uso Global

```
                              ┌─────────────────┐
                              │  Usuário Final  │
                              └────────┬────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
              ▼                        ▼                        ▼
    ┌──────────────────────┐  ┌──────────────────┐  ┌─────────────────┐
    │ Gerenciar Tarefas    │  │ Acompanhar       │  │ Personalizar    │
    │ (Task Management)    │  │ Progresso        │  │ Configurações   │
    │                      │  │ (Gamification)   │  │ (Settings)      │
    └──────────────────────┘  └──────────────────┘  └─────────────────┘
              │                        │                        │
    ┌─────────┴──────────────┐        │        ┌───────────────┴────────┐
    │                        │        │        │                        │
    ▼                        ▼        ▼        ▼                        ▼
┌──────────┐  ┌──────────┐  ┌─────┐  ┌──────┐  ┌───────────┐  ┌────────────┐
│ Criar    │  │ Completar│  │ Ver │  │ Fazer│  │ Exportar/ │  │ Ativar     │
│ Tarefa   │  │ Tarefa   │  │ Dash│  │Level │  │ Importar  │  │ Temas      │
│          │  │          │  │Board│  │-up   │  │ Dados     │  │            │
└──────────┘  └──────────┘  └─────┘  └──────┘  └───────────┘  └────────────┘
```

---

## 2. Diagrama de Caso de Uso - Gerenciamento de Tarefas

```
                     ┌──────────────────────┐
                     │   Usuário Final      │
                     │   (Task Manager)     │
                     └──────────┬───────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
                    ▼           ▼           ▼
              ┌──────────┐ ┌─────────┐ ┌──────────┐
              │ Criar    │ │ Editar  │ │ Deletar  │
              │ Tarefa   │ │ Tarefa  │ │ Tarefa   │
              └────┬─────┘ └────┬────┘ └────┬─────┘
                   │           │           │
                   └───────┬───┴───────────┘
                           │
                           ▼
                   ┌──────────────────┐
                   │ Gerenciar Dados  │
                   │ de Tarefa:       │
                   │ - Título         │
                   │ - Descrição      │
                   │ - Tag/Categoria  │
                   │ - Data Vencimento│
                   │ - Notificações   │
                   └──────────────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
      ┌──────────┐   ┌──────────┐   ┌──────────┐
      │ Agendar  │   │ Marcar   │   │ Listar   │
      │ Notifica-│   │ Concluída│   │ Tarefas  │
      │ ções     │   │          │   │          │
      └──────────┘   └────┬─────┘   └──────────┘
                          │
                          ▼
                   ┌──────────────────┐
                   │ Aplicar          │
                   │ Recompensas      │
                   │ (XP, Pontos,     │
                   │  Coins, Badges)  │
                   └──────────────────┘
```

### Fluxo Detalhado de Criação de Tarefa

```
┌─────────────────────────────────────────────────────────────────┐
│ CRIAR TAREFA                                                    │
├─────────────────────────────────────────────────────────────────┤
│ Ator: Usuário Final                                            │
│ Pré-condição: Usuário navegou até TaskFormScreen              │
├─────────────────────────────────────────────────────────────────┤
│ Fluxo Principal:                                                │
│ 1. Usuário insere título da tarefa (OBRIGATÓRIO)              │
│ 2. Usuário seleciona uma tag/categoria                        │
│    └─> Tags disponíveis:                                       │
│        • Urgente (15 XP, 20 Pts)                              │
│        • Importante (12 XP, 15 Pts)                           │
│        • Trabalho (8 XP, 10 Pts)                              │
│        • Estudo (10 XP, 12 Pts)                               │
│        • Pessoal (6 XP, 8 Pts) [Padrão]                       │
│        • Saúde (11 XP, 14 Pts)                                │
│        • Finanças (13 XP, 16 Pts)                             │
│        • Criativo (9 XP, 11 Pts)                              │
│ 3. Usuário adiciona notas (OPCIONAL)                          │
│ 4. Usuário seleciona data de vencimento (OPCIONAL)            │
│ 5. Usuário configura notificações (OPCIONAL)                  │
│    └─> Horários disponíveis: 1h, 2h, 4h, 8h, 24h             │
│ 6. Usuário toca "Salvar"                                       │
│ 7. Sistema cria UUID único para tarefa                        │
│ 8. Sistema persiste tarefa em AsyncStorage                    │
│ 9. Sistema agenda notificações (se houver dueDate)            │
│ 10. Tela retorna para TaskListScreen                          │
│ 11. Lista atualiza com nova tarefa                            │
├─────────────────────────────────────────────────────────────────┤
│ Fluxo Alternativo (Validação):                                 │
│ • Se título vazio → Desabilita botão "Salvar"                │
│ • Se data vencimento no passado → Aviso visual                │
│ • Se notificação sem dueDate → Ignora notificações            │
│                                                                 │
│ Fluxo de Exceção (Erro):                                       │
│ • Se falha AsyncStorage → Exibe alerta de erro                │
│ • Se falha ao agendar notif → Continua sem notificações       │
└─────────────────────────────────────────────────────────────────┘
```

### Fluxo Detalhado de Conclusão de Tarefa

```
┌─────────────────────────────────────────────────────────────────┐
│ COMPLETAR TAREFA E RECEBER RECOMPENSAS                         │
├─────────────────────────────────────────────────────────────────┤
│ Ator: Usuário Final                                            │
│ Pré-condição: Tarefa existe e não está completa               │
├─────────────────────────────────────────────────────────────────┤
│ Fluxo Principal:                                                │
│ 1. Usuário toca no checkbox de uma tarefa em TaskListScreen   │
│ 2. Sistema marca tarefa como completada                       │
│ 3. Sistema registra timestamp de conclusão (completedAt)      │
│ 4. Sistema cancela notificações agendadas                     │
│ 5. Sistema calcula XP ganho:                                   │
│    └─> XP = baseXP(tag) + floor(min(streak,7) × 2 × 0.5)     │
│ 6. Sistema calcula Pontos:                                     │
│    └─> Pts = basePoints(tag) + min(streak,7) × 2             │
│ 7. Sistema calcula Coins:                                      │
│    └─> Coins = floor(totalPoints / 5)                        │
│ 8. Sistema atualiza streak:                                    │
│    ├─> Se última conclusão foi hoje: streak não muda         │
│    ├─> Se última conclusão foi ontem: streak += 1            │
│    └─> Se última conclusão foi +2 dias atrás: streak = 1     │
│ 9. Sistema verifica desbloqueio de badges:                     │
│    ├─> Primeira conclusão? → Unlock "First Task"             │
│    ├─> 5 conclusões? → Unlock "5 Complete"                   │
│    ├─> Streak 7 dias? → Unlock "Week Warrior"                │
│    ├─> Level 5? → Unlock "Rising Star"                       │
│    └─> ... e mais 4 badges                                    │
│ 10. Sistema verifica level-up:                                 │
│     └─> Se XP >= requiredXP(nível) → Level-up!              │
│         └─> Ganha coins = novo level                         │
│         └─> Modal de celebração exibida                       │
│ 11. Sistema persiste perfil atualizado                        │
│ 12. UI atualiza com animação de conclusão                     │
│ 13. Dashboard notificado para atualizar stats                 │
├─────────────────────────────────────────────────────────────────┤
│ Exemplo Cálculo:                                                │
│ Tarefa com tag "Urgente" (15 XP base, 20 Pts base)           │
│ Streak atual: 5 dias                                           │
│ Cálculo:                                                        │
│  • streakBonus = min(5, 7) × 2 = 10                           │
│  • XP = 15 + floor(10 × 0.5) = 15 + 5 = 20 XP                │
│  • Pontos = 20 + 10 = 30 Pts                                  │
│  • Coins = floor(30 / 5) = 6 Coins                            │
│  • Streak: 5 → 6                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Diagrama de Caso de Uso - Sistema de Gamificação

```
                    ┌──────────────────────┐
                    │   Usuário Final      │
                    │   (Gamer)            │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
          ┌──────────────────┐  ┌──────────────────┐
          │ Ganhar XP e      │  │ Desbloquear      │
          │ Progredir Níveis │  │ Badges           │
          └────────┬─────────┘  └──────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
    ┌───────┐ ┌────────┐ ┌──────────┐
    │Ganhar │ │Manter  │ │Receber   │
    │Pontos │ │Streak  │ │Coins     │
    └───────┘ └────────┘ └──────────┘
        │          │          │
        └──────────┼──────────┘
                   │
                   ▼
          ┌──────────────────────┐
          │ Visualizar Progresso │
          │ no Dashboard:        │
          │ • Nível Atual        │
          │ • XP Progress Bar    │
          │ • Streak Counter     │
          │ • Coins Totais       │
          │ • Badges Desbloqueadas
          │ • Taxa Conclusão (%)│
          └──────────────────────┘
```

### Fluxo Detalhado de Sistema de Badges

```
┌─────────────────────────────────────────────────────────────────┐
│ DESBLOQUEAR BADGES (CONQUISTAS)                                │
├─────────────────────────────────────────────────────────────────┤
│ Ator: Sistema de Gamificação (automático)                      │
│ Gatilho: Conclusão de tarefa                                   │
├─────────────────────────────────────────────────────────────────┤
│ BADGES DISPONÍVEIS:                                             │
├─────────────────────────────────────────────────────────────────┤
│ 1. 🎯 "First Task" (Primeira Tarefa)                          │
│    └─> Condition: completedTasks == 1                          │
│    └─> Reward: 10 XP bônus                                    │
│                                                                 │
│ 2. 💪 "Rising Star" (Estrela em Ascensão)                      │
│    └─> Condition: level >= 5                                   │
│    └─> Reward: 25 XP bônus                                    │
│                                                                 │
│ 3. 🔥 "Week Warrior" (Guerreiro da Semana)                    │
│    └─> Condition: streak >= 7                                  │
│    └─> Reward: 20 XP bônus                                    │
│                                                                 │
│ 4. ⭐ "Completed 5" (5 Concluídas)                            │
│    └─> Condition: completedTasks >= 5                         │
│    └─> Reward: 15 XP bônus                                    │
│                                                                 │
│ 5. 🏆 "Unstoppable" (Inarrável)                                │
│    └─> Condition: streak >= 30                                │
│    └─> Reward: 50 XP bônus                                    │
│                                                                 │
│ 6. 🎖️ "Master" (Mestre)                                        │
│    └─> Condition: completedTasks >= 100                       │
│    └─> Reward: 100 XP bônus                                   │
│                                                                 │
│ 7. 💎 "Elite" (Elite)                                          │
│    └─> Condition: level >= 20                                  │
│    └─> Reward: Título especial                                │
│                                                                 │
│ 8. 🌟 "Perfect Month" (Mês Perfeito)                           │
│    └─> Condition: completedTasks >= 50 em um mês             │
│    └─> Reward: 75 XP bônus                                    │
│                                                                 │
│ 9. 🚀 "Legendary" (Lendário)                                   │
│    └─> Condition: level >= 50                                  │
│    └─> Reward: Reconhecimento especial                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Fluxo de Desbloqueio:                                           │
│ 1. Tarefa completada → Service Gamification acionado           │
│ 2. Carrega perfil do usuário                                   │
│ 3. Para cada badge não desbloqueado:                           │
│    └─> Verifica condição de desbloqueio                       │
│ 4. Se condição verdadeira:                                     │
│    ├─> Adiciona badge ao array de badges                      │
│    ├─> Registra timestamp de desbloqueio                      │
│    ├─> Aplica XP/Rewards bônus                                │
│    └─> Emite evento para UI atualizar                         │
│ 5. Modal de celebração exibida (se novo badge)                │
│ 6. Persiste perfil em AsyncStorage                            │
└─────────────────────────────────────────────────────────────────┘
```

### Fluxo Detalhado de Progressão de Níveis

```
┌─────────────────────────────────────────────────────────────────┐
│ PROGREDIR DE NÍVEL (LEVEL-UP)                                  │
├─────────────────────────────────────────────────────────────────┤
│ Ator: Sistema de Gamificação (automático)                      │
│ Gatilho: XP acumulado >= XP necessário do próximo nível       │
├─────────────────────────────────────────────────────────────────┤
│ FÓRMULA DE PROGRESSÃO:                                          │
│ requiredXP(level) = 100 × 1.4^(level-1)                       │
│                                                                 │
│ Exemplos:                                                       │
│ • Level 1: 100 XP                                              │
│ • Level 2: 140 XP (acumulado: 240)                            │
│ • Level 3: 196 XP (acumulado: 436)                            │
│ • Level 5: 384 XP (acumulado: ~1,500)                         │
│ • Level 10: 5,378 XP (acumulado: ~13,820)                     │
│ • Level 20: 75,259 XP (acumulado: ~195,000)                   │
│ • Sem limite máximo de nível                                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Fluxo de Level-Up:                                              │
│ 1. Tarefa completada, XP adicionado ao perfil                  │
│ 2. Sistema verifica: totalXP >= requiredXP(nível)?            │
│ 3. Sim: Level-up dispara!                                      │
│    ├─> Level += 1                                             │
│    ├─> XP "overflow" transferido para novo nível             │
│    │  └─> Fórmula: XP_novo = (XP_total - XP_acumulado)       │
│    ├─> Coins ganhos = número do novo nível                    │
│    ├─> Modal de celebração exibida                            │
│    ├─> Dashboard atualiza com novo level                      │
│    ├─> Verifica desbloqueio de badges por level               │
│    └─> Persiste perfil                                        │
│ 4. Não: Continua com XP atual                                 │
│                                                                 │
│ Exemplo Progression:                                            │
│ • Nível 1: 50 XP / 100 XP necessário                          │
│ • Complete tarefa (20 XP): 70 XP / 100 XP                    │
│ • Complete tarefa (50 XP): 120 XP / 100 XP → LEVEL UP!       │
│   └─> Novo Level: 2                                            │
│   └─> XP para próximo: 20 / 140                               │
│   └─> Coins: +2                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Diagrama de Caso de Uso - Streaks (Sequência de Dias)

```
┌──────────────────────────────────────────────────────────────────┐
│ MANTER E GERENCIAR STREAK                                       │
├──────────────────────────────────────────────────────────────────┤
│ Ator: Sistema de Gamificação (automático)                       │
│ Pré-condição: Tarefa completada                                 │
├──────────────────────────────────────────────────────────────────┤
│ LÓGICA DE STREAK:                                                │
│                                                                  │
│ Cenário 1: Primeira tarefa do dia                              │
│ • lastCompletionDate = NULL ou data de ontem                  │
│ • Ação: streak += 1                                             │
│ • Bônus XP: min(streak, 7) × 2 × 0.5 = +5 a +7 XP             │
│                                                                  │
│ Cenário 2: Múltiplas tarefas no mesmo dia                      │
│ • lastCompletionDate = hoje                                    │
│ • Ação: streak não muda (não conta duplo)                      │
│ • Bônus XP: usa streak atual                                    │
│                                                                  │
│ Cenário 3: Quebra de streak (≥2 dias sem completar)            │
│ • lastCompletionDate > 24h atrás                              │
│ • Ação: streak = 1 (reinicia)                                  │
│ • Bônus XP: +0 (pois streak = 1)                               │
│                                                                  │
│ Cenário 4: Limite de streak                                     │
│ • Máximo streak: 365 dias (um ano)                             │
│ • Bonus cap: min(streak, 7) × 2 = máximo 14 pontos           │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│ VISUALIZAÇÃO EM DASHBOARD:                                      │
│ • Streak Counter exibido                                        │
│ • Ícone de fogo para streaks ≥ 3                               │
│ • Animação ao quebrar streak                                    │
│ • Notificação motivacional se streak em risco (fim do dia)      │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│ NOTIFICAÇÕES MOTIVACIONAIS:                                      │
│ • Agendadas diariamente (12 horas)                              │
│ • Aumentam urgência se streak em risco                          │
│ • Mensagens personalizadas por nível                            │
│ • Desabilitáveis nas configurações                              │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Diagrama de Caso de Uso - Configurações e Personalização

```
                    ┌──────────────────────┐
                    │   Usuário Final      │
                    │   (Settings Admin)   │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
          ┌──────────┐   ┌──────────┐   ┌────────────┐
          │ Ativar   │   │ Filtrar  │   │ Exportar/  │
          │ Temas    │   │ Tarefas  │   │ Importar   │
          │(Light/   │   │          │   │ Dados      │
          │ Dark)    │   │          │   │            │
          └──────────┘   └──────────┘   └────────────┘
                │              │              │
                └──────────────┼──────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │ Persistir Config │
                        │ em AsyncStorage  │
                        └──────────────────┘
```

### Fluxo Detalhado de Configurações

```
┌─────────────────────────────────────────────────────────────────┐
│ GERENCIAR CONFIGURAÇÕES DO APLICATIVO                          │
├─────────────────────────────────────────────────────────────────┤
│ Ator: Usuário Final                                            │
│ Pré-condição: Usuário navegou até SettingsScreen              │
├─────────────────────────────────────────────────────────────────┤
│ SEÇÃO 1: APARÊNCIA                                              │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ • Toggle Tema (Light/Dark)                                  ││
│ │   └─> Armazena em SettingsContext                           ││
│ │   └─> Aplica imediatamente a todas telas                    ││
│ │   └─> Persiste em AsyncStorage                              ││
│ │   └─> Cores:                                                ││
│ │       Light: Background #FFFFFF, Text #000000               ││
│ │       Dark: Background #1A1A2E, Text #FFFFFF                ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ SEÇÃO 2: FILTROS DE TAREFA                                      │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ • Seletor de Filtro (All/Completed/Pending)               ││
│ │   └─> "All": Mostra todas as tarefas                        ││
│ │   └─> "Completed": Mostra apenas concluídas                ││
│ │   └─> "Pending": Mostra apenas incompletas                 ││
│ │   └─> Padrão: "All"                                        ││
│ │   └─> Persiste preferência do usuário                       ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ SEÇÃO 3: DADOS E PRIVACIDADE                                    │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ • Botão "Exportar Dados"                                    ││
│ │   └─> Formato: JSON                                        ││
│ │   └─> Conteúdo: Todas as tarefas + perfil do usuário      ││
│ │   └─> Exporta via: Share API do Expo                       ││
│ │   └─> Opções: Enviar por email, salvar em nuvem, etc       ││
│ │                                                              ││
│ │ • Botão "Importar Dados"                                    ││
│ │   └─> Formato esperado: JSON                               ││
│ │   └─> Seleciona arquivo via DocumentPicker                 ││
│ │   └─> Validação de formato                                  ││
│ │   └─> Merge com dados existentes ou replace                ││
│ │   └─> Restaura notificações agendadas                      ││
│ │                                                              ││
│ │ • Indicador de Carregamento                                ││
│ │   └─> Mostra durante export/import                         ││
│ │   └─> Desabilita botões                                    ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Fluxo Principal:                                                │
│ 1. Usuário toca SettingsScreen                                 │
│ 2. Carrega configurações atuais de AsyncStorage               │
│ 3. Apresenta opções de configuração                           │
│ 4. Usuário modifica uma ou mais configurações                 │
│ 5. Mudança aplica-se imediatamente (live update)              │
│ 6. Configuração persiste em AsyncStorage                      │
│ 7. Context API notifica todos os subscribers (telas)           │
│ 8. Todas as telas recebem nova configuração                   │
│                                                                 │
│ Fluxo Alternativo - Export:                                    │
│ 1. Usuário toca "Exportar Dados"                               │
│ 2. Sistema coleta: getAllTasks() + loadProfile()              │
│ 3. Converte para JSON formatado                               │
│ 4. Abre Share Modal (Expo Sharing)                            │
│ 5. Usuário escolhe destino (email, WhatsApp, etc)             │
│ 6. Exibe sucesso/erro                                          │
│                                                                 │
│ Fluxo Alternativo - Import:                                    │
│ 1. Usuário toca "Importar Dados"                               │
│ 2. Abre DocumentPicker                                         │
│ 3. Seleciona arquivo JSON                                      │
│ 4. Sistema valida formato JSON                                │
│ 5. Se válido:                                                  │
│    ├─> Pergunta: Substituir ou mesclar?                       │
│    ├─> Se mesclar: Combina tasks existentes + novas            │
│    ├─> Re-agenda notificações de todas as tarefas             │
│    ├─> Carrega perfil salvo                                   │
│    └─> Exibe confirmação                                       │
│ 6. Se inválido: Exibe erro de formato                         │
│                                                                 │
│ Fluxo de Exceção:                                              │
│ • Se falha ao carregar configs → Usa valores padrão           │
│ • Se Share falha → Mensagem de erro                           │
│ • Se Import falha → Não modifica dados locais                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Diagrama de Caso de Uso - Dashboard e Visualização

```
                    ┌──────────────────────┐
                    │   Usuário Final      │
                    │   (Progress Viewer)  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────────┐
                    │ Ver Dashboard de         │
                    │ Progresso                │
                    └────────────┬─────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
        │ Ver Stats    │ │ Ver XP       │ │ Ver Badges   │
        │ (Taxa, Dias) │ │ Progress     │ │ (Conquistas) │
        └──────────────┘ │ (Level, Bar) │ └──────────────┘
                         └──────────────┘
                                │
                    ┌───────────┴──────────┐
                    │                      │
                    ▼                      ▼
            ┌─────────────────┐   ┌──────────────┐
            │ Ver Tarefas     │   │ Ver Coins &  │
            │ Recentes        │   │ Streak       │
            │ (Timestamps)    │   │ (Contadores) │
            └─────────────────┘   └──────────────┘
```

### Fluxo Detalhado de Visualização do Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│ VISUALIZAR DASHBOARD DE PROGRESSO                              │
├─────────────────────────────────────────────────────────────────┤
│ Ator: Usuário Final                                            │
│ Pré-condição: Pelo menos 1 tarefa foi criada                   │
├─────────────────────────────────────────────────────────────────┤
│ DASHBOARD WIDGETS:                                              │
│                                                                 │
│ 1. HEADER COM INFO DO PERFIL                                    │
│    ┌───────────────────────────────────────────┐               │
│    │ 🎮 Level 15    👤 Usuário                │               │
│    │ 🎯 XP: 5,432 / 8,000 (68%)              │               │
│    └───────────────────────────────────────────┘               │
│    └─> Barra visual de progressão até próximo level            │
│                                                                 │
│ 2. ESTATÍSTICAS GERAIS                                          │
│    ┌───────────────────────────────────────────┐               │
│    │ 📊 ESTATÍSTICAS                           │               │
│    │ • Tarefas Total: 47                        │               │
│    │ • Concluídas: 35 (74%)                     │               │
│    │ • Pendentes: 12 (26%)                      │               │
│    │ • Taxa de Conclusão: 74%                   │               │
│    └───────────────────────────────────────────┘               │
│                                                                 │
│ 3. MOEDA E STREAK                                               │
│    ┌───────────────────────────────────────────┐               │
│    │ 🪙 Coins: 248      🔥 Streak: 7 dias      │               │
│    └───────────────────────────────────────────┘               │
│                                                                 │
│ 4. BADGES/CONQUISTAS                                            │
│    ┌───────────────────────────────────────────┐               │
│    │ 🎖️ SUAS CONQUISTAS (9/9)                  │               │
│    │ ✅ First Task       ✅ Completed 5         │               │
│    │ ✅ Week Warrior     ✅ Rising Star        │               │
│    │ ✅ Unstoppable      ✅ Master             │               │
│    │ ✅ Elite            ✅ Perfect Month       │               │
│    │ ✅ Legendary                                │               │
│    │                                             │               │
│    │ (Tap para detalhes e timestamps)           │               │
│    └───────────────────────────────────────────┘               │
│                                                                 │
│ 5. HISTÓRICO RECENTE DE CONCLUSÕES                             │
│    ┌───────────────────────────────────────────┐               │
│    │ 📜 TAREFAS RECENTES                       │               │
│    │                                             │               │
│    │ 1. "Implementar API REST"                │               │
│    │    [Trabalho] Concluído há 2 horas        │               │
│    │    +20 XP • +30 Pontos                     │               │
│    │                                             │               │
│    │ 2. "Estudar TypeScript"                  │               │
│    │    [Estudo] Concluído há 5 horas          │               │
│    │    +22 XP • +32 Pontos                     │               │
│    │                                             │               │
│    │ 3. "Ir à academia"                       │               │
│    │    [Saúde] Concluído ontem                 │               │
│    │    +18 XP • +25 Pontos                     │               │
│    │                                             │               │
│    │ (Máximo 10 tarefas recentes mostradas)    │               │
│    └───────────────────────────────────────────┘               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Fluxo Principal:                                                │
│ 1. Usuário navega para DashboardScreen                         │
│ 2. Sistema carrega: getAllTasks() + loadProfile()              │
│ 3. Calcula estatísticas:                                        │
│    ├─> completedTasks = tasks.filter(t => t.completed).length │
│    ├─> pendingTasks = tasks.length - completedTasks            │
│    ├─> completionRate = (completed / total) × 100              │
│    └─> xpProgress = (profile.xp / requiredXP) × 100            │
│ 4. Ordena tarefas recentes por completedAt DESC               │
│ 5. Renderiza todos os widgets com dados                        │
│ 6. Habilita scroll para visualizar tudo                        │
│ 7. Tela fica responsiva a atualizações (focus listener)        │
│                                                                 │
│ Fluxo Alternativo - Sem Dados:                                 │
│ • Se nenhuma tarefa criada: Exibe placeholder com CTA         │
│ • Se perfil não existe: Cria perfil padrão                    │
│                                                                 │
│ Interações Possíveis:                                          │
│ • Tap em badge → Exibe detalhes e data de desbloqueio        │
│ • Tap em tarefa recente → Opções de editar/deletar            │
│ • Swipe para voltar → Retorna para lista de tarefas            │
│ • Bottom tabs → Navega para outras telas                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Diagrama Geral de Notificações

```
                    ┌──────────────────────┐
                    │ Sistema de           │
                    │ Notificações (Expo)  │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
         ┌───────────────────┐   ┌────────────────────┐
         │ Notificações de   │   │ Notificações       │
         │ Tarefas           │   │ Motivacionais      │
         │ (Lembretes)       │   │ (Daily)            │
         └────────┬──────────┘   └────────┬───────────┘
                  │                       │
         ┌────────┴───────────┐   ┌───────┴────────┐
         │                    │   │                │
         ▼                    ▼   ▼                ▼
    ┌────────────┐    ┌────────────┐      ┌──────────┐
    │ 1h Antes   │    │24h Antes   │      │ 12h      │
    │ Due Date   │    │ Due Date   │      │ Diária   │
    └────────────┘    └────────────┘      └──────────┘
         │                 │                      │
         └─────────────────┴──────────────────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │ Usuário Recebe       │
                │ Notificação Push     │
                │ (Som, Badge, Banner) │
                └─────────────────────┘
```

---

## 8. Diagrama de Fluxo de Dados (Data Flow)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        FLUXO GERAL DE DADOS                             │
└─────────────────────────────────────────────────────────────────────────┘

  USER INPUT (UI)
        │
        ▼
  ┌─────────────────────────────────────┐
  │    PRESENTATION LAYER               │
  │    • TaskListScreen                 │
  │    • TaskFormScreen                 │
  │    • DashboardScreen                │
  │    • SettingsScreen                 │
  └──────────────┬──────────────────────┘
                 │
                 ▼
  ┌─────────────────────────────────────┐
  │    COMPONENT LAYER                  │
  │    • Button, Card, TaskItem         │
  │    • TagSelector, TimeSelector      │
  │    • XPBar, Badge, LevelUpModal     │
  └──────────────┬──────────────────────┘
                 │
                 ▼
  ┌─────────────────────────────────────┐
  │    BUSINESS LOGIC LAYER             │
  │    • TaskStorage.ts                 │
  │    • Gamification.ts                │
  │    • UserProfileStorage.ts          │
  │    • MotivationalNotifications.ts   │
  │    • ExportTasks.ts                 │
  └──────────────┬──────────────────────┘
                 │
                 ├─────────────────────────────────────┐
                 │                                     │
                 ▼                                     ▼
  ┌──────────────────────────┐         ┌─────────────────────────┐
  │  STATE MANAGEMENT        │         │  EXTERNAL SERVICES      │
  │  • SettingsContext       │         │  • expo-notifications   │
  │  • useUserProfile Hook   │         │  • expo-file-system     │
  └──────────────┬───────────┘         │  • expo-sharing         │
                 │                     │  • expo-document-picker │
                 └─────────────────────┴─────────────────────────┘
                                       │
                                       ▼
                       ┌──────────────────────────────┐
                       │  PERSISTENCE LAYER           │
                       │  AsyncStorage (Local Device) │
                       └──────────────────────────────┘
```

---

## 9. Resumo de Atores e Interações

### Atores do Sistema

| Ator                        | Descrição            | Interações Principais                                 |
| --------------------------- | -------------------- | ----------------------------------------------------- |
| **Usuário Final**           | Pessoa que usa o app | CRUD de tarefas, visualiza progresso, configura app   |
| **Sistema de Gamificação**  | Engine automático    | Calcula XP, gerencia streaks, desbloqueia badges      |
| **Sistema de Notificações** | Expo Notifications   | Agenda/dispara lembretes e notificações motivacionais |
| **Armazenamento Local**     | AsyncStorage         | Persiste todas as tarefas e perfil do usuário         |
| **Sistema de Perfil**       | User Profile Service | Rastreia XP, nível, coins, badges, streak             |

### Principais Fluxos de Interação

```
┌─────────────────────────────────────────────────────────────────┐
│ FLUXO 1: CRIAR TAREFA                                           │
│ Usuário → TaskFormScreen → TaskStorage → AsyncStorage          │
│         ↓                                                       │
│         └→ ScheduleReminders → expo-notifications              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ FLUXO 2: COMPLETAR TAREFA (COM RECOMPENSAS)                    │
│ Usuário → TaskListScreen → TaskStorage                         │
│                          ↓                                      │
│                    Gamification → UserProfileStorage           │
│                    (Calcula XP, Coins, Streaks, Badges)        │
│                          ↓                                      │
│                    LevelUpModal (se houver level-up)            │
│                          ↓                                      │
│                    DashboardScreen (refresh)                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ FLUXO 3: VISUALIZAR PROGRESSO                                  │
│ Usuário → DashboardScreen → TaskStorage + UserProfileStorage   │
│                          ↓                                      │
│                    Renderiza Stats, XP, Badges, Historico      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ FLUXO 4: CONFIGURAR APP                                        │
│ Usuário → SettingsScreen → SettingsContext → AsyncStorage      │
│         ↓                                                       │
│         └→ ExportTasks (JSON export via Sharing)               │
│         └→ ImportTasks (JSON import via DocumentPicker)        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ FLUXO 5: RECEBER NOTIFICAÇÕES                                  │
│ expo-notifications (scheduled) → User Device                   │
│         ↓                                                       │
│         └→ Task Reminders (1h, 2h, 4h, 8h, 24h antes)         │
│         └→ Motivational Daily (agendada 12h)                   │
│                                                                 │
│ Usuário toca notificação → App aberto + listeners disparados  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Matriz de Casos de Uso x Telas

| Caso de Uso          | TaskListScreen | TaskFormScreen | DashboardScreen | SettingsScreen |
| -------------------- | -------------- | -------------- | --------------- | -------------- |
| Criar Tarefa         | -              | ✅ Principal   | -               | -              |
| Editar Tarefa        | Link           | ✅ Principal   | -               | -              |
| Completar Tarefa     | ✅ Principal   | -              | -               | -              |
| Deletar Tarefa       | ✅ Principal   | -              | -               | -              |
| Visualizar Tarefas   | ✅ Principal   | -              | -               | -              |
| Ver Progresso        | -              | -              | ✅ Principal    | -              |
| Ver Badges           | -              | -              | ✅ Principal    | -              |
| Ativar Temas         | -              | -              | -               | ✅ Principal   |
| Filtrar Tarefas      | -              | -              | -               | ✅ Principal   |
| Exportar Dados       | -              | -              | -               | ✅ Principal   |
| Importar Dados       | -              | -              | -               | ✅ Principal   |
| Receber Notificações | ✅ Listener    | -              | -               | -              |

---

## Conclusão

Este projeto implementa um sistema robusto de gerenciamento de tarefas com gamificação, oferecendo aos usuários:

- **Controle Total**: Criação, edição e gerenciamento completo de tarefas
- **Motivação Constante**: Sistema de XP, níveis, streaks e badges para engajamento
- **Rastreamento Visual**: Dashboard com métricas e progresso em tempo real
- **Flexibilidade**: Configurações, export/import e temas personalizáveis
- **Notificações Inteligentes**: Lembretes automáticos e motivacionais agendados

Os diagramas acima mapeiam todas as interações principais entre usuários, sistema e componentes, fornecendo uma visão clara de como o aplicativo funciona end-to-end.
