# Machine Problem #1: Pokémon Battle Game Database Design

**Database Systems 2 – 3rd Year**  
**1st Semester, AY 2026-2027**  
**College of Computer Studies – UPHSL**

---

## Title

Database Schema Design for a Pokémon Battle Game System Using MySQL Workbench

---

## Case Analysis

A local game development studio is building a Pokémon Battle Game System that requires a structured and reliable database to manage all game activities. The system allows players to log in, select a trainer, train Pokémon in assigned laboratories, and enter battles only when their Pokémon are approved as battle-ready by the trainer. The system includes battlefields for combat and battle bags containing usable items. All training and battle activities are permanently recorded in the database for tracking and auditing purposes.

---

## 1. List of Entities and Their Attributes

### Entity 1: Players
| Attribute | Data Type | Constraint |
|-----------|-----------|------------|
| player_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| username | VARCHAR(50) | NOT NULL, UNIQUE |
| password_hash | VARCHAR(255) | NOT NULL |
| email | VARCHAR(100) | NOT NULL, UNIQUE |
| date_registered | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| last_login | DATETIME | NULL |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE |

### Entity 2: Trainers
| Attribute | Data Type | Constraint |
|-----------|-----------|------------|
| trainer_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| player_id | INT | FOREIGN KEY → players(player_id), NOT NULL |
| trainer_name | VARCHAR(100) | NOT NULL |
| specialty | VARCHAR(50) | NULL |
| experience_level | INT | NOT NULL, DEFAULT 1 |
| date_created | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

### Entity 3: Laboratories
| Attribute | Data Type | Constraint |
|-----------|-----------|------------|
| laboratory_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| laboratory_name | VARCHAR(100) | NOT NULL |
| location | VARCHAR(150) | NOT NULL |
| specialization | VARCHAR(100) | NULL |
| capacity | INT | NOT NULL, DEFAULT 10 |

### Entity 4: Pokémon
| Attribute | Data Type | Constraint |
|-----------|-----------|------------|
| pokemon_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| pokemon_name | VARCHAR(100) | NOT NULL |
| pokemon_type | VARCHAR(50) | NOT NULL |
| level | INT | NOT NULL, DEFAULT 1 |
| health_points | INT | NOT NULL, DEFAULT 100 |
| attack_power | INT | NOT NULL, DEFAULT 10 |
| defense_power | INT | NOT NULL, DEFAULT 10 |
| speed | INT | NOT NULL, DEFAULT 10 |
| evolution_stage | VARCHAR(50) | NOT NULL, DEFAULT 'Base' |
| readiness_status | ENUM('under_training', 'battle_ready') | NOT NULL, DEFAULT 'under_training' |
| trainer_id | INT | FOREIGN KEY → trainers(trainer_id), NOT NULL |
| laboratory_id | INT | FOREIGN KEY → laboratories(laboratory_id), NULL |
| date_acquired | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

### Entity 5: Battlefields
| Attribute | Data Type | Constraint |
|-----------|-----------|------------|
| battlefield_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| battlefield_name | VARCHAR(100) | NOT NULL |
| terrain_type | VARCHAR(50) | NOT NULL |
| difficulty_level | INT | NOT NULL, DEFAULT 1 |
| max_players | INT | NOT NULL, DEFAULT 2 |

### Entity 6: Items
| Attribute | Data Type | Constraint |
|-----------|-----------|------------|
| item_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| item_name | VARCHAR(100) | NOT NULL |
| item_type | ENUM('food', 'poison', 'power_up', 'potion') | NOT NULL |
| effect_description | VARCHAR(255) | NULL |
| effect_value | INT | NOT NULL, DEFAULT 0 |

### Entity 7: Battle Bags
| Attribute | Data Type | Constraint |
|-----------|-----------|------------|
| battle_bag_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| player_id | INT | FOREIGN KEY → players(player_id), NOT NULL |
| item_id | INT | FOREIGN KEY → items(item_id), NOT NULL |
| quantity | INT | NOT NULL, DEFAULT 1 |

### Entity 8: Training Sessions
| Attribute | Data Type | Constraint |
|-----------|-----------|------------|
| training_session_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| pokemon_id | INT | FOREIGN KEY → pokemon(pokemon_id), NOT NULL |
| trainer_id | INT | FOREIGN KEY → trainers(trainer_id), NOT NULL |
| laboratory_id | INT | FOREIGN KEY → laboratories(laboratory_id), NOT NULL |
| training_start | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| training_end | DATETIME | NULL |
| readiness_status | ENUM('under_training', 'battle_ready') | NOT NULL, DEFAULT 'under_training' |
| notes | VARCHAR(255) | NULL |

### Entity 9: Battle Sessions
| Attribute | Data Type | Constraint |
|-----------|-----------|------------|
| battle_session_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| battlefield_id | INT | FOREIGN KEY → battlefields(battlefield_id), NOT NULL |
| player1_id | INT | FOREIGN KEY → players(player_id), NOT NULL |
| player2_id | INT | FOREIGN KEY → players(player_id), NOT NULL |
| pokemon1_id | INT | FOREIGN KEY → pokemon(pokemon_id), NOT NULL |
| pokemon2_id | INT | FOREIGN KEY → pokemon(pokemon_id), NOT NULL |
| winner_player_id | INT | FOREIGN KEY → players(player_id), NULL |
| battle_date | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| battle_duration_minutes | INT | NULL |

### Entity 10: Battle Item Usage
| Attribute | Data Type | Constraint |
|-----------|-----------|------------|
| usage_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| battle_session_id | INT | FOREIGN KEY → battle_sessions(battle_session_id), NOT NULL |
| player_id | INT | FOREIGN KEY → players(player_id), NOT NULL |
| item_id | INT | FOREIGN KEY → items(item_id), NOT NULL |
| pokemon_id | INT | FOREIGN KEY → pokemon(pokemon_id), NOT NULL |
| quantity_used | INT | NOT NULL, DEFAULT 1 |
| used_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

---

## 2. Relationships Among Entities

| Relationship | Type | Description |
|-------------|------|-------------|
| Players → Trainers | One-to-Many | A player can have multiple trainer profiles |
| Trainers → Pokémon | One-to-Many | A trainer can train multiple Pokémon |
| Laboratories → Pokémon | One-to-Many | A laboratory can house multiple Pokémon |
| Players → Battle Bags | One-to-Many | A player can have multiple items in their battle bag |
| Items → Battle Bags | One-to-Many | An item can appear in multiple players' battle bags |
| Trainers → Training Sessions | One-to-Many | A trainer can supervise multiple training sessions |
| Pokémon → Training Sessions | One-to-Many | A Pokémon can have multiple training records |
| Laboratories → Training Sessions | One-to-Many | A laboratory can host multiple training sessions |
| Players → Battle Sessions | One-to-Many | A player can participate in multiple battles |
| Pokémon → Battle Sessions | One-to-Many | A Pokémon can be used in multiple battles |
| Battlefields → Battle Sessions | One-to-Many | A battlefield can host multiple battles |
| Battle Sessions → Battle Item Usage | One-to-Many | A battle can have multiple item usages |
| Items → Battle Item Usage | One-to-Many | An item can be used in multiple battle events |

---

## 3. Primary Keys, Foreign Keys, and Constraints

### Primary Keys
| Table | Primary Key |
|-------|-------------|
| players | player_id |
| trainers | trainer_id |
| laboratories | laboratory_id |
| pokemon | pokemon_id |
| battlefields | battlefield_id |
| items | item_id |
| battle_bags | battle_bag_id |
| training_sessions | training_session_id |
| battle_sessions | battle_session_id |
| battle_item_usage | usage_id |

### Foreign Keys
| Table | Foreign Key | References |
|-------|-------------|------------|
| trainers | player_id | players(player_id) |
| pokemon | trainer_id | trainers(trainer_id) |
| pokemon | laboratory_id | laboratories(laboratory_id) |
| battle_bags | player_id | players(player_id) |
| battle_bags | item_id | items(item_id) |
| training_sessions | pokemon_id | pokemon(pokemon_id) |
| training_sessions | trainer_id | trainers(trainer_id) |
| training_sessions | laboratory_id | laboratories(laboratory_id) |
| battle_sessions | battlefield_id | battlefields(battlefield_id) |
| battle_sessions | player1_id | players(player_id) |
| battle_sessions | player2_id | players(player_id) |
| battle_sessions | pokemon1_id | pokemon(pokemon_id) |
| battle_sessions | pokemon2_id | pokemon(pokemon_id) |
| battle_sessions | winner_player_id | players(player_id) |
| battle_item_usage | battle_session_id | battle_sessions(battle_session_id) |
| battle_item_usage | player_id | players(player_id) |
| battle_item_usage | item_id | items(item_id) |
| battle_item_usage | pokemon_id | pokemon(pokemon_id) |

### Business Constraints
- A Pokémon cannot be marked as `battle_ready` unless it has completed training (enforced via application logic and training_sessions records).
- A battle session cannot be created unless the participating Pokémon have `readiness_status = 'battle_ready'`.
- A player must have a trainer assigned before interacting with Pokémon.
- All battle items used must belong to the player's battle bag.
- Training and battle logs are stored permanently (no DELETE operations on session tables in normal use).

---

## 4. Normalization

The database schema is normalized to **Third Normal Form (3NF)**:

### First Normal Form (1NF)
- All tables have a primary key.
- All attributes contain atomic (indivisible) values.
- No repeating groups exist in any table.

### Second Normal Form (2NF)
- All non-key attributes are fully functionally dependent on the entire primary key.
- No partial dependencies exist (all tables use single-column surrogate primary keys).

### Third Normal Form (3NF)
- No transitive dependencies exist.
- All non-key attributes depend directly on the primary key only.
- Example: Player email depends on player_id, not on username. Trainer specialty depends on trainer_id, not on player_id.

---

## 5. Functional Requirements

### FR-01: Player Authentication
- The system shall allow players to register with a unique username and email.
- The system shall allow players to log in using valid credentials.
- The system shall record the date and time of each login.

### FR-02: Trainer Selection
- The system shall allow a player to create and select a trainer profile.
- The system shall store the trainer's name, specialty, and experience level.
- The system shall associate each trainer with exactly one player.

### FR-03: Pokémon Management
- The system shall allow trainers to add Pokémon to their roster.
- The system shall store each Pokémon's stats (type, level, HP, attack, defense, speed).
- The system shall track the evolution stage of each Pokémon.

### FR-04: Laboratory Assignment
- The system shall allow trainers to assign Pokémon to a laboratory.
- The system shall track which laboratory each Pokémon is assigned to.
- Pokémon may evolve only in their assigned laboratory.

### FR-05: Training Management
- The system shall record all training sessions (Pokémon, trainer, laboratory, start/end time).
- The system shall track the readiness status of each Pokémon.
- The trainer shall be able to update the readiness status from 'under_training' to 'battle_ready'.

### FR-06: Battle Preparation
- The system shall allow a player to select a battlefield before battle.
- The system shall enforce that only Pokémon with status 'battle_ready' can enter battle.
- A battle cannot begin unless at least one Pokémon is approved for combat.

### FR-07: Battle Bag Management
- The system shall allow players to add items to their battle bag.
- The system shall track item types (food, poison, power-up, potion) and quantities.
- Players may use items from their battle bag during battles.

### FR-08: Battle Execution and Logging
- The system shall record all battle sessions (players, Pokémon, battlefield, winner).
- The system shall log all items used during each battle.
- The system shall record the battle duration and outcome.

### FR-09: Session Logging
- The system shall permanently store all training session records.
- The system shall permanently store all battle session records.
- The system shall maintain a complete history of all game activities.

---

## 6. Non-Functional Requirements

### NFR-01: Performance
- The database shall support concurrent access by multiple players without degradation.
- Query response time for login and battle lookup shall be under 2 seconds.
- Indexes are implemented on frequently queried columns for optimized retrieval.

### NFR-02: Security
- Player passwords shall be stored as hashed values (SHA-256), never in plain text.
- Player email addresses shall be unique and validated.
- The system shall prevent unauthorized access through authentication checks.

### NFR-03: Data Integrity
- Referential integrity shall be enforced through foreign key constraints.
- ENUM data types shall restrict values to valid options only.
- CASCADE rules shall maintain consistency when parent records are updated or deleted.

### NFR-04: Scalability
- The schema shall support an unlimited number of players, trainers, and Pokémon.
- The database design shall allow for additional item types and battlefield types in future updates.
- Laboratory capacity is tracked to support future expansion logic.

### NFR-05: Availability
- Training and battle logs shall be stored permanently and never deleted during normal operations.
- The database shall use InnoDB engine for transaction support and crash recovery.
- The system shall support data backup and restoration procedures.

### NFR-06: Maintainability
- All tables follow consistent naming conventions (snake_case).
- Foreign key constraints are named descriptively for easy identification.
- The schema is normalized to 3NF to reduce redundancy and simplify maintenance.

### NFR-07: Usability
- The database schema uses clear and descriptive column names.
- ENUM types provide self-documenting valid value options.
- Default values minimize required input during data entry.

---

## 7. ER Diagram – Relationship Description

```
┌──────────────┐       1:N       ┌──────────────┐       1:N       ┌──────────────┐
│   PLAYERS    │────────────────▶│   TRAINERS   │────────────────▶│   POKÉMON    │
│              │                 │              │                 │              │
│ player_id PK │                 │ trainer_id PK│                 │ pokemon_id PK│
│ username     │                 │ player_id FK │                 │ trainer_id FK│
│ password_hash│                 │ trainer_name │                 │ laboratory_id│
│ email        │                 │ specialty    │                 │ readiness_   │
│ date_reg     │                 │ exp_level    │                 │   status     │
│ last_login   │                 │              │                 │ pokemon_type │
│ is_active    │                 └──────────────┘                 │ level        │
└──────────────┘                        │                         └──────────────┘
       │                                │                                │
       │ 1:N                            │ 1:N                            │ N:1
       ▼                                ▼                                ▼
┌──────────────┐                 ┌──────────────────┐            ┌──────────────┐
│ BATTLE_BAGS  │                 │TRAINING_SESSIONS │            │ LABORATORIES │
│              │                 │                  │            │              │
│ bag_id PK    │                 │ session_id PK    │            │ lab_id PK    │
│ player_id FK │                 │ pokemon_id FK    │            │ lab_name     │
│ item_id FK   │                 │ trainer_id FK    │            │ location     │
│ quantity     │                 │ laboratory_id FK │            │ specialization│
└──────────────┘                 │ training_start   │            │ capacity     │
       │                         │ training_end     │            └──────────────┘
       │ N:1                     │ readiness_status │
       ▼                         └──────────────────┘
┌──────────────┐
│    ITEMS     │
│              │                 ┌──────────────────┐            ┌──────────────┐
│ item_id PK   │                 │ BATTLE_SESSIONS  │            │ BATTLEFIELDS │
│ item_name    │                 │                  │            │              │
│ item_type    │                 │ session_id PK    │◀───────────│ field_id PK  │
│ effect_desc  │                 │ battlefield_id FK│   1:N      │ field_name   │
│ effect_value │                 │ player1_id FK    │            │ terrain_type │
└──────────────┘                 │ player2_id FK    │            │ difficulty   │
       │                         │ pokemon1_id FK   │            │ max_players  │
       │ 1:N                     │ pokemon2_id FK   │            └──────────────┘
       ▼                         │ winner_id FK     │
┌──────────────────┐             │ battle_date      │
│BATTLE_ITEM_USAGE │             │ duration_min     │
│                  │             └──────────────────┘
│ usage_id PK      │                     │
│ battle_session FK│◀────────────────────┘  1:N
│ player_id FK     │
│ item_id FK       │
│ pokemon_id FK    │
│ quantity_used    │
│ used_at          │
└──────────────────┘
```

### Relationship Summary Diagram

```
PLAYERS (1) ──────── (N) TRAINERS
PLAYERS (1) ──────── (N) BATTLE_BAGS
TRAINERS (1) ─────── (N) POKÉMON
TRAINERS (1) ─────── (N) TRAINING_SESSIONS
LABORATORIES (1) ─── (N) POKÉMON
LABORATORIES (1) ─── (N) TRAINING_SESSIONS
POKÉMON (1) ──────── (N) TRAINING_SESSIONS
ITEMS (1) ────────── (N) BATTLE_BAGS
ITEMS (1) ────────── (N) BATTLE_ITEM_USAGE
BATTLEFIELDS (1) ─── (N) BATTLE_SESSIONS
PLAYERS (1) ──────── (N) BATTLE_SESSIONS (as player1 or player2)
POKÉMON (1) ──────── (N) BATTLE_SESSIONS (as pokemon1 or pokemon2)
BATTLE_SESSIONS (1)─ (N) BATTLE_ITEM_USAGE
```

---

## 8. Reflection

Designing the database schema for the Pokémon Battle Game System was a valuable learning experience that reinforced key database concepts. Through this activity, I gained a deeper understanding of:

**Entity Identification** – Analyzing the case scenario required careful reading to identify all the distinct objects (players, trainers, Pokémon, laboratories, battlefields, items) and their interactions. This taught me that real-world systems often have more entities than initially apparent, especially when logging and tracking are required.

**Relationship Mapping** – Establishing the correct cardinality (one-to-many, many-to-many) between entities was crucial. For example, the relationship between players and battle sessions required multiple foreign keys since two players participate in each battle. This showed me that relationship complexity must be handled at the schema level.

**Normalization** – Applying 1NF, 2NF, and 3NF eliminated data redundancy. Separating items into their own table and linking them through battle_bags and battle_item_usage prevented duplicate data and ensured consistency. I learned that proper normalization makes the database easier to maintain and less prone to anomalies.

**Constraint Design** – Implementing foreign keys, ENUM types, NOT NULL constraints, and UNIQUE constraints at the database level ensures data integrity regardless of application behavior. The business rule that only battle-ready Pokémon can enter combat demonstrates how constraints protect the system from invalid states.

**Schema Design Best Practices** – Using consistent naming conventions (snake_case), descriptive constraint names, appropriate data types, and indexes for performance optimization are practices that make the database professional and maintainable.

This machine problem demonstrated that a well-designed database is the foundation of any reliable system. Without proper schema design, normalization, and relationship mapping, the application would suffer from data inconsistencies, redundancy, and integrity violations that become increasingly difficult to fix as the system grows.

---

*Submitted for Machine Problem #1 – Database Systems 2*  
*College of Computer Studies – UPHSL*
