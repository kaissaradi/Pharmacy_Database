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
  console.log("clicked!");
  createReq();
  event.preventDefault();
});

//Search Event - create a get request with the users query to SELECT FROM the table
document.getElementById('search_patient_btn').addEventListener('click', function(event){
  searchReq();
  event.preventDefault();
  console.log("here!");
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
//Function to add a row to the pharmacy table and fill it in with the information passed to it from the SQL database table
function createTable(resp, table_id){
  var table = document.getElementById(table_id);
  table.id = "oldTable";
  //create new table, using response data for values
  var newTable = document.createElement('table');
  newTable.id = table_id;
  newTable.className = "table table-bordered table-hover table-dark";
  //create table head
  var thead = document.createElement('thead');
  thead.className = "light-green";
  var th = document.createElement('th');
  th.scope = "col";
  th.innerText = "dob";
  thead.append(th);

  var th = document.createElement('th');
  th.scope = "col";
  th.innerText = "fname";
  thead.append(th);

  var th = document.createElement('th');
  th.scope = "col";
  th.innerText = "lname";
  thead.append(th);

  var th = document.createElement('th');
  th.scope = "col";
  th.innerText = "Gender";
  thead.append(th);

  var th = document.createElement('th');
  th.scope = "col";
  th.innerText = "Email";
  thead.append(th);

  var th = document.createElement('th');
  th.scope = "col";
  th.innerText = "Address";
  thead.append(th);

  var th = document.createElement('th');
  th.scope = "col";
  th.innerText = "View";
  thead.append(th);

  newTable.append(thead);
  var tbody = document.createElement('tbody');
  newTable.append(tbody);
//add each row from database to tbody
  for (var row of resp.results) {
    if (row.id != '') {
      var newRow = document.createElement("tr");  //create a row
      //loop through each cell and label it accordingly
      var cell = document.createElement("td");
      cell.innerText = row.dob;
      newRow.append(cell);

      var cell = document.createElement("td");
      cell.innerText = row.fname;
      newRow.append(cell);

      var cell = document.createElement("td");
      cell.innerText = row.lname;
      newRow.append(cell);

      var cell = document.createElement("td");
      cell.innerText = row.gender;
      newRow.append(cell);

      var cell = document.createElement("td");
      cell.innerText = row.email;
      newRow.append(cell);

      var cell = document.createElement("td");
      cell.innerText = row.address;
      newRow.append(cell);

      //create a button to edit and delete the data
      var editButton = document.createElement("Input")
      editButton.setAttribute("type", "button");
      editButton.value = "View Info";
      editButton.className = "view btn dark-green"
      editButton.id = row.id;
      //editButton.setAttribute("onclick", "editRow(this.id)")    //calls function to update table when called
      newRow.append(editButton);
      tbody.append(newRow)  //add the row to the table body
    }
  }
  table.parentNode.replaceChild(newTable, table);   //replace the old table body with the new info
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