
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

//loads the information and add its to the table when clicked
document.getElementById('addButton').addEventListener('click', function(event){
  var quer = document.getElementById('newEntry')
  var req = new XMLHttpRequest();
  var payload = "/insert?name="+quer.elements.workout.value+
  "&reps="+quer.elements.reps.value+
  "&weight="+quer.elements.weight.value+
  "&date="+quer.elements.date.value+
  "&units="+quer.elements.units.value;
  console.log(payload);
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
});

//function to delete the row which uses a GET method and passes the id of the row to be deleted, then deletes the row from the HTML table
function deleteRow(rowID){
  var payload = "/delete?id=" + rowID;
  req.open("get",payload, true);
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
}

function editRow(rowID){
  var newID = rowID.slice(1);
  var quer = document.getElementById('newEntry')
  var req = new XMLHttpRequest();
  var payload = "/update?name="+quer.elements.workout.value+
  "&reps="+quer.elements.reps.value+
  "&weight="+quer.elements.weight.value+
  "&date="+quer.elements.date.value+
  "&units="+quer.elements.units.value+"&id="+newID;
  console.log(payload);
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
}
