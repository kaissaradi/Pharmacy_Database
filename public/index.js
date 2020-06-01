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
  setTimeout(function(){
    readReq(); 
  }, 250);
});

//Search Event - create a get request with the users query to SELECT FROM the table
document.getElementById('search_pharmacy_btn').addEventListener('click', function(event){
  searchReq();
  event.preventDefault();
});

//Select Event - create a get to view patient prescriptions in a new table
document.body.addEventListener('click', function(event){
  if(event.srcElement.className == "delete btn dark-green"){
    deleteReq(event.srcElement.id);
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
  var th = addElement(thead, 'th', undefined, undefined, 'Name');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'Address');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'Phone');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'Fax');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'DEA');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'Change');
  th.scope = "col";
  //create table body with each row
  var tbody = addElement(newTable, 'tbody');
  for (var row of resp.results) {     //create a row for each entry
    if (row.id != '') {
      var newRow =  addElement(tbody, 'tr');
      //loop through each cell and label it accordingly
      var cell = addElement(newRow, 'td', undefined, undefined, row.name);
      var cell = addElement(newRow, 'td', undefined, undefined, row.address);
      var cell = addElement(newRow, 'td', undefined, undefined, row.phone);
      var cell = addElement(newRow, 'td', undefined, undefined, row.fax);
      var cell = addElement(newRow, 'td', undefined, undefined, row.dea);
      //create a button to edit and delete the data
      var editButton = addElement(newRow, 'Input', 'edit btn dark-green', row.dea)
      editButton.setAttribute("type", "button");
      editButton.value = "Edit";
      editButton.style.float = "left";
      //create delete button
      var deleteButton = addElement(newRow, 'Input', 'delete btn dark-green', row.dea);
      deleteButton.setAttribute("type", "button");
      deleteButton.value = "Delete";
      deleteButton.style.float = "right";
    }
  }
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

function deleteReq(dea){
  var req = new XMLHttpRequest(); 
  //create query string with regular expressions
  var payload = "/?" + "delete=true" +
  "&dea="+dea;
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












