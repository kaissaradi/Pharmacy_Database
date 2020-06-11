/*Home Page:*/
/*SELECT pharmacies with name/number/DEA*/
SELECT `name`, `dea`, `address`, `phone`, `fax` FROM `pharmacy`
/* SEARCH pharmacy table */
SELECT `name`, `dea`, `address`, `phone`, `fax` FROM `pharmacy` WHERE `name` REGEXP :input AND `dea` REGEXP :input AND `address` REGEXP :input AND `phone` REGEXP :input AND `fax` REGEXP :input
/* INSERT into pharamacy table */
INSERT INTO `pharmacy` (`name`, `dea`, `address`, `phone`, `fax`) VALUES (?, ?, ?, ?, ?)
/* DELETE from pharmacy */
DELETE FROM `pharmacy` WHERE dea = ?

/*# count number of prescriptions where order status is completed today*/
SELECT COUNT(DISTINCT RX) FROM (
    SELECT * FROM prescription 
    LEFT JOIN  order ON prescription.RX = order.RX)
WHERE status = completed AND date = :todays-date;
/*# count number of prescriptions where order status is not completed*/
SELECT COUNT(DISTINCT RX) FROM (
    SELECT * FROM prescription 
    LEFT JOIN  order ON prescription.RX = order.RX)
WHERE status = incomplete;
/*#order that is most overdue*/
SELECT order_id, MIN(order_time) FROM (
    SELECT * FROM prescription 
    LEFT JOIN  order ON prescription.RX = order.RX)
WHERE status = incomplete
GROUP BY order_id
)
/*#create new prescription with patient, drug*/
INSERT INTO `prescription` (`RX`, `pharmacy_DEA`, `drug_name`, `drug_strength`, `prescritpion_date`)VALUES
(1, :inputDEA, :inputname, inputStrength, :inputDate);

/* Drug page: */
/* SELECT from drug table */
SELECT `ndc`, `name`, `strength`, `price`, `qty` FROM `drug` WHERE `pharmacy` = ? ORDER BY `name`
/* INSERT into drug table */
INSERT INTO `drug` (`name`, `ndc`, `strength`, `price`, `qty`, `pharmacy`) VALUES (?, ?, ?, ?, ?, ?)
/* SEARCH drug table */
SELECT `name`, `ndc`, `strength`, `price`, `qty` FROM `drug` WHERE `pharmacy` = ? AND `name` REGEXP ? AND `ndc` REGEXP ? AND `strength` REGEXP ? ORDER BY `name`
/* DELETE from drug table */
DELETE from `drug` where `ndc` = ? AND `pharmacy` = ?
/* UPDATE drug table */
UPDATE `drug` SET `qty` = ? WHERE `pharmacy` = ? AND `ndc` = ?


/*Patients:*/
/*#SELECT patients with name/number/dob*/
SELECT `id`, `fname`, `lname`, `dob`, `email`, `address`, `phone`, `gender` FROM `patient` ORDER BY `lname`
/* SEARCH patients table */
SELECT `id`, `fname`, `lname`, `dob`, `email`, `address`, `phone`, `gender` FROM `patient` WHERE `fname` REGEXP ? AND `lname` REGEXP ? AND `phone` REGEXP ? AND `email` REGEXP ?
/*#select all prescriptions for a patient*/
SELECT `name`, `strength`, `price` FROM `drug` 
JOIN `prescription` ON `prescription`.`drug` = `drug`.`ndc` 
JOIN `patient` ON `patient`.`id` = `prescription`.`patient`
WHERE `patient`.`id` = ? 
/*#update patient information for patient*/
UPDATE `id`, `fname`, `lname`, `dob`, `email`, `address`, `phone`, `gender` FROM `patient` WHERE `id` = ?
/*#create new patient*/
INSERT INTO `patient` (`lname`, `fname`, `dob`, `gender`, `address`, `email`, `phone`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
/* DELETE patient */
DELETE FROM `patient` WHERE `id` = ?

/*Orders:*/
/*#select all orders where status is not complete, lookup by name, drug*/
SELECT * FROM prescription 
LEFT JOIN  order ON prescription.RX = order.RX)
WHERE status = incomplete
GROUP BY order_id;

/*#select all rx in a order*/
SELECT * FROM order WHERE order_id = :inputorder;

/*#create an empty order*/
INSERT INTO `order` (`RX`, `pharmacy_DEA`, `drug_name`, `status`, `price`, `order_time`) 
VALUES('','','','','','','');
/*#add prescription to order*/
INSERT INTO `order` (`RX`, `pharmacy_DEA`, `drug_name`, `status`, `price`, `order_time`) 
VALUES(:inputrx,:inputDEA,:inputname,'incomplete',:inputprice,:inputdate);
/*#delete prescription*/
DELETE FROM prescription WHERE RX = :inputrx;

/*Sales:*/
/*#Count number of prescriptions sold today*/
SELECT COUNT(DISTINCT RX) FROM (
    SELECT * FROM prescription 
    LEFT JOIN  order ON prescription.RX = order.RX
    LEFT JOIN sale ON order.order_id = sale.order_id)
WHERE date = :inputdate;
/*#select completed orders by name, drug*/
SELECT COUNT(DISTINCT RX) FROM (
    SELECT * FROM prescription 
    LEFT JOIN  order ON prescription.RX = order.RX)
WHERE status = completed AND (name = :inputname OR drug = :inputdrug)
ORDER BY date;
/*#select sales by name, drug*/
SELECT * FROM sale WHERE name = :inputname or drug = :inputdrug
/*#create a new sale with order*/
INSERT INTO `sale` (`pharmacy_DEA`, `patient_lname`, `patient_fname`, `order_id`, `status`, `order_time`) 
VALUES (:inputDEA, :inputlname, :inputfname, :inputorderID, 'incomplete', :inputdate);
