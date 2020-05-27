//Function to add a row to the html table and fill it in with the information passed to it from the SQL database table
function addRow(name, dea, address, phone, fax, Iden){
  var table = document.getElementById("pharmacies");
  var newRow = document.createElement("tr");  //create a row 
  data = [name, address, phone, fax, dea] //add vaues to a list
  //loop through each cell and label it accordingly
  for(var col = 0; col < 5; col++){
      var cell = document.createElement("td");
      cell.textContent = data[col];
      newRow.appendChild(cell);
  }
  //create a button to edit the data
  var editButton = document.createElement("Input")
  editButton.setAttribute("type", "button");
  editButton.setAttribute("value", "Edit Values");
  newRow.appendChild(editButton);
  table.appendChild(newRow)
  //button to delete the row
  var deleteButton = document.createElement("Input")
  deleteButton.setAttribute("type", "button");
  deleteButton.setAttribute("value", "Delete Row");
  deleteButton.setAttribute("onclick", "deleteRow(this.id)"); //when clicked calls the delete function
  deleteButton.setAttribute("id", Iden);
  newRow.appendChild(deleteButton);

  table.setAttribute("border", "1px");
}


//loads the information and add its to the table when clicked 
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
      console.log(response);      
      // for(obj in response){ //for each object in the response list, add a row with the name, dea, address, phone, and fax
      //   addRow(obj[0],obj[1],obj[2],obj[3],obj[4],obj[5]);
      // }
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
