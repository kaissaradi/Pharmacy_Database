/* *********************************
              EVENTS 
************************************/
//on page load
window.addEventListener('load', function(event){
  readReq();    //Read Event - select all rows from pharmacy table
  event.preventDefault();
});
//reset selected rows from pharmacy table
document.getElementById('reset_btn').addEventListener('click', function(event){
  readReq();
  event.preventDefault();
});

//Create Event - create a get request with the users query to INSERT INTO the table
document.getElementById('add_pharmacy_btn').addEventListener('click', function(event){
   createReq();
  event.preventDefault();
});

//Search Event - create a get request with the users query to SELECT FROM the table
document.getElementById('search_pharmacy_btn').addEventListener('click', function(event){
  searchReq();
  event.preventDefault();
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
  th.innerText = "Name";
  thead.append(th);
  var th = document.createElement('th');
  th.scope = "col";
  th.innerText = "Address";
  thead.append(th);
  var th = document.createElement('th');
  th.scope = "col";
  th.innerText = "Phone";
  thead.append(th);
  var th = document.createElement('th');
  th.scope = "col";
  th.innerText = "Fax";
  thead.append(th);
  var th = document.createElement('th');
  th.scope = "col";
  th.innerText = "DEA";
  thead.append(th);
  var th = document.createElement('th');
  th.scope = "col";
  th.innerText = "Change Value";
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
      cell.innerText = row.name;
      newRow.append(cell);
      var cell = document.createElement("td");
      cell.innerText = row.address;
      newRow.append(cell);
      var cell = document.createElement("td");
      cell.innerText = row.phone;
      newRow.append(cell);
      var cell = document.createElement("td");
      cell.innerText = row.fax;
      newRow.append(cell);
      var cell = document.createElement("td");
      cell.innerText = row.dea;
      newRow.append(cell);
      //create a button to edit and delete the data
      var editButton = document.createElement("Input")
      editButton.setAttribute("type", "button");
      editButton.value = "Edit";
      editButton.className = "btn dark-green"
      editButton.style.float = "left";
      editButton.id = row.dea;
      //editButton.setAttribute("onclick", "editRow(this.id)")    //calls function to update table when called
      newRow.append(editButton);
      var deleteButton = document.createElement("Input")
      deleteButton.setAttribute("type", "button");
      deleteButton.value = "Delete";
      deleteButton.className = "btn dark-green"
      deleteButton.style.float = "right";
      deleteButton.id = "delete_btn";
      var input = document.createElement('input');
      input.type = "hidden";
      input.id = row.dea;
      deleteButton.append(input);
      //editButton.setAttribute("onclick", "editRow(this.id)")    //calls function to update table when called
      newRow.append(deleteButton);
      tbody.append(newRow)  //add the row to the table body
    }
  }
  table.parentNode.replaceChild(newTable, table);   //replace the old table body with the new info
}

function readReq(){
  //Read Event - create a get request to SELECT FROM the table
  var req = new XMLHttpRequest(); //create query string
  var payload = "/?" + "read=true";
  //send get request
  req.open("GET",payload,true);                 
  req.addEventListener('load', function(){                       
    if(req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText); 
      createTable(response, "pharmacies");    //display the response information in the pharmacy table
    }
    else {
      console.log("error");
    }
  });
  req.send(payload);
}

function createReq(){
  var req = new XMLHttpRequest(); 
  var form = document.getElementById('insert_pharmacy_form');
  var payload = "/?" + "create=true" +
  "&name="+form.elements.add_name.value+    
  "&dea="+form.elements.add_dea.value+
  "&address="+form.elements.add_address.value+
  "&phone="+form.elements.add_phone.value+
  "&fax="+form.elements.add_fax.value;
  //send get request
  req.open("GET",payload, true);                 
  req.addEventListener('load', function(){                       
    if(req.status >= 200 && req.status < 400){
      return;
    }
    else {
      console.log("error");
    }
  });
  req.send(payload);
}

function searchReq(){
  var req = new XMLHttpRequest(); 
  //create query string with regular expressions
  var form = document.getElementById('search_pharmacy_form');
  var name = "^" + form.elements.search_name.value;
  var dea = "^" + form.elements.search_dea.value;
  var address = "^" + form.elements.search_address.value;
  var phone = "^" + form.elements.search_phone.value;
  var fax = "^" + form.elements.search_fax.value ;
  var payload = "/?" + "search=true" +
  "&name="+name+    
  "&dea="+dea+
  "&address="+address+
  "&phone="+phone+
  "&fax="+fax;
  //send get request
  req.open("GET",payload, true);                 
  req.addEventListener('load', function(){                       
    if(req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText); 
      createTable(response, "pharmacies");    //display the response information in the pharmacy table
    }
    else {
      console.log("error");
    }
  });
  req.send(payload);
}












