CREATE TABLE IF NOT EXISTS `push_subs` (
   id INT(8) AUTO_INCREMENT,
   enabled BOOLEAN DEFAULT 1,
   user_agent TEXT,
   payload JSON NOT NULL,
   tag VARCHAR(8),
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

   PRIMARY KEY(id)
);
