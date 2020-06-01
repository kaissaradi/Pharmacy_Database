/* *********************************
              EVENTS 
************************************/
window.addEventListener('load', function(event){
  readReq();    //Read Event - select all rows from pharmacy table
  event.preventDefault();
});

//reset selected rows from patient table
document.getElementById('reset_btn').addEventListener('click', function(event){
  readReq();
  event.preventDefault();
});

//Create Event - create a get request with the users query to INSERT INTO the table
document.getElementById('add_patient_btn').addEventListener('click', function(event){
  createReq();
  event.preventDefault();
});

//Search Event - create a get request with the users query to SELECT FROM the table
document.getElementById('search_patient_btn').addEventListener('click', function(event){
  searchReq();
  event.preventDefault();
});

//Select Event - create a get to view patient prescriptions in a new table
document.body.addEventListener('click', function(event){
  if(event.srcElement.className == "view btn dark-green"){
    getPatient(event.srcElement.id);
  }
});
/* *********************************
              FUNCTIONS 
************************************/
//function to add a new element to the DOM. take a parent node to attatch the object to
// the type of element to create, and optionall a class, id, and innner text
function addElement(parent, elementType, classNm, idName, text){
  newElement = document.createElement(elementType);
  parent.append(newElement);
  if(classNm){
    newElement.className = classNm; 
  }
  if(idName){
    newElement.id = idName;
  }
  if(text){
    newElement.innerText = text;
  }
  return newElement;
}
//Function to create a new table with MYSQL Query data and replace the current table on the DOM
function createTable(resp, table_id){
  var table = document.getElementById(table_id);
  table.id = "oldTable";
  //create new table, using response data for values and replace the current table on the page
  var newTable = document.createElement('table');
  newTable.id = table_id;
  newTable.className = "table table-bordered table-hover table-dark";
  table.parentNode.replaceChild(newTable, table);   
  //create table head with column headers
  var thead = addElement(newTable, 'thead', 'light-green');
  var th = addElement(thead, 'th', undefined, undefined, 'DOB');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'First Name');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'Last Name');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'Gender');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'Email');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'Address');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'Update');
  th.scope = "col";
  //create table body with each row
  var tbody = addElement(newTable, 'tbody');
  for (var row of resp.results) {     //create a row for each entry
    if (row.id != '') {
      var newRow =  addElement(tbody, 'tr');
      //loop through each cell and label it accordingly
      var cell = addElement(newRow, 'td', undefined, undefined, row.dob);
      var cell = addElement(newRow, 'td', undefined, undefined, row.fname);
      var cell = addElement(newRow, 'td', undefined, undefined, row.lname);
      var cell = addElement(newRow, 'td', undefined, undefined, row.gender);
      var cell = addElement(newRow, 'td', undefined, undefined, row.email);
      var cell = addElement(newRow, 'td', undefined, undefined, row.address);
      //create a button to edit and delete the data
      var editButton = addElement(newRow, 'Input', 'view btn dark-green', row.id)
      editButton.setAttribute("type", "button");
      editButton.value = "View";
      editButton.style.float = "left";
    }
  }
}

function readReq(){
  //Read Event - create a get request to SELECT FROM the table
  var req = new XMLHttpRequest(); //create query string
  var payload = "/patient?" + "read=true";
  //send get request
  req.open("GET",payload,true);                 
  req.addEventListener('load', function(){                       
    if(req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText); 
      createTable(response, "patients");    //display the response information in the pharmacy table
    }
    else {
      console.log("error");
    }
  });
  req.send(payload);
}

function createReq(){
  var req = new XMLHttpRequest(); //create query string
  var form = document.getElementById('insert_patient_form');
  var payload = "/patient?" + "create=true" +
  "&fname="+form.elements.add_fname.value+
  "&lname="+form.elements.add_lname.value+
  "&dob="+form.elements.add_dob.value.toString()+
  "&email="+form.elements.add_email.value+
  "&phone="+form.elements.add_phone.value+
  "&gender="+form.elements.add_gender.value;
  //send get request
  console.log(payload);
  req.open("GET",payload, true);                 
  req.addEventListener('load', function(){                       
    if(req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText); 
      createTable(response, "patients");    //display the response information in the pharmacy table
    }
    else {
      console.log("error");
    }
  });
  req.send(payload);
}

function searchReq(){
  console.log("here");
  var req = new XMLHttpRequest(); 
  //create query string with regular expressions
  var form = document.getElementById('search_patient_form');
  var fname = "^" + form.elements.search_fname.value;
  var lname = "^" + form.elements.search_lname.value;
  var dob = form.elements.search_dob.value.toString();
  var email = "^" + form.elements.search_email.value
  var phone = "^" + form.elements.search_phone.value.toString();
  var gender = form.elements.search_gender.value;
  var payload = "/patient?" + "search=true" +
  "&fname="+fname+
  "&lname="+lname+
  "&dob="+dob+
  "&email="+email+
  "&phone="+phone+
  "&gender="+gender;
  //send get request
  req.open("GET",payload, true);                 
  req.addEventListener('load', function(){                       
    if(req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText); 
      createTable(response, "patients");    //display the response information in the pharmacy table
    }
    else {
      console.log("error");
    }
  });
  req.send(payload);
}

function getPatient(id){
  var req = new XMLHttpRequest(); 
  var payload = "/patient?" + "patientid=true" + "&id=" + id;
  console.log(payload);
  //send get request
  req.open("GET",payload, true);                 
  req.addEventListener('load', function(){                       
    if(req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText); 
      createTable(response, "search_patient");    //display the response information in the pharmacy table
    }
    else {
      console.log("error");
    }
  });
  req.send(payload);
}