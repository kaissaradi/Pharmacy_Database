/*Home Page:*/
/*select pharmacies with name/number/DEA*/
SELECT * FROM pharmacy WHERE (name = :nameinput OR phone = :phoneinput OR DEA = :deainput);
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

/*Patients:*/
/*#select patients with name/number/dob*/
SELECT * FROM patient WHERE (patient_fname = :nameinput OR patient_DOB = :inputDOB OR phone = :inputphone);
/*#select all prescriptions for a patient*/
SELECT * FROM prescription WHERE patient_name = :inputname
/*#update patient information for patient*/
UPDATE `patient`
SET (patient_fname = :inputfname, patient_lname, :input_fname)
WHERE condition;
/*#create new patient*/
INSERT INTO `patient` (`patient_lname`, `patient_fname`, `patient_DOB`, `patient_age`, `patient_gender`, `patient_address`, `patient_email`) VALUES
(:inputfname, :inputlname, :inputdate, :inputage, :inputgender, :inputaddres, :inputemail);

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
