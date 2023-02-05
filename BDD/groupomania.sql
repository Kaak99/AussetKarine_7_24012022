-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: groupomania
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments_table`
--

DROP TABLE IF EXISTS `comments_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments_table` (
  `idComments` int NOT NULL AUTO_INCREMENT,
  `contenu` varchar(256) NOT NULL,
  `id_Posts` int NOT NULL,
  `id_Users` int NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idComments`),
  UNIQUE KEY `comments-id_UNIQUE` (`idComments`),
  KEY `postid-comment_idx` (`id_Posts`),
  KEY `id_users_idx` (`id_Users`),
  CONSTRAINT `id_posts` FOREIGN KEY (`id_Posts`) REFERENCES `posts_table` (`idPosts`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `id_users` FOREIGN KEY (`id_Users`) REFERENCES `users_table` (`idUsers`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=228 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments_table`
--

LOCK TABLES `comments_table` WRITE;
/*!40000 ALTER TABLE `comments_table` DISABLE KEYS */;
INSERT INTO `comments_table` VALUES (5,'pas interessant',148,46,'2022-08-11 13:32:27'),(9,'preums!',146,46,'2022-08-11 14:45:18'),(20,'j\'adore le latin',148,45,'2022-08-17 15:42:04'),(23,'c\'est mort par ici !',131,45,'2022-09-01 13:57:35'),(107,'bravo!',199,45,'2022-11-10 15:46:49'),(130,'je suis épaté !',231,97,'2022-12-07 20:56:27'),(131,'bienvenue !',237,98,'2022-12-08 12:57:52'),(132,'welcome!',237,45,'2022-12-08 16:19:40'),(134,'un dos tres !',146,45,'2022-12-08 16:34:25'),(135,'quelle érudition',135,45,'2022-12-08 16:36:27'),(141,'on s\'ennuie ici ?',148,98,'2022-12-15 12:03:40'),(142,'bienvenue',146,98,'2022-12-15 12:03:53'),(143,'tempete annoncée !',238,45,'2022-12-15 17:43:42'),(161,'bienvenue à toi ?',237,46,'2023-01-26 15:17:54'),(213,'bonjour à tous !',131,78,'2023-02-05 16:00:03'),(214,'ca alors! :o',135,78,'2023-02-05 16:00:47'),(215,'bienvenue!',146,78,'2023-02-05 16:01:03'),(216,'bon anniversaire!',198,78,'2023-02-05 16:01:23'),(218,'incroyable ?',231,78,'2023-02-05 16:02:45'),(219,'?',231,45,'2023-02-05 16:13:40'),(220,'joyeux anniversaire ! ?',198,45,'2023-02-05 16:18:08'),(221,'j\'arrive!',131,79,'2023-02-05 16:22:18'),(222,'quelle technique !',199,79,'2023-02-05 16:22:52'),(223,'moi aussi je viens d\'arriver, bonjour à tous !',237,79,'2023-02-05 16:23:58'),(224,'j\'adore tes posts ?',238,79,'2023-02-05 16:24:52'),(225,'tellement beau ! ? ?',231,79,'2023-02-05 16:26:26'),(226,'ça change tout!',238,78,'2023-02-05 16:27:16'),(227,'welcome home!',237,78,'2023-02-05 16:27:45');
/*!40000 ALTER TABLE `comments_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes_table`
--

DROP TABLE IF EXISTS `likes_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes_table` (
  `idLikes` int NOT NULL AUTO_INCREMENT,
  `like` tinyint NOT NULL DEFAULT '0',
  `id_Users` int NOT NULL,
  `id_Posts` int NOT NULL,
  PRIMARY KEY (`idLikes`),
  KEY `id_users_idx` (`id_Users`),
  KEY `id_posts_idx` (`id_Posts`),
  CONSTRAINT `id-posts` FOREIGN KEY (`id_Posts`) REFERENCES `posts_table` (`idPosts`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `id-users` FOREIGN KEY (`id_Users`) REFERENCES `users_table` (`idUsers`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=179 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='up=+1 ; down=-1 ; rien(default)=0';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes_table`
--

LOCK TABLES `likes_table` WRITE;
/*!40000 ALTER TABLE `likes_table` DISABLE KEYS */;
INSERT INTO `likes_table` VALUES (13,1,53,146),(15,1,45,146),(16,0,45,131),(31,0,45,135),(49,0,45,148),(60,1,52,148),(61,1,52,146),(62,1,52,135),(63,1,52,131),(66,1,53,148),(67,1,53,135),(68,1,53,131),(77,0,45,199),(78,1,45,198),(88,0,79,222),(89,1,45,231),(92,0,97,231),(94,0,97,148),(95,1,97,146),(96,0,97,135),(97,0,97,131),(98,1,98,237),(101,1,46,237),(103,1,45,237),(104,1,52,237),(105,1,52,231),(107,1,98,148),(108,1,45,222),(109,1,101,238),(110,1,45,238),(165,1,78,131),(166,1,78,146),(167,1,78,198),(170,1,78,238),(175,1,79,131),(176,1,79,238),(177,1,79,237),(178,1,78,237);
/*!40000 ALTER TABLE `likes_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts_table`
--

DROP TABLE IF EXISTS `posts_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts_table` (
  `idPosts` int NOT NULL AUTO_INCREMENT,
  `titre` varchar(50) NOT NULL,
  `contenu` varchar(500) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `id_Users` int NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `nombreLike` int DEFAULT '0',
  `nombreComment` int DEFAULT '0',
  PRIMARY KEY (`idPosts`),
  UNIQUE KEY `post-id_UNIQUE` (`idPosts`),
  KEY `userid_idx` (`id_Users`),
  CONSTRAINT `userid` FOREIGN KEY (`id_Users`) REFERENCES `users_table` (`idUsers`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=293 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts_table`
--

LOCK TABLES `posts_table` WRITE;
/*!40000 ALTER TABLE `posts_table` DISABLE KEYS */;
INSERT INTO `posts_table` VALUES (131,'Le tout premier post !','bienvenue sur le forum\r\n ! welcome home !','',45,'2022-07-19 18:57:06',4,3),(135,'Lorem Ipsum','Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old !','http://localhost:3000/images/Guru-Granth-Sahib-Mansucr1675155193550.jpg',46,'2022-07-20 16:30:42',2,2),(146,'newbies','je débute ici','http://localhost:3000/images/hi.gif1658756805221.gif',53,'2022-07-25 15:46:45',5,4),(148,'j\'ai beaucoup à dire !','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ut magna at ipsum aliquet pharetra. Integer a efficitur justo. Integer varius elementum felis, et egestas urna condimentum vel. Nunc feugiat ipsum nec nibh blandit consectetur. Cras turpis lectus, feugiat sit amet elementum id, ornare ac lectus. Mauris blandit mi non scelerisque viverra. Cras consequat quis dui sit amet facilisis. Nam eros quam, fringilla sed nibh in, aliquet vehicula purus. Cras facilisis neque eget dolor imperd','',45,'2022-08-11 12:43:00',3,3),(198,'happy birthday Una !','?','http://localhost:3000/images/fete-image-animee-0046.gi1675157733459.gif',53,'2022-10-19 13:29:11',2,2),(199,'important !','J\'écris\r\na\r\nla\r\nligne\r\nsi\r\nje\r\nveux','',52,'2022-10-19 13:30:33',0,2),(222,'un post !','je ne poste que des images de chats','http://localhost:3000/images/undraw_cat_yw2t.png1669143214603.png',79,'2022-11-22 19:53:34',1,0),(231,'position incroyable !','quelle souplesse...','http://localhost:3000/images/cat-2934720_1920.jpg1675157655427.jpg',45,'2022-11-24 18:33:24',2,4),(237,'nouveau','bonjour,\r\nje viens vous rejoindre sur le forum ?','',98,'2022-12-08 12:57:11',6,5),(238,'point meteo','beau temps ce week end !','',101,'2022-12-15 17:41:47',4,3);
/*!40000 ALTER TABLE `posts_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_table`
--

DROP TABLE IF EXISTS `users_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_table` (
  `idUsers` int NOT NULL AUTO_INCREMENT,
  `pseudo` varchar(25) NOT NULL,
  `password` varchar(256) NOT NULL,
  `avatar` varchar(100) DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/9/98/OOjs_UI_icon_userAvatar.svg',
  `email` varchar(100) NOT NULL,
  `bio` varchar(200) DEFAULT NULL,
  `admin` tinyint NOT NULL DEFAULT '0',
  `active` tinyint NOT NULL DEFAULT '1',
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idUsers`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `pseudo_UNIQUE` (`pseudo`),
  UNIQUE KEY `user-id_UNIQUE` (`idUsers`)
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='admin=1=>admin (user=0)\nactive=1(si 0=désactivé)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_table`
--

LOCK TABLES `users_table` WRITE;
/*!40000 ALTER TABLE `users_table` DISABLE KEYS */;
INSERT INTO `users_table` VALUES (45,'god','$2b$10$CpPfSYbaJ2gmesAmnR.SvOOgB0so9TPGt/GNv5x5.L40j3cnc4W6K','http://localhost:3000/images/3434_thumbnail.jpg1675112747874.jpg','god@gpm.fr','the\r\n-god-\r\nunique\r\n',1,1,'2022-07-13 20:15:44'),(46,'Una','$2b$10$nJJXKmu7HD/jOH.n31v2q.NzEdxJuq25Z3Zn.SggC0Pyi3atcXq4e','http://localhost:3000/images/3927100.png1675151489506.png','una@gpm.fr','la première inscrite du forum!',0,1,'2022-07-13 20:18:35'),(52,'Doss','$2b$10$idUqJTE9xNYNgFfiZKEKzOf0uhTWZmu49eqgYuSNG0mLdyWIKtLJa','http://localhost:3000/images/ted4.jpg1675155459105.jpg','doss@gpm.fr','give me a hug !',0,1,'2022-07-19 16:55:39'),(53,'Tress','$2b$10$L4Bb0fSrumr/SWkyBWKrI.NHylpJry1.RMddNE8z3Nq6cARO.3hCa','http://localhost:3000/images/lady-animated.gif1675155598842.gif','tress@gpm.fr','Mauris imperdiet scelerisque erat. ',0,1,'2022-07-19 16:56:06'),(78,'Quatro','$2b$10$.mxmtm/xkar6kYZb5gnUkODMZYBQPE1o1naLija3fwk97fL.jFPIS','http://localhost:3000/images/splatoon-nintendo.gif1675155687210.gif','quatro@gpm.fr','Donec tincidunt consequat diam, non pretium nunc varius vitae. Aenean vel finibus lectus.',0,1,'2022-07-25 15:36:10'),(79,'Cinko','$2b$10$1G77hUlC41HhHgwmiWyULOvgzB3WCCy78hnY/qot44eCtqacwNjxK','http://localhost:3000/images/ayden.gif1669310647932.gif','cinko@gpm.fr','Mauris imperdiet scelerisque erat. Nam id facilisis mi. Nam quis odio sit amet leo consectetur scelerisque. Sed mattis!',0,1,'2022-11-17 12:47:42'),(80,'Seis','$2b$10$ssHG0VOLh6GPu2.boSkZe.203j9thWYDdex94IGP2ombL5KObkJiO','http://localhost:3000/images/The-Rise-of-Amun-Ra-540x71675156179118.jpg','seis@gpm.fr','Ut eleifend, est sit amet viverra venenatis, risus dolor congue metus',0,1,'2022-11-17 13:47:53'),(81,'Siete','$2b$10$ouI8TK93IyJh/Mw5Tz7gGOLszaiCt6yYXfNn/lxwHYxfja0IopUJq','http://localhost:3000/images/default.jpg','siete@gpm.fr','Ut eleifend, est sit amet viverra venenatis, risus dolor congue metus',0,1,'2022-11-23 17:25:12'),(83,'Octo','$2b$10$KKiSp5r1a01s2y3AhEzE6OiYeR.sxvHkgPRccDAAUCtcEbt6o8fH.','http://localhost:3000/images/default.jpg','octo@gpm.fr','la bio de 62 !',0,1,'2022-11-23 17:25:37'),(97,'Nueve','$2b$10$wBgFn/TXe5n2bXMQ17UEEuRmNBQUUTpKxbxy5oOk7TEsGW18ddJyW','http://localhost:3000/images/fnaf-fnaf-world.gif1670359718797.gif','nueve@gpm.fr','Ut eleifend, est sit amet viverra venenatis, risus dolor congue metus',0,1,'2022-12-06 17:22:24'),(98,'Dies','$2b$10$CCcggwfbeJF6IBQllVB7Ju3wKuKjpM9Dy2pusLO/jM2gBNmgyJGku','http://localhost:3000/images/villager-minecraft.gif1670500585172.gif','dies@mail.com','Rien à dire !',0,1,'2022-12-08 12:56:25'),(101,'eleven','$2b$10$.4S6b2DE/yg40ul.2hs7TuTq8gLt7aegY.6zVqM6u2a5/vMjw894O','http://localhost:3000/images/default.gif','eleven@gpm.fr','nada !',0,1,'2022-12-15 17:36:06'),(105,'new01','$2b$10$3tzRK1hTn17nzxFlB3ng5.J6/U9lrChV7tMuEoqOuaanqtcLsfEJm','http://localhost:3000/images/default.gif1675157216474.gif','new01@mail.fr','ma bio',0,1,'2022-12-29 15:14:56'),(112,'new02','$2b$10$SjB8eDrDLOMkTrdMDVckT.j/gaLIoDJALHc6euVZIeoiPdb.m4mBC','http://localhost:3000/images/default.gif','new02@gpm.fr','labio',0,1,'2023-01-18 10:40:14');
/*!40000 ALTER TABLE `users_table` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-05 16:30:25
