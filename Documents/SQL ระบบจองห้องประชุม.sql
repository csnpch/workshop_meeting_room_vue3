-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: 127.0.0.1    Database: meeting_room_db
-- ------------------------------------------------------
-- Server version	8.0.1-dmr

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tb_bookings`
--

DROP TABLE IF EXISTS `tb_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb_bookings` (
  `bk_id` int(11) NOT NULL AUTO_INCREMENT,
  `bk_title` varchar(45) NOT NULL,
  `bk_detail` text,
  `bk_time_start` datetime NOT NULL,
  `bk_time_end` datetime NOT NULL,
  `bk_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `bk_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `bk_status` enum('pending','allowed','not allowed') NOT NULL DEFAULT 'pending',
  `tb_users_u_id` int(11) NOT NULL,
  `tb_rooms_r_id` int(11) NOT NULL,
  PRIMARY KEY (`bk_id`),
  KEY `fk_tb_bookings_tb_users_idx` (`tb_users_u_id`),
  KEY `fk_tb_bookings_tb_rooms1_idx` (`tb_rooms_r_id`),
  CONSTRAINT `fk_tb_bookings_tb_rooms` FOREIGN KEY (`tb_rooms_r_id`) REFERENCES `tb_rooms` (`r_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tb_bookings_tb_users` FOREIGN KEY (`tb_users_u_id`) REFERENCES `tb_users` (`u_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tb_bookings_has_tb_equipments`
--

DROP TABLE IF EXISTS `tb_bookings_has_tb_equipments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb_bookings_has_tb_equipments` (
  `tb_bookings_bk_id` int(11) NOT NULL,
  `tb_equipments_eq_id` int(11) NOT NULL,
  PRIMARY KEY (`tb_bookings_bk_id`,`tb_equipments_eq_id`),
  KEY `fk_tb_bookings_has_tb_equipments_tb_equipments1_idx` (`tb_equipments_eq_id`),
  KEY `fk_tb_bookings_has_tb_equipments_tb_bookings1_idx` (`tb_bookings_bk_id`),
  CONSTRAINT `fk_tb_bookings_has_tb_equipments_tb_bookings1` FOREIGN KEY (`tb_bookings_bk_id`) REFERENCES `tb_bookings` (`bk_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tb_bookings_has_tb_equipments_tb_equipments1` FOREIGN KEY (`tb_equipments_eq_id`) REFERENCES `tb_equipments` (`eq_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tb_equipments`
--

DROP TABLE IF EXISTS `tb_equipments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb_equipments` (
  `eq_id` int(11) NOT NULL AUTO_INCREMENT,
  `eq_image` varchar(45) NOT NULL,
  `eq_name` varchar(45) NOT NULL,
  `eq_detail` text,
  `eq_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `eq_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`eq_id`),
  UNIQUE KEY `eq_name_UNIQUE` (`eq_name`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tb_rooms`
--

DROP TABLE IF EXISTS `tb_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb_rooms` (
  `r_id` int(11) NOT NULL AUTO_INCREMENT,
  `r_image` varchar(45) NOT NULL,
  `r_name` varchar(45) NOT NULL,
  `r_capacity` int(11) NOT NULL,
  `r_detail` text,
  `r_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `r_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`r_id`),
  UNIQUE KEY `r_name_UNIQUE` (`r_name`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tb_users`
--

DROP TABLE IF EXISTS `tb_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb_users` (
  `u_id` int(11) NOT NULL AUTO_INCREMENT,
  `u_username` varchar(15) NOT NULL,
  `u_password` varchar(64) NOT NULL,
  `u_firstname` varchar(45) NOT NULL,
  `u_lastname` varchar(45) NOT NULL,
  `u_role` enum('admin','user') NOT NULL DEFAULT 'user',
  `u_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `u_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`u_id`),
  UNIQUE KEY `u_username_UNIQUE` (`u_username`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-09-15 17:14:19
