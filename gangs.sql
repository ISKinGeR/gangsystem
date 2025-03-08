
CREATE TABLE IF NOT EXISTS `laptop_gangs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gang_id` text NOT NULL,
  `gang_label` text NOT NULL,
  `gang_leader` text DEFAULT NULL,
  `gang_members` longtext NOT NULL,
  `gang_metadata` longtext NOT NULL,
  `discovered_sprays` longtext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `gang_id` (`gang_id`(768)),
  KEY `gang_members` (`gang_members`(768))
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `laptop_gangs` (`id`, `gang_id`, `gang_label`, `gang_leader`, `gang_members`, `gang_metadata`, `discovered_sprays`) VALUES
	(1, 'dev', 'Dev Gang', NULL, '[]', '[]', '[]'),
	(2, 'los_aztecas', 'Los Aztecas', NULL, '[]', '[]', '[]'),
	(3, 'flying_dragons', 'Flying Dragons', NULL, '[]', '[]', '[]'),
	(4, 'kings', 'Kings', NULL, '[]', '[]', '[]'),
	(5, 'dark_wolves', 'Dark Wolves', NULL, '[]', '[]', '[]'),
	(6, 'death_sinners', 'Death Sinners', NULL, '[]', '[]', '[]'),
	(7, 'white_widow', 'White Widow', NULL, '[]', '[]', '[]'),
	(8, 'ballas', 'Ballas', NULL, '[]', '[]', '[]'),
	(9, 'wutang', 'Wu-Tang', NULL, '[]', '[]', '[]'),
	(10, 'vatoslocos', 'Vatos Locos', NULL, '[]', '[]', '[]'),
	(11, 'bumpergang', 'BumperGang', NULL, '[]', '[]', '[]'),
	(12, 'sopranos', 'Sopranos', NULL, '[]', '[]', '[]'),
	(13, 's2n', 'Second2None', NULL, '[]', '[]', '[]'),
	(14, 'fts', 'Fock The System', NULL, '[]', '[]', '[]'),
	(15, 'tffc', 'Thieves & Crooks', NULL, '[]', '[]', '[]'),
	(16, 'joker_cartel', 'Joker Cartel', NULL, '[]', '[]', '[]');

CREATE TABLE IF NOT EXISTS `laptop_gangs_chat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gang_id` text NOT NULL,
  `sender` text NOT NULL,
  `message` longtext NOT NULL,
  `attachments` longtext NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT curtime(),
  PRIMARY KEY (`id`) USING BTREE,
  KEY `gang_id` (`gang_id`(768)) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `laptop_sprays` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gang_id` text NOT NULL,
  `type` text NOT NULL,
  `position` longtext NOT NULL,
  `rotation` longtext NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `gang_id` (`gang_id`(768)) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;