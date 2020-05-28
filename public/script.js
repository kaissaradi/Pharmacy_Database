
//Function to add a row to the html table and fill it in with the information passed to it from the SQL database table
function createTable(resp){
  var table = document.getElementById("pharmacies");
  table.id = "oldTable";
  var newTable = document.createElement('tbody');
  newTable.setAttribute("id", "pharmacies");

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

var req = new XMLHttpRequest();
req.open("GET","/view", true);
req.addEventListener('load', function(){
  if(req.status >= 200 && req.status < 400){
    var response = JSON.parse(req.responseText);
    createTable(response);
  }
  else {
      console.log("error");
  }
});
req.send("/view");

//loads the information and add it to the table when clicked 
document.getElementById('addPharm').addEventListener('click', function(event){
  var req = new XMLHttpRequest();
  var payload = "/?" + "name="+insertP.elements.name.value+    
  "&dea="+insertP.elements.dea.value+
  "&address="+insertP.elements.address.value+
  "&phone="+insertP.elements.phone.value+
  "&fax="+insertP.elements.fax.value;

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
//function to delete the row which uses a POST method and passes the id of the row to be deleted, then deletes the row from the HTML table
function deleteRow(row){
  var table = document.getElementById("pharmacies");
  var payload = "/?id=" + row.elements.id;
  req.open("POST",payload, true);                 
  req.addEventListener('load', function(){                       
    if(req.status >= 200 && req.status < 400){
      table.deleteRow(row.rowIndex);
    }
    else {
        console.log("error");
    }
  });
  req.send(param);
  event.preventDefault();
}
