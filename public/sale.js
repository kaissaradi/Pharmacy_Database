/* *********************************
              EVENTS 
************************************/
window.addEventListener('load', function(event){
  readReq();    //Read Event - select all rows from pharmacy table
  readReqOrder(); //select info for all completed orders
  event.preventDefault();
});

//Create Event - create a get request with the users query to INSERT INTO the table
document.getElementById('add_sale_btn').addEventListener('click', function(event){
  createReq();
  event.preventDefault();
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
  newTable.className = "table table-bsaleed table-hover table-dark";
  table.parentNode.replaceChild(newTable, table);   
  //create table head with column headers
  var thead = addElement(newTable, 'thead', 'light-green');
  var th = addElement(thead, 'th', undefined, undefined, 'Sale #');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'Name');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'Drug');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'Time');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'Price');
  th.scope = "col";
  //create table body with each row
  var tbody = addElement(newTable, 'tbody');
  for (var row of resp.results) {     //create a row for each entry
    if (row.id != '') {
      var newRow =  addElement(tbody, 'tr');
      //loop through each cell and label it accordingly
      var cell = addElement(newRow, 'td', undefined, undefined, row.id);
      var cell = addElement(newRow, 'td', undefined, undefined, (row.fname + " "  + row.lname));
      var cell = addElement(newRow, 'td', undefined, undefined, row.name);
      var cell = addElement(newRow, 'td', undefined, undefined, row.time);
      var cell = addElement(newRow, 'td', undefined, undefined, row.price);
    }
  }
}

//Function to prescription table
function createOrderTable(resp, table_id){
  var table = document.getElementById(table_id);
  table.id = "oldTable";
  //create new table, using response data for values and replace the current table on the page
  var newTable = document.createElement('table');
  newTable.id = table_id;
  newTable.className = "table table-bordered table-hover table-dark";
  table.parentNode.replaceChild(newTable, table);   
  //create table head with column headers
  var thead = addElement(newTable, 'thead', 'light-green');
  var th = addElement(thead, 'th', undefined, undefined, 'Order #');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'Name');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'Drug');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'Time');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'Price');
  th.scope = "col";
  //create table body with each row
  var tbody = addElement(newTable, 'tbody');
  for (var row of resp.results) {     //create a row for each entry
    if (row.id != '') {
      var newRow =  addElement(tbody, 'tr');
      //loop through each cell and label it accordingly
      var cell = addElement(newRow, 'td', undefined, undefined, row.id);
      var cell = addElement(newRow, 'td', undefined, undefined, (row.fname + " "  + row.lname));
      var cell = addElement(newRow, 'td', undefined, undefined, row.name);
      var cell = addElement(newRow, 'td', undefined, undefined, row.time);
      var cell = addElement(newRow, 'td', undefined, undefined, row.price);
    }
  }
}

function readReq(){
  //Read Event - create a get request to SELECT FROM the table
  var req = new XMLHttpRequest(); //create query string
  var payload = "/sale?" + "read=true";
  //send get request
  req.open("GET",payload,true);                 
  req.addEventListener('load', function(){                       
    if(req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText); 
      createTable(response, "sale_table");    //display the response information in the pharmacy table
    }
    else {
      console.log("error");
    }
  });
  req.send(payload);
}

function readReqOrder(){
  //Read Event - create a get request to SELECT FROM the table
  var req = new XMLHttpRequest(); //create query string
  var payload = "/sale?" + "readOrder=true";
  //send get request
  req.open("GET",payload,true);                 
  req.addEventListener('load', function(){                       
    if(req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText); 
      createTable(response, "closed_order_table");    //display the response information in the pharmacy table
    }
    else {
      console.log("error");
    }
  });
  req.send(payload);
}

function createReq(){
  var req = new XMLHttpRequest(); //create query string
  var form = document.getElementById('insert_sale_form');
  var payload = "/sale?" + "create=true" +
  "&fname="+form.elements.add_fname.value+
  "&lname="+form.elements.add_lname.value+
  "&dob="+form.elements.add_dob.value.toString()+
  "&email="+form.elements.add_email.value+
  "&phone="+form.elements.add_phone.value+
  "&address="+form.elements.add_address.value+
  "&gender="+form.elements.add_gender.value;
  //send get request
  req.open("GET",payload, true);                 
  req.addEventListener('load', function(){                       
    if(req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText); 
      createTable(response, "sale_table");    //display the response information in the pharmacy table
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
  var form = document.getElementById('search_sale_form');
  var fname = "^" + form.elements.search_fname.value;
  var lname = "^" + form.elements.search_lname.value;
  var name = "^" + form.elements.search_drug_name.value
  var payload = "/sale?" + "search=true" +
  "&fname="+fname+
  "&lname="+lname+
  "&name="+name;
  //send get request
  req.open("GET",payload, true);                 
  req.addEventListener('load', function(){                       
    if(req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText); 
      createTable(response, "sale_table");    //display the response information in the pharmacy table
    }
    else {
      console.log("error");
    }
  });
  req.send(payload);
}

function getsale(id){
  var req = new XMLHttpRequest(); 
  var payload = "/sale?" + "saleid=true" + "&id=" + id;
  //send get request
  req.open("GET",payload, true);                 
  req.addEventListener('load', function(){                       
    if(req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText); 
      createOrderTable(response, "sale_table");    //display the response information in the pharmacy table
    }
    else {
      console.log("error");
    }
  });
  req.send(payload);
}
