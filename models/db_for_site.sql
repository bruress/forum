-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: websitedb
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answer`
--

DROP TABLE IF EXISTS `answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answer` (
  `answer_id` int unsigned NOT NULL AUTO_INCREMENT,
  `thread_id` int unsigned DEFAULT NULL,
  `student_id` int unsigned DEFAULT NULL,
  `answer_text` text NOT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `anonim_state` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`answer_id`),
  KEY `student_id` (`student_id`),
  KEY `thread_id` (`thread_id`),
  CONSTRAINT `answer_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  CONSTRAINT `answer_ibfk_2` FOREIGN KEY (`thread_id`) REFERENCES `thread` (`thread_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answer`
--

LOCK TABLES `answer` WRITE;
/*!40000 ALTER TABLE `answer` DISABLE KEYS */;
/*!40000 ALTER TABLE `answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalog`
--

DROP TABLE IF EXISTS `catalog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalog` (
  `catalog_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name_catalog` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`catalog_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalog`
--

LOCK TABLES `catalog` WRITE;
/*!40000 ALTER TABLE `catalog` DISABLE KEYS */;
INSERT INTO `catalog` VALUES
(1, 'Русский язык и культура речи'),
(2, 'Физическая культура'),
(3, 'Концепция современного естествознания'),
(4, 'Основы российской государственности'),
(5, 'Основы инженерной культуры'),
(6, 'Иностранный язык'),
(7, 'Информатика'),
(8, 'Программирование'),
(9, 'Математика'),
(10, 'Введение в профессию'),
(11, 'Дискретная математика'),
(12, 'Системная инженерия'),
(13, 'История России'),
(14, 'Физические основы функционирования ЭВМ'),
(15, 'Теория автоматов'),
(16, 'Технологии программирования'),
(17, 'Управление данными'),
(18, 'Вычислительная математика и методы оптимизации'),
(19, 'Основы российского законодательства'),
(20, 'Объектно-ориентированное программирование'),
(21, 'Алгоритмы и структуры данных'),
(22, 'Инженерия требований'),
(23, 'Электроника интегральных схем'),
(24, 'Моделирование бизнес-процессов'),
(25, 'Разработка мультимедийных приложений'),
(26, 'Цифровая схемотехника'),
(27, 'Введение в архитектуру ЭВМ'),
(28, 'Философия'),
(29, 'Архитектура операционных систем и сервисное программное обеспечение'),
(30, 'Теория компиляторов и формальные грамматики'),
(31, 'Безопасность жизнедеятельности'),
(32, 'Моделирование'),
(33, 'Архитектура вычислительных систем'),
(34, 'Инструментальные средства проектирования компонентов вычислительной техники'),
(35, 'Предметно-ориентированные автоматизированные информационные системы'),
(36, 'Сценарное и функциональное программирование'),
(37, 'Объектно-ориентированный анализ и проектирование'),
(38, 'Проектирование систем на ПЛИС'),
(39, 'Разработка Web-приложений'),
(40, 'UI/UX-дизайн приложений'),
(41, 'Организация ЭВМ'),
(42, 'Системное программирование'),
(43, 'Микропроцессорные системы'),
(44, 'Проектирование информационных систем'),
(45, 'Разработка приложений для мобильных платформ'),
(46, 'Экономика организаций'),
(47, 'Сети ЭВМ и средства телекоммуникации'),
(48, 'Управление IT проектами'),
(49, 'Интеллектуальные системы'),
(50, 'Проектный практикум'),
(51, 'Параллельное программирование'),
(52, 'Кибербезопасность и защита информации'),
(53, 'Методологии разработки программного обеспечения'),
(54, 'Методы и средства верификации'),
(55, 'Организация параллельных вычислительных систем'),
(56, 'Разработка корпоративных информационных систем'),
(57, 'Разработка систем управления'),
(58, 'Сопровождение и эксплуатация программно-аппаратных средств'),
(59, 'Анализ данных'),
(60, 'Промышленная разработка программного обеспечения'),
(61, 'Технология Интернета вещей'),
(62, 'Практика'),
(63, 'Диплом'),
(64, 'Флудилка'),
(65, 'Мемы');

/*!40000 ALTER TABLE `catalog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups_university`
--

DROP TABLE IF EXISTS `groups_university`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groups_university` (
  `group_id` int unsigned NOT NULL AUTO_INCREMENT,
  `group_name` varchar(20) NOT NULL,
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups_university`
--

LOCK TABLES `groups_university` WRITE;
/*!40000 ALTER TABLE `groups_university` DISABLE KEYS */;
INSERT INTO `groups_university` VALUES (1,'ИВТб-1301-05-00'),(2,'ИВТб-1302-05-00'),(3,'ИВТб-1303-05-00'),(4,'ИВТб-1304-05-00'),(5,'ИВТб-1307-06-00'),(6,'ИВТб-2301-05-00'),(7,'ИВТб-2302-05-00'),(8,'ИВТб-2303-05-00'),(9,'ИВТб-2304-05-00'),(10,'ИВТб-3301-05-00'),(11,'ИВТб-3302-05-00'),(12,'ИВТб-3303-05-00'),(13,'ИВТб-3304-05-00'),(14,'ИВТб-4301-05-00'),(15,'ИВТб-4302-05-00'),(16,'ИВТб-4303-05-00'),(17,'ИВТб-4304-05-00');
/*!40000 ALTER TABLE `groups_university` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invite_link`
--

DROP TABLE IF EXISTS `invite_link`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invite_link` (
  `invite_code` varchar(255) NOT NULL,
  `group_id` int unsigned NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`invite_code`),
  KEY `invite_link_ibfk_1` (`group_id`),
  CONSTRAINT `invite_link_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups_university` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invite_link`
--

LOCK TABLES `invite_link` WRITE;
/*!40000 ALTER TABLE `invite_link` DISABLE KEYS */;
/*!40000 ALTER TABLE `invite_link` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `moderator`
--

DROP TABLE IF EXISTS `moderator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `moderator` (
  `moderator_id` int unsigned NOT NULL AUTO_INCREMENT,
  `student_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`moderator_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `moderator_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `moderator`
--

LOCK TABLES `moderator` WRITE;
/*!40000 ALTER TABLE `moderator` DISABLE KEYS */;
/*!40000 ALTER TABLE `moderator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `student_id` int unsigned NOT NULL AUTO_INCREMENT,
  `group_id` int unsigned DEFAULT NULL,
  `invite_code` varchar(255) DEFAULT NULL,
  `student_name` varchar(100) DEFAULT NULL,
  `login` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  KEY `group_id` (`group_id`),
  KEY `invite_code` (`invite_code`),
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups_university` (`group_id`),
  CONSTRAINT `student_ibfk_2` FOREIGN KEY (`invite_code`) REFERENCES `invite_link` (`invite_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thread`
--

DROP TABLE IF EXISTS `thread`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thread` (
  `thread_id` int unsigned NOT NULL AUTO_INCREMENT,
  `student_id` int unsigned DEFAULT NULL,
  `catalog_id` int unsigned DEFAULT NULL,
  `thread_name` varchar(255) DEFAULT NULL,
  `thread_text` text NOT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `anonim_state` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`thread_id`),
  KEY `student_id` (`student_id`),
  KEY `catalog_id` (`catalog_id`),
  CONSTRAINT `thread_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  CONSTRAINT `thread_ibfk_2` FOREIGN KEY (`catalog_id`) REFERENCES `catalog` (`catalog_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thread`
--

LOCK TABLES `thread` WRITE;
/*!40000 ALTER TABLE `thread` DISABLE KEYS */;
/*!40000 ALTER TABLE `thread` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `thread_reaction`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thread_reaction` (
  `thread_reaction_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id` INT UNSIGNED NOT NULL,
  `thread_id` INT UNSIGNED NOT NULL,
  `type_reaction` ENUM('like', 'dislike') NOT NULL,
  PRIMARY KEY (`thread_reaction_id`),
  UNIQUE KEY `unique_reaction` (`student_id`, `thread_id`), -- один студент, одна реакция на один тред
  KEY `student_id` (`student_id`),
  KEY `thread_id` (`thread_id`),
  CONSTRAINT `thread_reaction_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  CONSTRAINT `thread_reaction_ibfk_2` FOREIGN KEY (`thread_id`) REFERENCES `thread` (`thread_id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
--
-- Dumping data for table `thread_reaction`
--

LOCK TABLES `thread_reaction` WRITE;
/*!40000 ALTER TABLE `thread_reaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `thread_reaction` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-07 19:57:38
