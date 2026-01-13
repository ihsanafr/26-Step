-- Update existing tasks to new status values
UPDATE `tasks` SET `status` = 'todo' WHERE `status` = 'pending';
UPDATE `tasks` SET `status` = 'on_progress' WHERE `status` = 'in_progress';
UPDATE `tasks` SET `status` = 'finish' WHERE `status` = 'completed';

-- Modify enum to include new status values
ALTER TABLE `tasks` MODIFY COLUMN `status` ENUM('todo', 'on_progress', 'on_hold', 'finish', 'pending', 'in_progress', 'completed') DEFAULT 'todo';

