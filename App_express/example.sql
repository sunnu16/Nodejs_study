--
-- Table structure for table `author`
--
 
 
CREATE TABLE `author` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `profile` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
 
--
-- Dumping data for table `author`
--
 
INSERT INTO `author` VALUES (1,'HaengUn','developer');
INSERT INTO `author` VALUES (2,'chureu','database administrator');
INSERT INTO `author` VALUES (3,'rich','data scientist, developer');
 
--
-- Table structure for table `topic`
--
 
CREATE TABLE `topic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(30) NOT NULL,
  `description` text,
  `created` datetime NOT NULL,
  `author_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
 
--
-- Dumping data for table `topic`
--
 
INSERT INTO `topic` VALUES (1,'MySQL','MySQL is...','2022-08-01 07:10:11',1);
INSERT INTO `topic` VALUES (2,'Oracle','Oracle is ...','2022-08-03 14:01:10',1);
INSERT INTO `topic` VALUES (3,'SQL Server','SQL Server is ...','2022-08-20 11:01:10',2);
INSERT INTO `topic` VALUES (4,'PostgreSQL','PostgreSQL is ...','2022-08-23 01:03:03',3);
INSERT INTO `topic` VALUES (5,'MongoDB','MongoDB is ...','2022-08-30 12:31:03',1);