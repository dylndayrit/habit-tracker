-- Create the database
CREATE DATABASE habit_tracker
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Switch to the database
USE habit_tracker;

GRANT ALL PRIVILEGES ON habit_tracker.* TO 'appuser'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE habits (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  frequency ENUM('daily', 'weekly', 'monthly') DEFAULT 'daily',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE habit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  habit_id INT NOT NULL,
  date_logged DATE NOT NULL,
  status ENUM('done', 'skipped') DEFAULT 'done',
  FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
);

-- Insert one user
INSERT INTO users (username)
VALUES ('dylan');

-- Insert a few habits for that user
INSERT INTO habits (user_id, title, description, frequency)
VALUES
(1, 'Skincare', 'wash face, moisturize night and morning', 'daily'),
(1, 'Tidy desk', 'Clear and organize desk before leaving, and before bed', 'daily'),
(1, 'Journal', 'Write a short reflection before bed', 'daily');

-- Insert logs (pretend the user tracked some days)
INSERT INTO habit_logs (habit_id, date_logged, status)
VALUES
(1, '2025-11-04', 'done'),
(1, '2025-11-05', 'done'),
(2, '2025-11-04', 'skipped'),
(2, '2025-11-05', 'done'),
(3, '2025-11-05', 'done');

USE habit_tracker;

-- find the constraint name
SELECT CONSTRAINT_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'habit_tracker'
  AND TABLE_NAME = 'habit_logs'
  AND COLUMN_NAME = 'habit_id';

-- drop the existing FK (replace fk_logs_habit if yours is different)
ALTER TABLE habit_logs DROP FOREIGN KEY habit_id;

-- re-add with CASCADE
ALTER TABLE habit_logs
  ADD CONSTRAINT fk_logs_habit
  FOREIGN KEY (habit_id) REFERENCES habits(id)
  ON DELETE CASCADE;

