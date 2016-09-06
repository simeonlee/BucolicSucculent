
CREATE TABLE `user` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `name` MEDIUMTEXT NOT NULL DEFAULT 'NULL',
  `password` MEDIUMTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'game'
-- 
-- ---

DROP TABLE IF EXISTS `game`;
    
CREATE TABLE `game` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `id_creator` INTEGER NULL DEFAULT NULL COMMENT 'creator id',
  `path` MEDIUMTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'location'
-- 
-- ---

DROP TABLE IF EXISTS `location`;
    
CREATE TABLE `location` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `lat` INTEGER NULL,
  `lng` INTEGER NULL DEFAULT NULL,
  `id_game` INTEGER NULL DEFAULT NULL,
  `sequence` INTEGER NOT NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'game_user'
-- 
-- ---

DROP TABLE IF EXISTS `game_user`;
    
CREATE TABLE `game_user` (
  `id_user` INTEGER NULL DEFAULT NULL,
  `id_game` INTEGER NULL DEFAULT NULL,
  PRIMARY KEY ()
);

-- ---
-- Table 'loc_user'
-- 
-- ---

DROP TABLE IF EXISTS `loc_user`;
    
CREATE TABLE `loc_user` (
  `id_user` INTEGER NULL DEFAULT NULL,
  `id_location` INTEGER NULL DEFAULT NULL,
  `state` MEDIUMTEXT NULL DEFAULT 'false',
  PRIMARY KEY ()
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE `game` ADD FOREIGN KEY (id_creator) REFERENCES `user` (`id`);
ALTER TABLE `location` ADD FOREIGN KEY (id_game) REFERENCES `game` (`id`);
ALTER TABLE `game_user` ADD FOREIGN KEY (id_user) REFERENCES `user` (`id`);
ALTER TABLE `game_user` ADD FOREIGN KEY (id_game) REFERENCES `game` (`id`);
ALTER TABLE `loc_user` ADD FOREIGN KEY (id_user) REFERENCES `user` (`id`);
ALTER TABLE `loc_user` ADD FOREIGN KEY (id_location) REFERENCES `location` (`id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `user` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `game` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `location` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `game_user` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `loc_user` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `user` (`id`,`name`,`password`) VALUES
-- ('','','');
-- INSERT INTO `game` (`id`,`id_creator`,`path`) VALUES
-- ('','','');
-- INSERT INTO `location` (`id`,`lat`,`lng`,`id_game`,`sequence`) VALUES
-- ('','','','','');
-- INSERT INTO `game_user` (`id_user`,`id_game`) VALUES
-- ('','');
-- INSERT INTO `loc_user` (`id_user`,`id_location`,`state`) VALUES
-- ('','','');