-- phpMyAdmin SQL Dump
-- version 4.9.4
-- https://www.phpmyadmin.net/
--
-- Host: classmysql.engr.oregonstate.edu:3306
-- Generation Time: May 17, 2020 at 10:54 PM
-- Server version: 10.4.11-MariaDB-log
-- PHP Version: 7.4.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------

--
-- Table structure for table `pharmacy`
--

CREATE TABLE `pharmacy`(
    `name` varchar(255) NOT NULL,
    `dea` int(11) NOT NULL UNIQUE,
    `address` varchar(255) NOT NULL,
    `phone` int(11) NOT NULL,
    `fax` int(11) NOT NULL,
    PRIMARY KEY (`dea`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- --------------------------------------------------------

--
-- Table structure for table `drug`
--

CREATE TABLE `drug`(
    `name` varchar(255) NOT NULL,
    `ndc` int(11) NOT NULL UNIQUE,
    `pharmacy` int(11) NOT NULL,
    `strength` int(11) NOT NULL,
    `price` decimal(8,2),
    `qty` int(11),
    PRIMARY KEY (`ndc`),
    FOREIGN KEY(`pharmacy`) REFERENCES`pharmacy`(`dea`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- --------------------------------------------------------

--
-- Table structure for table `patient`
--

CREATE TABLE `patient` (
    `id` int(11) AUTO_INCREMENT,
    `lname` varchar(255) NOT NULL,
    `fname` varchar(255) NOT NULL,
    `dob` DATE NOT NULL,
    `gender` varchar(255) NOT NULL,
    `address` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `phone` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `patient`

-- --------------------------------------------------------

--
-- Table structure for table `prescription`
--

CREATE TABLE `prescription` (
    `rx` int(11) NOT NULL AUTO_INCREMENT,
    `patient` int(11),
    `drug` int(11),
    PRIMARY KEY (`rx`),
    FOREIGN KEY(`patient`) REFERENCES`patient`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `rx` int(11) NOT NULL,
    `status` varchar(255) NOT NULL,
    `time` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY key (`id`),
    FOREIGN KEY(`rx`) REFERENCES`prescription`(`rx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------


COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;