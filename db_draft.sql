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
    `pharmacy_name` varchar(255) NOT NULL,
    `pharmacy_DEA` int(11) NOT NULL,
    `pharmacy_address` varchar(255) NOT NULL,
    `pharmacy_phone` int(11) NOT NULL,
    `pharmacy_fax` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `pharmacy`
--

INSERT INTO `pharmacy` (`pharmacy_name`, `pharmacy_DEA`, `pharmacy_address`, `pharmacy_phone`, `pharmacy_fax`) VALUES
('Saradi-Wang Pharmacy', 000, 'OSU', 888-000-0000, 000);

-- --------------------------------------------------------

--
-- Table structure for table `drug`
--

CREATE TABLE `drug`(
    `drug_name` varchar(255) NOT NULL,
    `drug_NDC` int(11) NOT NULL,
    `pharmacy_DEA` int(11) NOT NULL,
    `drug_strength` int(11) NOT NULL,
    `drug_price` float NOT NULL,
    `drug_qty` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `drug`
--

INSERT INTO `drug` (`drug_name`, `drug_NDC`, `pharmacy_DEA`, `drug_strength`, `drug_price`, `drug_qty`) VALUES
('Aspirin', 0000, 000, 81, 0.32, 300),
('Tylenol', 0001, 000, 325, 10.0, 50);

-- --------------------------------------------------------

--
-- Table structure for table `patient`
--

CREATE TABLE `patient` (
    `patient_lname` varchar(255) NOT NULL,
    `patient_fname` varchar(255) NOT NULL,
    `patient_DOB` DATE NOT NULL,
    `patient_age` int(11) NOT NULL,
    `patient_gender` varchar(255) NOT NULL,
    `patient_address` varchar(255) NOT NULL,
    `patient_email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`patient_lname`, `patient_fname`, `patient_DOB`, `patient_age`, `patient_gender`, `patient_address`, `patient_email`) VALUES
('Trump', 'Donald', '2020-05-17', 73, 'male', '100 5th st', 'null@123.com'),
('James', 'Bladwin', '2020-05-17', 19, 'male', '101 10th st', 'null@456.com');

-- --------------------------------------------------------

--
-- Table structure for table `prescription`
--

CREATE TABLE `prescription` (
    `RX` int(11) NOT NULL,
    `pharmacy_DEA` int(11) NOT NULL,
    `drug_name` varchar(255) NOT NULL,
    `drug_strength` int(11) NOT NULL,
    `prescritpion_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `prescription`
--

INSERT INTO `prescription` (`RX`, `pharmacy_DEA`, `drug_name`, `drug_strength`, `prescritpion_date`)VALUES
(1, 000, 'Aspirin', 81, '2009-03-03 15:55:11'),
(2, 000, 'Tylenol', 325, '2009-01-01 15:55:11');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
    `order_id` int(11) NOT NULL,
    `RX` int(11) NOT NULL,
    `pharmacy_DEA` int(11) NOT NULL,
    `order_name` varchar(255) NOT NULL,
    `drug_name` varchar(255) NOT NULL,
    `status` varchar(255) NOT NULL,
    `price` int(11) NOT NULL,
    `order_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`order_id`, `RX`, `pharmacy_DEA`, `drug_name`, `status`, `price`, `order_time`) VALUES
(1, 1, 000, 'Aspirin', 'completed', 10, '2020-05-14 18:33:11'),
(2, 2, 000, 'Tylenol', 'uncompleted', 20, '2020-05-14 18:33:11');


-- --------------------------------------------------------

--
-- Table structure for table `currentSale`
--

CREATE TABLE `currentSale` (
    `pharmacy_DEA` int(11) NOT NULL,
    `order_id` int(11) NOT NULL,
    `order_name` varchar(255) NOT NULL,
    `drug_name` varchar(255) NOT NULL,
    `order_time` timestamp NOT NULL DEFAULT current_timestamp(),
    `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Table structure for table `completedSale`

CREATE TABLE `completedSale` (
    `pharmacy_DEA` int(11) NOT NULL,
    `order_id` int(11) NOT NULL,
    `order_name` varchar(255) NOT NULL,
    `drug_name` varchar(255) NOT NULL,
    `order_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Table structure for table `sale`

CREATE TABLE `sale` (
    `pharmacy_DEA` int(11) NOT NULL,
    `patient_lname` varchar(255) NOT NULL,
    `patient_fname` varchar(255) NOT NULL,
    `order_id` int(11) NOT NULL,
    `status` varchar(255) NOT NULL,
    `order_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


--
-- Dumping data for table `completedSale`
--

INSERT INTO `completedSale` (`pharmacy_DEA`, `order_id`, `order_name`, `drug_name`, `order_time`) VALUES
(000, 1, 'Dave Smith', 'Aspirin', '2020-05-14 18:33:11');

--
-- Indexes for dumped tables
--


-- indexes for table `pharmacy`
ALTER TABLE `pharmacy`
    ADD PRIMARY KEY (`pharmacy_DEA`);

-- indexes for table `drug`
ALTER TABLE `drug`
    ADD PRIMARY KEY (`drug_name`),
    ADD  KEY (`drug_strength`);

-- indexes for table `prescription`
ALTER TABLE `prescription`
    ADD PRIMARY KEY (`RX`);


-- indexes for table `order`
ALTER TABLE `order`
    ADD PRIMARY KEY (`order_id`),
    ADD KEY (`order_name`),
    ADD KEY (`order_time`),
    ADD KEY (`status`);

-- indexes for table `patient`
ALTER TABLE `patient`
    ADD PRIMARY KEY (`patient_lname`),
    ADD KEY (`patient_fname`);

--
-- AUTO_INCREMENT for dumped tables
--
ALTER TABLE `prescription`
    MODIFY `RX` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;