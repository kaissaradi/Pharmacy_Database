//Function to add a row to the html table and fill it in with the information passed to it from the SQL database table
function createTable(resp){
  var table = document.getElementById("pharmacy_tbody");
  table.id = "oldTable";
  var newTable = document.createElement('tbody');
  newTable.setAttribute("id", "pharmacy_tbody");
  //create new table body, using response data for values
  for (var row of resp.results) {
    if (row.id != '') {
      var newRow = document.createElement("tr");  //create a row
      //loop through each cell and label it accordingly
      var cell = document.createElement("td");
      cell.innerText = row.name;
      newRow.appendChild(cell);
      var cell = document.createElement("td");
      cell.innerText = row.address;
      newRow.appendChild(cell);
      var cell = document.createElement("td");
      cell.innerText = row.phone;
      newRow.appendChild(cell);
      var cell = document.createElement("td");
      cell.innerText = row.fax;
      newRow.appendChild(cell);
      var cell = document.createElement("td");
      cell.innerText = row.dea;
      newRow.appendChild(cell);
      //create a button to edit the data
  /*       var editButton = document.createElement("Input")
      editButton.setAttribute("type", "button");
      editButton.setAttribute("value", "Edit Values");
      editButton.setAttribute("id", "1" + row.id)
      editButton.setAttribute("onclick", "editRow(this.id)")    //calls function to update table when called
      newRow.appendChild(editButton); */
      newTable.appendChild(newRow)
    }
  }
  table.parentNode.replaceChild(newTable, table);
}
//create a get request to read data
var req = new XMLHttpRequest(); //create query string
var payload = "/?" + "read=true";
//send get request
req.open("GET",payload,true);                 
req.addEventListener('load', function(){                       
  if(req.status >= 200 && req.status < 400){
    var response = JSON.parse(req.responseText); 
    createTable(response);
  }
  else {
    console.log("error");
  }
});
req.send(payload);
//loads the information and add it to the table when clicked 
document.getElementById('add_pharmacy_btn').addEventListener('click', function(event){
  var req = new XMLHttpRequest(); //create query string
  var form = document.getElementById('insert_pharmacy_form');
  var payload = "/?" + "create=true" +
  "&name="+form.elements.name.value+    
  "&dea="+form.elements.dea.value+
  "&address="+form.elements.address.value+
  "&phone="+form.elements.phone.value+
  "&fax="+form.elements.fax.value;
  //send get request
  req.open("GET",payload, true);                 
  req.addEventListener('load', function(){                       
    if(req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText); 
      createTable(response);
    }
    else {
      console.log("error");
    }
  });
  req.send(payload);
  event.preventDefault();
})
