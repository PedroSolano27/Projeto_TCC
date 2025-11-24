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

## 4. Diagrama de Caso de Uso - Configurações e Personalização

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
