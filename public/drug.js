/* *********************************
              EVENTS 
************************************/
//Read Event - select all rows from drug table
window.addEventListener('load', function(event){
  readReq();
  event.preventDefault();
});

//reset selected rows from drug table
document.getElementById('reset_btn').addEventListener('click', function(event){
  readReq();
  event.preventDefault();
});

//Create Event - create a get request with the users query to INSERT INTO the table
document.getElementById('add_drug_btn').addEventListener('click', function(event){
  createReq();
  event.preventDefault();
   setTimeout(function(){
    readReq(); 
  }, 250);
});

//Search Event - create a get request with the users query to SELECT FROM the table
document.getElementById('search_drug_btn').addEventListener('click', function(event){
  searchReq();
  event.preventDefault();
});
//update Event
document.body.addEventListener('click', function(event){
  if(event.srcElement.className == "update btn dark-green"){
    console.log(event.srcElement.id);
    updateDrug(event.srcElement.id);
    setTimeout(function(){
      readReq(); 
    }, 250);
  }
});

//Delete Event - delete drug that was alicked
document.body.addEventListener('click', function(event){
  if(event.srcElement.className == "delete btn dark-green"){
    deleteReq(event.srcElement.id);
    setTimeout(function(){
      readReq(); 
    }, 250);
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
  var th = addElement(thead, 'th', undefined, undefined, 'NDC');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'Name');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'Strength');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'Price');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'QTY');
  th.scope = "col";
  var th = addElement(thead, 'th', undefined, undefined, 'Update');
  th.scope = "col";
  //create table body with each row
  var tbody = addElement(newTable, 'tbody');
  for (var row of resp.results) {     //create a row for each entry
    if (row.id != '') {
      var newRow =  addElement(tbody, 'tr');
      //loop through each cell and label it accordingly
      var cell = addElement(newRow, 'td', undefined, undefined, row.ndc);
      var cell = addElement(newRow, 'td', undefined, undefined, row.name);
      var cell = addElement(newRow, 'td', undefined, undefined, row.strength);
      var cell = addElement(newRow, 'td', undefined, undefined, row.price);
      var cell = addElement(newRow, 'td', undefined, undefined, row.qty);
      //create a button to edit and delete the data
      var editButton = addElement(newRow, 'Input', 'update btn dark-green', row.ndc)
      editButton.setAttribute("type", "button");
      editButton.value = "Update";
      editButton.style.float = "left";
      //create delete button
      var deleteButton = addElement(newRow, 'Input', 'delete btn dark-green', row.ndc);
      deleteButton.setAttribute("type", "button");
      deleteButton.value = "Delete";
      deleteButton.style.float = "right";
    }
  }
}
//Request to SELECT all rows from table
function readReq(){
  //Read Event - create a get request to SELECT FROM the table
  var req = new XMLHttpRequest(); //create query string
  var payload = "/drug?" + "read=true&pharmacy=1";
  //send get request
  req.open("GET",payload,true);                 
  req.addEventListener('load', function(){                       
    if(req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText); 
      createTable(response, "drugs");    //display the response information in the pharmacy table
    }
    else {
      console.log("error");
    }
  });
  req.send(payload);
}
//Request to INSERT a new entry in the table
function createReq(){
  var req = new XMLHttpRequest(); //create query string
  var form = document.getElementById('insert_drug_form');
  var payload = "/drug?" + "create=true" +
  "&name="+form.elements.add_name.value+
  "&ndc="+form.elements.add_ndc.value+
  "&strength="+form.elements.add_strength.value+
  "&price="+form.elements.add_price.value+
  "&pharmacy=1";
  //send get request
  req.open("GET",payload, true);                 
  req.addEventListener('load', function(){                       
    if(req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText); 
      createTable(response, "drugs");    //display the response information in the pharmacy table
    }
    else {
      console.log("error");
    }
  });
  req.send(payload);
}
//DMQ to search for specific drug using reglar expressions
function searchReq(){
  var req = new XMLHttpRequest(); 
  //create query string with regular expressions
  var form = document.getElementById('search_drug_form');
  var name = "^" + form.elements.search_name.value;
  var ndc = "^" + form.elements.search_ndc.value.toString();
  var strength = "^" + form.elements.search_strength.value.toString();
  var payload = "/drug?" + "search=true" +
  "&name="+name+
  "&ndc="+ndc+
  "&strength="+strength+
  "&pharmacy=1";
  //send get request
  req.open("GET",payload, true);                 
  req.addEventListener('load', function(){                       
    if(req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText); 
      createTable(response, "drugs");    //display the response information in the pharmacy table
    }
    else {
      console.log("error");
    }
  });
  req.send(payload);
}
//function to UPDATE the qty of a drug
function updateDrug(ndc){
  var req = new XMLHttpRequest(); 
  //create query string with regular expressions
  var payload = "/drug?" + "update=true" +
  "&ndc="+ ndc +
  "&qty=" + document.getElementById('update_qty').value +
  "&pharmacy=1";
  //send get request
  req.open("GET",payload, true);                 
  req.addEventListener('load', function(){                       
    if(req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText); 
      createTable(response, "drugs");    //display the response information in the pharmacy table
    }
    else {
      console.log("error");
    }
  });
  req.send(payload);
}

function deleteReq(ndc){
  var req = new XMLHttpRequest(); 
  //create query string with regular expressions
  var payload = "/drug?delete=true&ndc="+ndc+"&pharmacy=1";
  //send get request
  req.open("GET",payload, true);                 
  req.addEventListener('load', function(){                       
    if(req.status >= 200 && req.status < 400){
      console.log("delete");
    }
    else {
      console.log("error");
    }
  });
  req.send(payload);
}