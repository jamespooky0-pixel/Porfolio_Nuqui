-- ============================================================
-- Machine Problem #1: Pokémon Battle Game Database Schema
-- Database Systems 2 - 3rd Year
-- 1st Semester, AY 2026-2027
-- ============================================================
-- Title: Database Schema Design for a Pokémon Battle Game System
-- Created using MySQL Workbench
-- ============================================================

DROP DATABASE IF EXISTS pokemon_battle_game;
CREATE DATABASE pokemon_battle_game;
USE pokemon_battle_game;

-- ============================================================
-- TABLE 1: players
-- Stores player account information for login
-- ============================================================
CREATE TABLE players (
    player_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    date_registered DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 2: trainers
-- Stores trainer profiles that players can select
-- ============================================================
CREATE TABLE trainers (
    trainer_id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    trainer_name VARCHAR(100) NOT NULL,
    specialty VARCHAR(50) NULL,
    experience_level INT NOT NULL DEFAULT 1,
    date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trainers_player
        FOREIGN KEY (player_id) REFERENCES players(player_id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 3: laboratories
-- Stores laboratory locations for Pokémon growth and evolution
-- ============================================================
CREATE TABLE laboratories (
    laboratory_id INT AUTO_INCREMENT PRIMARY KEY,
    laboratory_name VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    specialization VARCHAR(100) NULL,
    capacity INT NOT NULL DEFAULT 10
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 4: pokemon
-- Stores all Pokémon data including training and battle status
-- ============================================================
CREATE TABLE pokemon (
    pokemon_id INT AUTO_INCREMENT PRIMARY KEY,
    pokemon_name VARCHAR(100) NOT NULL,
    pokemon_type VARCHAR(50) NOT NULL,
    level INT NOT NULL DEFAULT 1,
    health_points INT NOT NULL DEFAULT 100,
    attack_power INT NOT NULL DEFAULT 10,
    defense_power INT NOT NULL DEFAULT 10,
    speed INT NOT NULL DEFAULT 10,
    evolution_stage VARCHAR(50) NOT NULL DEFAULT 'Base',
    readiness_status ENUM('under_training', 'battle_ready') NOT NULL DEFAULT 'under_training',
    trainer_id INT NOT NULL,
    laboratory_id INT NULL,
    date_acquired DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pokemon_trainer
        FOREIGN KEY (trainer_id) REFERENCES trainers(trainer_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_pokemon_laboratory
        FOREIGN KEY (laboratory_id) REFERENCES laboratories(laboratory_id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 5: battlefields
-- Stores battlefield locations where battles take place
-- ============================================================
CREATE TABLE battlefields (
    battlefield_id INT AUTO_INCREMENT PRIMARY KEY,
    battlefield_name VARCHAR(100) NOT NULL,
    terrain_type VARCHAR(50) NOT NULL,
    difficulty_level INT NOT NULL DEFAULT 1,
    max_players INT NOT NULL DEFAULT 2
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 6: items
-- Stores all available items (food, poison, power-ups, potions)
-- ============================================================
CREATE TABLE items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    item_type ENUM('food', 'poison', 'power_up', 'potion') NOT NULL,
    effect_description VARCHAR(255) NULL,
    effect_value INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 7: battle_bags
-- Stores the player's battle bag and its items
-- ============================================================
CREATE TABLE battle_bags (
    battle_bag_id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_battlebag_player
        FOREIGN KEY (player_id) REFERENCES players(player_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_battlebag_item
        FOREIGN KEY (item_id) REFERENCES items(item_id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 8: training_sessions
-- Logs all training activities (Pokémon, trainer, lab, status)
-- ============================================================
CREATE TABLE training_sessions (
    training_session_id INT AUTO_INCREMENT PRIMARY KEY,
    pokemon_id INT NOT NULL,
    trainer_id INT NOT NULL,
    laboratory_id INT NOT NULL,
    training_start DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    training_end DATETIME NULL,
    readiness_status ENUM('under_training', 'battle_ready') NOT NULL DEFAULT 'under_training',
    notes VARCHAR(255) NULL,
    CONSTRAINT fk_training_pokemon
        FOREIGN KEY (pokemon_id) REFERENCES pokemon(pokemon_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_training_trainer
        FOREIGN KEY (trainer_id) REFERENCES trainers(trainer_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_training_laboratory
        FOREIGN KEY (laboratory_id) REFERENCES laboratories(laboratory_id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 9: battle_sessions
-- Logs all battle activities (players, battlefield, winner)
-- ============================================================
CREATE TABLE battle_sessions (
    battle_session_id INT AUTO_INCREMENT PRIMARY KEY,
    battlefield_id INT NOT NULL,
    player1_id INT NOT NULL,
    player2_id INT NOT NULL,
    pokemon1_id INT NOT NULL,
    pokemon2_id INT NOT NULL,
    winner_player_id INT NULL,
    battle_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    battle_duration_minutes INT NULL,
    CONSTRAINT fk_battle_battlefield
        FOREIGN KEY (battlefield_id) REFERENCES battlefields(battlefield_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_battle_player1
        FOREIGN KEY (player1_id) REFERENCES players(player_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_battle_player2
        FOREIGN KEY (player2_id) REFERENCES players(player_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_battle_pokemon1
        FOREIGN KEY (pokemon1_id) REFERENCES pokemon(pokemon_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_battle_pokemon2
        FOREIGN KEY (pokemon2_id) REFERENCES pokemon(pokemon_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_battle_winner
        FOREIGN KEY (winner_player_id) REFERENCES players(player_id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 10: battle_item_usage
-- Tracks items used during a battle session
-- ============================================================
CREATE TABLE battle_item_usage (
    usage_id INT AUTO_INCREMENT PRIMARY KEY,
    battle_session_id INT NOT NULL,
    player_id INT NOT NULL,
    item_id INT NOT NULL,
    pokemon_id INT NOT NULL,
    quantity_used INT NOT NULL DEFAULT 1,
    used_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usage_battle
        FOREIGN KEY (battle_session_id) REFERENCES battle_sessions(battle_session_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_usage_player
        FOREIGN KEY (player_id) REFERENCES players(player_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_usage_item
        FOREIGN KEY (item_id) REFERENCES items(item_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_usage_pokemon
        FOREIGN KEY (pokemon_id) REFERENCES pokemon(pokemon_id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- INDEXES for performance optimization
-- ============================================================
CREATE INDEX idx_trainers_player ON trainers(player_id);
CREATE INDEX idx_pokemon_trainer ON pokemon(trainer_id);
CREATE INDEX idx_pokemon_laboratory ON pokemon(laboratory_id);
CREATE INDEX idx_pokemon_readiness ON pokemon(readiness_status);
CREATE INDEX idx_training_pokemon ON training_sessions(pokemon_id);
CREATE INDEX idx_training_trainer ON training_sessions(trainer_id);
CREATE INDEX idx_battle_battlefield ON battle_sessions(battlefield_id);
CREATE INDEX idx_battle_player1 ON battle_sessions(player1_id);
CREATE INDEX idx_battle_player2 ON battle_sessions(player2_id);
CREATE INDEX idx_battlebag_player ON battle_bags(player_id);

-- ============================================================
-- SAMPLE DATA INSERTION
-- ============================================================

-- Insert sample players
INSERT INTO players (username, password_hash, email) VALUES
('ash_ketchum', SHA2('password123', 256), 'ash@pokemon.com'),
('misty_water', SHA2('password456', 256), 'misty@pokemon.com'),
('brock_rock', SHA2('password789', 256), 'brock@pokemon.com');

-- Insert sample laboratories
INSERT INTO laboratories (laboratory_name, location, specialization, capacity) VALUES
('Oak Laboratory', 'Pallet Town', 'General Research', 20),
('Elm Laboratory', 'New Bark Town', 'Evolution Studies', 15),
('Birch Laboratory', 'Littleroot Town', 'Field Research', 12);

-- Insert sample trainers
INSERT INTO trainers (player_id, trainer_name, specialty, experience_level) VALUES
(1, 'Ash Trainer', 'Electric', 5),
(2, 'Misty Trainer', 'Water', 4),
(3, 'Brock Trainer', 'Rock', 6);

-- Insert sample Pokémon
INSERT INTO pokemon (pokemon_name, pokemon_type, level, health_points, attack_power, defense_power, speed, evolution_stage, readiness_status, trainer_id, laboratory_id) VALUES
('Pikachu', 'Electric', 25, 150, 55, 40, 90, 'Base', 'battle_ready', 1, 1),
('Charmander', 'Fire', 10, 100, 40, 30, 60, 'Base', 'under_training', 1, 1),
('Starmie', 'Water', 30, 180, 60, 50, 85, 'Evolved', 'battle_ready', 2, 2),
('Geodude', 'Rock', 15, 130, 45, 70, 30, 'Base', 'under_training', 3, 3),
('Onix', 'Rock', 28, 200, 50, 90, 40, 'Base', 'battle_ready', 3, 3);

-- Insert sample battlefields
INSERT INTO battlefields (battlefield_name, terrain_type, difficulty_level, max_players) VALUES
('Indigo Plateau', 'Mixed', 5, 2),
('Cerulean Gym', 'Water', 3, 2),
('Pewter Gym', 'Rock', 2, 2);

-- Insert sample items
INSERT INTO items (item_name, item_type, effect_description, effect_value) VALUES
('Super Potion', 'potion', 'Restores 50 HP', 50),
('Rare Candy', 'food', 'Increases level by 1', 1),
('X Attack', 'power_up', 'Boosts attack power temporarily', 20),
('Toxic Orb', 'poison', 'Poisons the opposing Pokémon', 10),
('Max Revive', 'potion', 'Fully restores a fainted Pokémon', 100);

-- Insert sample battle bag items
INSERT INTO battle_bags (player_id, item_id, quantity) VALUES
(1, 1, 5),
(1, 3, 2),
(2, 1, 3),
(2, 2, 1),
(3, 4, 4);

-- Insert sample training sessions
INSERT INTO training_sessions (pokemon_id, trainer_id, laboratory_id, training_start, training_end, readiness_status, notes) VALUES
(1, 1, 1, '2026-07-01 08:00:00', '2026-07-15 17:00:00', 'battle_ready', 'Pikachu completed advanced training'),
(2, 1, 1, '2026-07-20 09:00:00', NULL, 'under_training', 'Charmander still learning fire moves'),
(3, 2, 2, '2026-06-15 10:00:00', '2026-07-01 16:00:00', 'battle_ready', 'Starmie evolved and battle ready'),
(4, 3, 3, '2026-07-25 08:00:00', NULL, 'under_training', 'Geodude building defense stats'),
(5, 3, 3, '2026-06-01 07:00:00', '2026-06-20 18:00:00', 'battle_ready', 'Onix approved for combat');

-- Insert sample battle sessions
INSERT INTO battle_sessions (battlefield_id, player1_id, player2_id, pokemon1_id, pokemon2_id, winner_player_id, battle_date, battle_duration_minutes) VALUES
(1, 1, 2, 1, 3, 1, '2026-08-01 14:00:00', 25),
(3, 1, 3, 1, 5, 3, '2026-08-02 10:00:00', 30);

-- Insert sample battle item usage
INSERT INTO battle_item_usage (battle_session_id, player_id, item_id, pokemon_id, quantity_used) VALUES
(1, 1, 1, 1, 1),
(1, 2, 1, 3, 2),
(2, 1, 3, 1, 1),
(2, 3, 4, 5, 1);

-- ============================================================
-- END OF SCHEMA
-- ============================================================
