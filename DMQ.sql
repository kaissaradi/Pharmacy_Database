/*Home Page:*/
/*SELECT pharmacies with name/number/DEA*/
SELECT `name`, `dea`, `address`, `phone`, `fax` FROM `pharmacy`
/* SEARCH pharmacy table */
SELECT `name`, `dea`, `address`, `phone`, `fax` FROM `pharmacy` WHERE `name` REGEXP :input AND `dea` REGEXP :input AND `address` REGEXP :input AND `phone` REGEXP :input AND `fax` REGEXP :input
/* INSERT into pharamacy table */
INSERT INTO `pharmacy` (`name`, `dea`, `address`, `phone`, `fax`) VALUES (:input, :input, :input, :input, :input)
/* DELETE from pharmacy */
DELETE FROM `pharmacy` WHERE dea = :input

/* Drug page: */
/* SELECT from drug table */
SELECT `ndc`, `name`, `strength`, `price`, `qty` FROM `drug` WHERE `pharmacy` = :input ORDER BY `name`
/* INSERT into drug table */
INSERT INTO `drug` (`name`, `ndc`, `strength`, `price`, `qty`, `pharmacy`) VALUES (:input, :input, :input, :input, :input, :input)
/* SEARCH drug table */
SELECT `name`, `ndc`, `strength`, `price`, `qty` FROM `drug` WHERE `pharmacy` = :input AND `name` REGEXP :input AND `ndc` REGEXP :input AND `strength` REGEXP :input ORDER BY `name`
/* DELETE from drug table */
DELETE from `drug` where `ndc` = :input AND `pharmacy` = :input
/* UPDATE drug table */
UPDATE `drug` SET `qty` = :input WHERE `pharmacy` = :input AND `ndc` = :input

/*Patients:*/
/*#SELECT patients with name/number/dob*/
SELECT `id`, `fname`, `lname`, `dob`, `email`, `address`, `phone`, `gender` FROM `patient` ORDER BY `lname`
/* SEARCH patients table */
SELECT `id`, `fname`, `lname`, `dob`, `email`, `address`, `phone`, `gender` FROM `patient` WHERE `fname` REGEXP :input AND `lname` REGEXP :input AND `phone` REGEXP :input AND `email` REGEXP :input
/*#select all prescriptions for a patient*/
SELECT `name`, `strength`, `price` FROM `drug` 
JOIN `prescription` ON `prescription`.`drug` = `drug`.`ndc` 
JOIN `patient` ON `patient`.`id` = `prescription`.`patient`
WHERE `patient`.`id` = :input 
/*#create new patient*/
INSERT INTO `patient` (`lname`, `fname`, `dob`, `gender`, `address`, `email`, `phone`) VALUES (:input, :input, :input, :input, :input, :input, :input, :input)
/* DELETE patient */
DELETE FROM `patient` WHERE `id` = :input

/*Orders page:*/
/*#select all orders where status is not complete*/
SELECT `order`.`id`, `fname`, `lname`, `time`, `name`, `price` FROM `order` 
JOIN `prescription` ON `order`.`rx` = `prescription`.`rx` 
JOIN `patient` ON `prescription`.`patient` = `patient`.`id` 
JOIN `drug` ON `prescription`.`drug` = `drug`.`ndc`
WHERE `stats` = 'Incomplete'
/*#search all orders where status is not complete, lookup by name, drug*/
SELECT `order`.`id`, `fname`, `lname`, `time`, `name`, `price` FROM `order` 
JOIN `prescription` ON `order`.`rx` = `prescription`.`rx` 
JOIN `patient` ON `prescription`.`patient` = `patient`.`id` 
JOIN `drug` ON `prescription`.`drug` = `drug`.`ndc`
WHERE `status` = 'Incomplete' AND `fname` REGEXP :input AND `lname` REGEXP :input AND `name` REGEXP :input
/*#create an empty order*/
INSERT INTO `order` (`id`, `rx`, `status`, `time`) VALUES
('', '', '', '')
/*#add prescription to order*/
UPDATE `order` SET `rx` = :input WHERE `pharmacy` = :input
/* Delete Prescription */
DELETE FROM prescription WHERE rx = :input

/*Sales page:*/
/* SELECT from sales table */
SELECT `order`.`id`, `fname`, `lname`, `sale`.`time`, `name`, `price` FROM `sale`
JOIN `order` ON `sale`.`order` = `order`.`id`
JOIN `prescription` ON `order`.`rx` = `prescription`.`rx` 
JOIN `patient` ON `prescription`.`patient` = `patient`.`id` 
JOIN `drug` ON `prescription`.`drug` = `drug`.`ndc`
/* SELECT complete orders */
SELECT `order`.`id`, `fname`, `lname`, `time`, `name`, `price` FROM `order` 
JOIN `prescription` ON `order`.`rx` = `prescription`.`rx` 
JOIN `patient` ON `prescription`.`patient` = `patient`.`id` 
JOIN `drug` ON `prescription`.`drug` = `drug`.`ndc`
WHERE `status` = 'Complete'


/*#Count number of prescriptions sold today*/
SELECT COUNT(DISTINCT RX) FROM (
    SELECT * FROM prescription 
    LEFT JOIN  order ON prescription.RX = order.RX
    LEFT JOIN sale ON order.order_id = sale.order_id)
WHERE date = :inputdate
/*#select completed orders by name, drug*/
SELECT COUNT(DISTINCT RX) FROM (
    SELECT * FROM prescription 
    LEFT JOIN  order ON prescription.RX = order.RX)
WHERE status = completed AND (name = :inputname OR drug = :inputdrug)
ORDER BY date
/*#select sales by name, drug*/
SELECT * FROM sale WHERE name = :inputname or drug = :inputdrug
/*#create a new sale with order*/
INSERT INTO `sale` (`pharmacy_DEA`, `patient_lname`, `patient_fname`, `order_id`, `status`, `order_time`) 
VALUES (:inputDEA, :inputlname, :inputfname, :inputorderID, 'incomplete', :inputdate)
